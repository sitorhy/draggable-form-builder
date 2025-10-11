<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

/**
 * 提取所有被 {{}} 包裹的字段（更简洁的实现）。
 * @param {string} str 待处理的字符串。
 * @returns {string[]} 提取到的字段数组。
 */
function extractFieldsConcise(str: string): string[] {
	const fields: string[] = str.split(',');
	const regex = /{{(.*?)}}/g;

	// replace() 的回调函数会遍历所有匹配项
	str.replace(regex, (fullMatch, captureGroup1) => {
		// fullMatch 是完整匹配的字符串 (例如 "{{a}}")
		// captureGroup1 是第一个捕获组的内容 (例如 "a")
		fields.push(captureGroup1);
		return fullMatch; // 必须返回一个值，否则会替换掉原字符串
	});

	return fields;
}

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

const propsReduce = computed(() => ({
	...schema.value.props,
	...bindingProps.value
}));

const text = computed(function () {
	let str = propsReduce.value.text;
	const fields = extractFieldsConcise(str);
	const values: Record<string, any> = fields
		.map((field) => {
			return [field, propsReduce.value[field]];
		})
		.reduce((acc, cur) => {
			return Object.assign(acc, { [cur[0]]: cur[1] });
		}, {});
	fields.forEach((field) => {
		str = str.replace(`{{${field}}}`, String(values[field]));
	});
	return str;
});
</script>

<template>
	<div class="ellipsis-container" v-emphasize:schemaId="schema.id">
		<n-ellipsis v-if="schema.props" v-bind="propsReduce">{{ text }}</n-ellipsis>
		<n-empty v-else description="Ellipsis">
			<template #icon>
				<n-icon>
					<ErrorCircle20Regular />
				</n-icon>
			</template>
		</n-empty>
	</div>
</template>

<style lang="scss" scoped>
.ellipsis-container {
	display: inline-block;
	height: fit-content;
	--n-hegiht: 12px;
}
</style>
