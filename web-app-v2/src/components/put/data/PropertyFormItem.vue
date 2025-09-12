<script setup lang="ts">
import {
	Edit24Regular,
	Checkmark24Regular,
	Dismiss24Regular
} from '@vicons/fluent';
import { computed, type PropType, ref, type Component, nextTick } from 'vue';
import { type FormItemRule, NInput } from 'naive-ui';

const props = defineProps({
	prop: {
		type: String,
		default: '',
		required: true
	},
	validator: {
		type: Function as PropType<(rule: FormItemRule, value: string) => boolean>,
		default: null
	},
	message: {
		type: String,
		default: '该属性存在填写校验'
	},
	trigger: {
		type: Array as PropType<string[]>,
		default: () => ['input', 'blur']
	},
	component: {
		type: Object as PropType<Component>,
		default: () => NInput
	}
});

const rules = computed(function () {
	return {
		[props.prop]: Object.assign(
			{
				required: true,
				validator: props.validator
			},
			props.message
				? {
						message: props.message
					}
				: {}
		)
	};
});

const modelValue = defineModel('value');

const formRef = ref();
const isEditing = ref(false);
const copyValue = ref();

function edit() {
	copyValue.value = {
		[props.prop]: structuredClone(modelValue.value)
	};
	isEditing.value = true;
}

function confirm() {
	formRef.value
		.validate((errors: Error[]) => {
			if (!errors || !errors.length) {
				modelValue.value = copyValue.value[props.prop];
				cancel();
			}
		})
		.catch(function () {});
}

function cancel() {
	isEditing.value = false;
	nextTick(() => {
		copyValue.value = null;
	});
}
</script>

<template>
	<div class="input-container">
		<div class="display">
			<component
				:is="component"
				v-if="!isEditing"
				disabled
				placeholder=""
				v-model:value="modelValue"
			/>
			<n-form
				v-else
				ref="formRef"
				:model="copyValue"
				:rules="rules"
				label-placement="left"
			>
				<n-form-item :path="prop">
					<component
						:is="component"
						placeholder=""
						v-model:value="copyValue[props.prop]"
					/>
				</n-form-item>
			</n-form>
		</div>
		<div class="edit">
			<n-button-group>
				<n-button circle v-if="!isEditing" @click="edit" title="编辑">
					<template #icon>
						<n-icon>
							<Edit24Regular />
						</n-icon>
					</template>
				</n-button>
				<n-button circle v-else @click="confirm" title="确定">
					<template #icon>
						<n-icon>
							<Checkmark24Regular />
						</n-icon>
					</template>
				</n-button>
				<n-button circle @click="cancel" :disabled="!isEditing" title="取消">
					<template #icon>
						<n-icon>
							<Dismiss24Regular />
						</n-icon>
					</template>
				</n-button>
			</n-button-group>
		</div>
	</div>
</template>

<style scoped lang="scss">
.input-container {
	width: 100%;
	display: flex;

	.display {
		flex: 1;
	}

	.edit {
		margin-left: 12px;
	}
}
</style>
