<script setup lang="ts">
import { computed } from 'vue';
import { PAGE_FORMAT } from '../common/constants.ts';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRendererContainer from '../JsonRendererContainer.vue';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

type PageProps = {
	path: string;
	format: string;
	direction: string;
	background: string;
	padding: string;
};

const props = computed<PageProps>(() => schema.value.props as PageProps);

const dimension = computed(() => {
	if (props.value.format) {
		const format = PAGE_FORMAT.find((i) => i.value === props.value.format);
		if (format) {
			if (format.size && props.value.direction === 'landscape') {
				return {
					width: format.size.height,
					height: format.size.width,
					minHeight: format.size.minHeight || '34px',
					margin: 'auto',
					boxSizing: 'border-box'
				};
			}
			return {
				...format.size,
				margin: 'auto',
				boxSizing: 'border-box'
			};
		}
	}

	return {
		width: '100%',
		height: 'fit-content',
		minHeight: '34px',
		boxSizing: 'border-box'
	};
});

const pageStyle = computed(() => {
	const style: Record<string, any> = {
		...dimension.value
	};

	if (props.value.background) {
		style.background = props.value.background;
	}

	if (props.value.padding) {
		style.padding = props.value.padding;
	}

	return style;
});
</script>

<template>
	<div
		v-emphasize:schemaId="schema.id"
		class="page"
		:style="pageStyle"
		:id="schema.id"
	>
		<JsonRendererContainer v-model:schema="schema" />
	</div>
</template>

<style lang="scss" scoped>
.page {
	position: relative;
}
</style>
