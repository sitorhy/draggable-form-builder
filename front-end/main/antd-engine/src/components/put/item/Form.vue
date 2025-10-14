<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  inject,
  onBeforeMount,
  ref,
  watch
} from 'vue';
import {ErrorCircle20Regular} from '@vicons/fluent';
import JsonRenderer from '../JsonRenderer.vue';
import {useReferenceRegister} from "engine-commons/store/reference-context.ts";
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyBindingPath} from "engine-commons/components/put/common/binding-path.ts";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import {useBindingConnector} from "engine-commons/store/binding.ts";
import {useRulesResolver} from "engine-commons/components/put/common/rules.ts";

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

const {emptyBindingPath} = useEmptyBindingPath();
const bindingPath = inject<ComputedRef<string>>(
    'bindingPath',
    emptyBindingPath
);

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const connectorOptions = computed(() => {
  return {
    path: bindingPath ? bindingPath.value : ''
  };
});
const {updateBinding, queryBinding} = useBindingConnector(connectorOptions);

const message = inject<
    ComputedRef<{
      info: (text: string) => void;
      success: (text: string) => void;
      error: (text: string) => void;
    }>
>('messageTool');

const {resolveRules} = useRulesResolver({
  getBindingPath: function () {
    return bindingPath.value;
  },
  getMessageTool: () => {
    return message?.value
  }
});

onBeforeMount(() => {
  const formValue = queryBinding();
  if (!formValue) {
    updateBinding({});
  }
});

const modelValue = computed({
  get() {
    return queryBinding();
  },
  set(value: any) {
    updateBinding(value);
  }
});

const rulesResolved = ref({});

const rules = computed(() => {
  if (schema.value && schema.value.props && schema.value.props.rules) {
    return schema.value.props.rules;
  }
  return null;
});

watch(
    rules,
    () => {
      if (rules.value) {
        rulesResolved.value = resolveRules(rules.value);
      } else {
        rulesResolved.value = {};
      }
    },
    {
      immediate: true
    }
);

const {componentRef} = useReferenceRegister(bindingPath);

const propsReduce = computed(() => ({
  ...schema.value.props,
  ...bindingProps.value,
}));

const propsCombined = computed(() => ({
  ...propsReduce.value,
  layout: propsReduce.value.labelPlacement === 'left' ? 'horizontal' : 'vertical'
}))
</script>

<template>
  <a-form
      v-if="schema.props && schema.children"
      v-bind="propsCombined"
      :model="modelValue"
      :rules="rulesResolved"
      ref="componentRef"
  >
    <JsonRenderer
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </a-form>
  <a-empty v-else description="Form">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
