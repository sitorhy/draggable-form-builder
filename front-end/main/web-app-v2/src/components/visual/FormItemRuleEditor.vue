<script setup lang="ts">
import { type FormItemRule } from 'naive-ui';
import { Add24Regular } from '@vicons/fluent';
import { computed, watch } from 'vue';
import FunctionCodeSelect from './FunctionCodeSelect.vue';

type FormItemRuleExt = FormItemRule & {
	validatorModule?: string;
};

const rules = defineModel<FormItemRuleExt | FormItemRuleExt[]>('value');

watch(
	rules,
	(value) => {
		if (!Array.isArray(value)) {
			rules.value = rules.value ? ([rules.value] as FormItemRule[]) : [];
		}
	},
	{
		immediate: true
	}
);

const toList = computed<FormItemRuleExt[]>({
	get: () => {
		if (!Array.isArray(rules.value)) {
			return rules.value ? [rules.value] : [];
		}
		return rules.value;
	},
	set: (value: FormItemRuleExt[]) => {
		rules.value = value ? (value as FormItemRuleExt[]) : [];
	}
});

function onAddRule() {
	if (!toList.value) {
		toList.value = [];
	}
	toList.value = [
		...(toList.value as FormItemRule[]),
		{
			required: false
		}
	];
}
</script>

<template>
	<n-card>
		<div class="full">
			<div class="full-left">
				<n-button
					@click="onAddRule"
					:size="'small'"
					type="primary"
					strong
					secondary
					circle
				>
					<template #icon>
						<n-icon><Add24Regular /></n-icon>
					</template>
				</n-button>
			</div>
			<div class="full-right" v-if="toList.length">
				<n-form
					v-for="(item, index) in toList"
					:key="item"
					:model="toList[index]"
					:inline="false"
					:size="'small'"
					:label-placement="'top'"
					:labelAlign="'left'"
				>
					<n-divider v-if="index"></n-divider>
					<n-form-item label="必填" path="required">
						<n-switch v-model:value="toList[index].required" />
					</n-form-item>
					<n-form-item label="校验信息" path="message">
						<n-input v-model:value="toList[index].message" />
					</n-form-item>
					<n-form-item label="自定义校验" path="validatorModule">
						<FunctionCodeSelect
							:multiple="false"
							v-model:value="toList[index].validatorModule"
						/>
					</n-form-item>
				</n-form>
			</div>
			<div class="full-right" v-else>
				<n-empty description="暂无规则" />
			</div>
		</div>
	</n-card>
</template>

<style scoped lang="scss">
.full {
	width: 100%;
	display: flex;
	flex-direction: row;

	.full-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.full-right {
		flex: 1;
		padding-left: 34px;
		box-sizing: border-box;
	}
}
</style>
