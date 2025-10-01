<script setup lang="ts">
import {computed} from "vue";
import JsonRenderer from "./components/put/JsonRenderer.vue";
import BindingContext from "./components/put/data/BindingContext.vue";
import {useSchemaStore} from "./store/schema.ts";
import {useAppInit} from "./components/put/common/app.ts";

const schemaStore = useSchemaStore();
const schema = computed(() => schemaStore.$state.schema);

useAppInit();
</script>

<template>
  <div
      class="preview"
      style="
								width: 100%;
								height: 100%;
								margin: auto;
								position: relative;
							"
  >
    <BindingContext custom-path="">
      <JsonRenderer v-model:schema="schema"/>
    </BindingContext>
  </div>
</template>
