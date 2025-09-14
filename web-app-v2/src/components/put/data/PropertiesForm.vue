<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import { v4 as uuid } from 'uuid';
import type { PropertyInjectionSchema } from '../../../types.ts';

const props = defineProps({
	cols: {
		type: Number,
		default: 1
	},
	xGap: {
		type: Number,
		default: 12
	},
	schema: {
		type: Array as PropType<PropertyInjectionSchema[]>,
		default: () => []
	}
});

const formRef = ref();

const modelValue = defineModel('props', {
	type: Object as PropType<Record<string, any>>,
	default: () => ({}) as Record<string, any>
});

const visibleItems = computed(function () {
	return props.schema
		.filter(function (item) {
			return shouldRenderItem(item);
		})
		.map((item) => {
			return {
				...item,
				key: uuid()
			};
		});
});

function shouldRenderItem(item: { visible?: () => boolean }): boolean {
	if (typeof item.visible === 'function') {
		return item.visible();
	}
	return true;
}

const defaultHandlers = computed(() => ({}));

defineExpose({
	validate: (cb: (errors?: Error[]) => void) => {
		formRef.value.validate(cb);
	}
});
</script>

<template>
	<n-form
		v-bind="$attrs"
		ref="formRef"
		:model="modelValue"
		label-placement="top"
	>
		<n-grid :x-gap="xGap" :cols="cols">
			<n-gi v-for="item in visibleItems" :span="item.span || 1" :key="item.key">
				<n-form-item
					:label="item.label"
					:path="item.prop"
					:rule="item.rules || []"
				>
					<component
						v-if="item.type !== 'slotScope'"
						:is="item.type"
						v-bind="item.config"
						v-on="item.on || defaultHandlers"
						v-model:value="modelValue[item.prop]"
					/>
					<slot v-if="item.type === 'slotScope'" :name="item.prop"></slot>
				</n-form-item>
			</n-gi>
		</n-grid>
	</n-form>
</template>
