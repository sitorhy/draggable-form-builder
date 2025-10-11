<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  inject,
  onBeforeMount,
  type PropType,
  provide,
  ref,
  watch
} from 'vue';
import type {
  NormalizeDataSource,
  RendererItemDefinition
} from '../../../types';
import { useBindingStore } from '../../../store/binding';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useFunctionStore } from '../../../store/function.ts';
import { useFunctionContext } from '../common/function-context.ts';
import {parseUri} from "../../../visual/data-source/config.ts";

const props = defineProps({
  schema: {
    type: Object as PropType<RendererItemDefinition>,
    default: () => ({})
  },
  message: {
    type: Object as PropType<{
      info: (message: string) => void;
      error: (message: string) => void;
      success: (message: string) => void;
    }>,
    default: null
  }
});

const { emptyBindingPath } = useEmptyBindingPath();
const bindingStore = useBindingStore();
const funcStore = useFunctionStore();

const bindingPath = inject<ComputedRef<string>>(
    'bindingPath',
    emptyBindingPath
);
const formItemBindingPath = inject<ComputedRef<string>>(
    'formItemBindingPath',
    emptyBindingPath
);

const { functionContext } = useFunctionContext({
  getBindingPath: function () {
    return bindingPath.value;
  },
  message: props.message
});

const injectionObj = ref<Record<string, any>>({});
const injectionEvents = ref<Record<string, (...args: any[]) => any>>({});

const binding = computed(() => {
  return props.schema.binding;
});

const events = computed(() => {
  return props.schema.events;
});

async function injectProps(
    prop: string,
    result:
        | {
      source: string;
      value: any;
      fullBindingPath: string;
    }
        | undefined,
    funNames?: string[]
) {
  if (!funNames) {
    // 同步
    if (result) {
      const { value, fullBindingPath } = result;

      injectionObj.value[prop] = value;
      if (result.source === 'static') {
        injectionObj.value['update:' + prop] = function (value: any) {
          bindingStore.updateStaticContext(fullBindingPath, value);
        };
      } else {
        injectionObj.value['update:' + prop] = function (value: any) {
          bindingStore.updateBinding(fullBindingPath, value);
        };
      }
      return;
    } else {
      delete injectionObj.value[prop];
      delete injectionObj.value['update:' + prop];
    }
  } else {
    // 需要过滤器处理返回值
    const moduleDescriptors = await Promise.all(
        funNames.map(async (name: string) => {
          const module = funcStore.findFunctionCodeByName(name);
          if (!module) {
            console.warn(`Cannot find module '${name}'`);
          }
          return module;
        })
    );
    const modules = await Promise.all(
        moduleDescriptors.filter((i) => !!i).map((m) => funcStore.loadModule(m))
    );

    injectionObj.value[prop] = modules.reduce(
        (acc, module) => {
          const func = module['default'];
          if (typeof func === 'function') {
            return (func as (...args: any[]) => any).call(
                functionContext.value,
                acc
            );
          }
          return acc;
        },
        result ? result.value : undefined
    );
    if (result) {
      const { fullBindingPath } = result;
      if (result.source === 'static') {
        injectionObj.value['update:' + prop] = function (value: any) {
          bindingStore.updateStaticContext(fullBindingPath, value);
        };
      } else {
        injectionObj.value['update:' + prop] = function (value: any) {
          bindingStore.updateBinding(fullBindingPath, value);
        };
      }
    } else {
      delete injectionObj.value['update:' + prop];
    }
  }
}

function resolveLocalSchema(
    prop: string,
    dataSourceSchema: NormalizeDataSource
) {
  const resolvedPath = formItemBindingPath.value || bindingPath.value;
  if (resolvedPath) {
    switch (dataSourceSchema.host) {
      case 'path':
      {
        let funNames;
        const filter = dataSourceSchema.filter;
        if (filter) {
          funNames = filter.split(',');
        }

        let result = bindingStore.searchBinding(
            resolvedPath,
            dataSourceSchema.path
        );
        if (!result) {
          result = bindingStore.searchStaticContext(
              bindingPath.value,
              dataSourceSchema.path
          );
        }

        injectProps(prop, result, funNames);
      }
        break;
    }
  }
}

/**
 * 将事件名称（如 'click'）转换为 Vue/React 风格的事件响应属性名称（如 'onClick'）。
 *
 * @param eventName 原始事件名称（小写，如 'click' 或 'change'）
 * @returns 转换后的属性名称（如 'onClick' 或 'onChange'）
 */
