<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import { v4 as uuid } from 'uuid';
import { Link24Regular, LinkDismiss24Regular } from '@vicons/fluent';
import type { PropertyInjectionSchema } from '../../../types.ts';
import DataSourceSchema from '../../visual/DataSourceSchema.vue';

const emit = defineEmits(['link:prop', 'unlink:prop']);

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
	},
	itemKey: {
		type: Function as PropType<(item: any) => string>,
		default: null
	}
});

const formRef = ref();

const modelValue = defineModel('props', {
	type: Object as PropType<Record<string, any>>,
	default: () => ({}) as Record<string, any>
});

const binding = defineModel('binding', {
	type: Object as PropType<Record<string, any>>,
	default: () => ({}) as Record<string, any>
});

const visibleItems = computed(function () {
	return props.schema
		.filter(function (item) {
			return shouldRenderItem(item);
		})
		.map((item) => {
			let key;
			if (typeof props.itemKey === 'function') {
				key = props.itemKey(item);
			} else {
				key = uuid();
			}
			return {
				...item,
				key
			};
		});
});

function shouldRenderItem(item: { visible?: () => boolean }): boolean {
	if (typeof item.visible === 'function') {
		return item.visible();
	}
	return true;
}

// 属性组件切换到数据源组件
function hasDataSourceBinding(item: PropertyInjectionSchema) {
	const prop = item.prop;
	return binding.value && !!binding.value[prop];
}

function useBinding(item: PropertyInjectionSchema) {
	if (typeof item.formItemProps?.useBinding === 'function') {
		return item.formItemProps?.useBinding();
	}
	return !!item.formItemProps?.useBinding;
}

function switchPropToDataSource(item: PropertyInjectionSchema) {
	emit('link:prop', item);
}

function resetPropFromDataSource(item: PropertyInjectionSchema) {
	emit('unlink:prop', item);
}

const defaultHandlers = computed(() => ({}));

defineExpose({
	validate: (cb: (errors?: Error[]) => void) => {
		return formRef.value.validate(cb);
	}
});
</script>

<template>
	<n-form
		v-bind="$attrs"
		ref="formRef"
		require-mark-placement="left"
		label-placement="top"
		:model="modelValue"
	>
		<n-grid :x-gap="xGap" :cols="cols">
			<n-gi v-for="item in visibleItems" :span="item.span || 1" :key="item.key">
				<n-form-item
					v-bind="item.formItemProps"
					:label="item.label"
					:path="item.prop"
					:rule="item.rules || []"
				>
					<component
						v-if="item.type !== 'slotScope' && !hasDataSourceBinding(item)"
						:is="item.type"
						v-model:value="modelValue[item.prop]"
						v-bind="item.config"
						v-on="item.on || defaultHandlers"
					/>
					<slot
						v-if="item.type === 'slotScope' && !hasDataSourceBinding(item)"
						:name="item.prop"
					></slot>
					<DataSourceSchema
						v-if="hasDataSourceBinding(item)"
						v-model:uri="binding[item.prop]"
					/>

					<template #label>
						<n-space align="center">
							<span>{{ item.label }}</span>

							<template v-if="useBinding(item)">
								<n-icon
									:size="24"
									v-if="!hasDataSourceBinding(item)"
									@click.stop="switchPropToDataSource(item)"
								>
									<Link24Regular />
								</n-icon>
								<n-icon
									:size="24"
									v-else
									@click.stop="resetPropFromDataSource(item)"
								>
									<LinkDismiss24Regular />
								</n-icon>
							</template>
						</n-space>
					</template>
				</n-form-item>
			</n-gi>
		</n-grid>
	</n-form>
</template>
