<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {useMessage} from "naive-ui";
import {ErrorCircle20Regular} from "@vicons/fluent";
import {useBindingConnector} from "../../../store/binding.ts";

const message = useMessage();

const schema = defineModel('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});

const innerValue = ref(null);

const id = computed(function () {
  return schema.value.id;
});

const bindingPath = inject<string>('bindingPath', '');

const {updateBinding} = useBindingConnector({
  path: bindingPath,
  onBindingChange: function (newVal) {
    if (newVal !== innerValue.value) {
      innerValue.value = newVal;
    }
  },
  onError: (e) => message.error(e.message),
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-date-picker v-if="schema.props" v-bind="schema.props" v-model:value="innerValue" year-format="Y"
                 @update-value="updateBinding"/>
  <n-empty v-else description="DatePicker">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>