function toVueEventPropName(eventName: string): string {
  if (eventName.length === 0) {
    return '';
  }

  // 1. 获取事件名的第一个字母，并将其转换为大写
  const firstLetter = eventName.charAt(0).toUpperCase();

  // 2. 获取事件名其余的部分
  const restOfString = eventName.slice(1);

  // 3. 组合 'on' + 大写首字母 + 剩余部分
  return `on${firstLetter}${restOfString}`;
}

const NOOP = function () {
  console.warn('未知函数模块');
};

async function resolveEvents() {
  if (events.value) {
    const nextEventHandlers = await Promise.all(
        Object.keys(events.value).map(async (eventName) => {
          const moduleName = (events.value as Record<string, string>)[eventName];
          if (moduleName) {
            const moduleDescription =
                await funcStore.findFunctionCodeByName(moduleName);
            if (moduleDescription) {
              const module = await funcStore.loadModule(moduleDescription);
              const func = module['default'];
              if (typeof func === 'function') {
                return [
                  toVueEventPropName(eventName),
                  (func as (...args: any[]) => any).bind(functionContext.value)
                ];
              }
            }
          }
          return [toVueEventPropName(eventName), NOOP];
        })
    );

    injectionEvents.value = (
        nextEventHandlers as [string, Record<string, (...args: any[]) => any>][]
    ).reduce(
        (
            s: Record<string, (...args: any[]) => any>,
            i: [string, Record<string, (...args: any[]) => any>]
        ) => Object.assign(s, { [i[0]]: i[1] }),
        {}
    );
  }
}

function resolveBinding() {
  const uriMap = binding.value;
  if (uriMap) {
    Object.keys(uriMap).forEach((prop) => {
      const uri = uriMap[prop];
      const dataSourceSchema = parseUri(uri);
      switch (dataSourceSchema.schema) {
        case 'object': {
          resolveLocalSchema(prop, dataSourceSchema);
        }
      }
    });
  }
}

watch(
    bindingStore.$state.state,
    function () {
      resolveBinding();
    },
    {
      immediate: true
    }
);

const funModuleNames = computed(() => {
  return funcStore.$state.modules.keys();
});

watch(funModuleNames, function () {
  resolveEvents();
});

onBeforeMount(() => {
  resolveBinding();
  resolveEvents();
});

/**
 * 深度合并对象，如果遇到同名且类型为函数的属性，
 * 则返回一个新的包装函数，确保 injectionEvents 的函数先执行，injectionObj 的函数后执行。
 * @param obj1 - 优先级较低的对象（基础属性或后执行的函数）
 * @param obj2 - 优先级较高的对象（事件或先执行的函数）
 * @returns 合并后的新对象
 */
function mergeListeners(
    obj1: Record<string, any>,
    obj2: Record<string, any>
): Record<string, any> {
  // 1. 以 obj1 为基础，包含所有不冲突的属性
  const merged = { ...obj1 };

  // 2. 遍历 obj2 的所有属性
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      // 检查属性是否同时存在于两个对象中，并且都是函数
      if (
          val1 &&
          val2 &&
          typeof val1 === 'function' &&
          typeof val2 === 'function'
      ) {
        // --- 核心合并逻辑：创建包装函数 ---

        merged[key] = function (...args: any[]) {
          let result2;
          let result1;

          // 1. 执行 obj2 (injectionEvents) 的函数
          // 通常事件监听器不需要返回值，但为了健壮性保留结果
          try {
            result2 = val2.apply(this, args);
          } catch (e) {
            console.error(
                `Error executing event listener from injectionEvents (${key}):`,
                e
            );
          }

          // 2. 执行 obj1 (injectionObj) 的函数
          try {
            result1 = val1.apply(this, args);
          } catch (e) {
            console.error(
                `Error executing original property function (${key}):`,
                e
            );
          }

          // 返回 obj2 的结果，或根据具体业务需求决定返回哪个
          return result2 ?? result1;
        };
      } else {
        // 如果 obj2 的属性与 obj1 不冲突，或者不是函数，直接使用 obj2 的属性（覆盖）
        // 确保非函数的同名属性被 injectionEvents 覆盖
        merged[key] = val2;
      }
    }
  }

  return merged;
}

const propsInjection = computed(() => {
  return mergeListeners(injectionEvents.value, injectionObj.value);
});

provide('bindingProps', propsInjection);
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
