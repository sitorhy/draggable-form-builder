<script setup lang="ts">
import {computed, type ComputedRef, inject} from 'vue';
import {ErrorCircle20Regular} from '@vicons/fluent';
import {message} from "ant-design-vue";
import {useReferenceRegister} from "engine-commons/store/reference-context.ts";
import {useBindingConnector} from "engine-commons/store/binding.ts";
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyBindingPath} from "engine-commons/components/put/common/binding-path.ts";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import dayjs from "dayjs";

const [messageApi] = message.useMessage();

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

const {emptyBindingPath} = useEmptyBindingPath();

const bindingPath = inject<ComputedRef<string>>(
    'bindingPath',
    emptyBindingPath
);
const formItemBindingPath = inject<ComputedRef<string>>(
    'formItemBindingPath',
    emptyBindingPath
);

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const connectorOptions = computed(() => {
  return {
    path: formItemBindingPath?.value || bindingPath?.value || ''
  };
});
const {updateBinding, queryBinding} = useBindingConnector(connectorOptions, {
  onError: (e: Error) => messageApi.error(e.message)
});

const propsReduce = computed(() => {
  return {...schema.value.props, ...bindingProps.value};
});

// 组件 BUG 不支持多个 @update:value
const propsReduceMod = computed(() => {
  const {['onUpdate:value']: rm, ...oops} = propsReduce.value;
  return oops;
});

const modelValue = computed({
  get() {
    const timestamp = queryBinding();
    return !timestamp ? timestamp : dayjs(timestamp);
  },
  set(value: any) {
    const timestamp = value.valueOf();
    updateBinding(timestamp);
    if (typeof propsReduce.value['onUpdate:value'] === 'function') {
      propsReduce.value['onUpdate:value'](timestamp);
    }
  }
});

const {componentRef} = useReferenceRegister(bindingPath);
</script>

<template>
  <a-date-picker
      v-if="schema.props"
      v-bind="propsReduceMod"
      v-model:value="modelValue"
      ref="componentRef"
  />
  <a-empty v-else description="DatePicker">
    <template #image>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
