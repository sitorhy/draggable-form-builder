<script setup lang="ts">
import {computed, onMounted} from "vue";
import JsonRenderer from "./components/put/JsonRenderer.vue";
import BindingContext from "./components/put/data/BindingContext.vue";
import {useSchemaStore} from "./store/schema.ts";
import {useAppInit} from "./components/put/common/app.ts";
import {useBindingStore} from "./store/binding.ts";

const schemaStore = useSchemaStore();
const bindingStore = useBindingStore();
const schema = computed(() => schemaStore.$state.schema);

useAppInit();

onMounted(() => {
  console.log(bindingStore.$state);
})
</script>

<template>
  <div
      style="
								width: 100%;
								height: 100%;
								margin: auto;
								position: relative;
							"
  >
    <BindingContext custom-path="">
      <JsonRenderer v-model:schema="schema" />
    </BindingContext>
  </div>
</template>
