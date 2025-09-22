<script setup lang="ts">
import { computed } from 'vue';

defineProps({
	options: {
		type: Array,
		default: () => [
			{
				label: 'px',
				value: 'px'
			},
			{
				label: 'em',
				value: 'em'
			},
			{
				label: 'cm',
				value: 'cm'
			},
			{
				label: 'mm',
				value: 'mm'
			},
			{
				label: '%',
				value: '%'
			}
		]
	},
	direction: {
		type: String,
		default: ''
	},
	bordered: {
		type: Boolean,
		default: false
	},
	size: {
		type: String,
		default: 'tiny'
	},
	showButton: {
		type: Boolean,
		default: false
	},
	width: {
		type: String,
		default: '4em'
	}
});

const modelValue = defineModel<string>('value');

const num = computed(() => {
	const value = Number.parseInt(modelValue.value || '');
	if (Number.isNaN(value)) {
		return 0;
	}
	return value;
});

const unit = computed(() => {
	const m = (modelValue.value || '').match(/(\d+)(.*)/);
	return m && m[2] ? m[2] : 'px';
});

function onNumUpdate(value: number) {
	modelValue.value = `${value}${unit.value}`;
}

function onUnitUpdate(value: string) {
	modelValue.value = `${num.value}${value}`;
}
</script>

<template>
	<div :class="['container', 'size-property']">
		<n-input-number
			placeholder=""
			:value="num"
			@update:value="onNumUpdate"
			class="num"
			:size="size"
			:bordered="bordered"
			:precision="0"
			:step="1"
			:style="{ width }"
			:show-button="showButton"
		/>
		<n-select
			placeholder=""
			:consistent-menu-width="false"
			:value="unit"
			:show-arrow="false"
			@update:value="onUnitUpdate"
			class="unit"
			:size="size"
			:bordered="bordered"
			:options="options"
		/>
	</div>
</template>

<style scoped lang="scss">
.container {
	display: flex;

	&.horizontal {
		flex-direction: row;
	}

	&.vertical {
		flex-direction: column;
	}

	.num {
		width: 3em;
		text-align: right;
	}

	.unit {
		padding-left: 0;
	}
}
</style>

<style lang="scss">
.size-property {
	.n-base-selection-label {
		background: none;
	}

	.n-base-selection-input {
		padding: 0 !important;
		background: none !important;
	}

	.n-input-wrapper {
		padding: 0;
		background: none !important;
	}

	.n-input {
		background: none;
	}
}
</style>
