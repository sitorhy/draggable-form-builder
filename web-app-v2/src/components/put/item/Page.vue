<script setup lang="ts">
import { computed } from 'vue';
import { PAGE_FORMAT } from '../common/constants.ts';
import type { RendererItemDefinition } from '../../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

type PageProps = {
	path: string;
	format: string;
	direction: string;
	background: string;
};

const props = computed<PageProps>(() => schema.value.props as PageProps);

const dimension = computed(() => {
	if (props.value.format) {
		const format = PAGE_FORMAT.find((i) => i.value === props.value.format);
		if (format) {
			if (props.value.direction === 'landscape') {
				return {
					width: format.size.height,
					height: format.size.width
				};
			}
			return {
				...format.size
			};
		}
	}

	return {
		width: '100%',
		height: 'fit-content',
		minHeight: '34px'
	};
});

const pageStyle = computed(() => {
	const style: Record<string, any> = {
		...dimension.value
	};

	if (props.value.background) {
		style.background = props.value.background;
	}

	return style;
});
</script>

<template>
	<div class="page" :style="pageStyle">
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
.page {
	position: relative;
}
</style>
