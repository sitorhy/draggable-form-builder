<script setup lang="ts">
import { computed, ref } from 'vue';
import { type FormRules, useMessage } from 'naive-ui';
import FormRulePathEditorModal from './FormRulePathEditorModal.vue';
import FormItemRuleEditor from './FormItemRuleEditor.vue';

const message = useMessage();

const rules = defineModel<FormRules>('value', {});

const pathModelShow = ref(false);

function onAddPath() {
	pathModelShow.value = true;
}

function onConfirm(value: { path: string }) {
	const path = value.path;
	if (rules.value && rules.value[path]) {
		message.warning('路径已存在');
		return;
	}
	rules.value = {
		...rules.value,
		[path]: []
	};
}

const pathList = computed(() => {
	if (!rules.value) {
		return [];
	}
	return Object.keys(rules.value);
});

function removeRulesSet(path: string) {
	if (!rules.value) {
		return;
	}
	delete rules.value[path];
}
</script>

<template>
	<div class="full">
		<n-form class="full" :model="rules" v-if="rules">
			<n-form-item
				class="full"
				v-for="path in pathList"
				:key="path"
				:path="path"
				:label="path"
			>
				<FormItemRuleEditor
					@remove="removeRulesSet(path)"
					class="full"
					v-model:value="rules[path]"
				/>
			</n-form-item>
		</n-form>
		<n-button type="primary" @click="onAddPath">添加对象路经</n-button>
	</div>

	<FormRulePathEditorModal @confirm="onConfirm" v-model:show="pathModelShow" />
</template>

<style scoped lang="scss">
.full {
	width: 100%;
}
</style>
