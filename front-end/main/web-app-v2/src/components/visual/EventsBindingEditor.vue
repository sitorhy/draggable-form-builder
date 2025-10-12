<script setup lang="ts">
import { useSchemaActions } from '../../store/schema.ts';
import { computed } from 'vue';
import { useEmphasizeStore } from '../../store/emphasize.ts';
import { Settings24Regular } from '@vicons/fluent';
import { useComponentsStore } from '../../store/component.ts';
import { getSchemas } from './binding-schema';
import FunctionCodeSelect from './FunctionCodeSelect.vue';

const componentsStore = useComponentsStore();
const emphasizeStore = useEmphasizeStore();

const { findNodeById } = useSchemaActions();

const watchingSchemaId = computed(function () {
	return emphasizeStore.schemaId;
});

const watchingSchema = computed(function () {
	if (!watchingSchemaId.value) {
		return null;
	}
	return findNodeById(watchingSchemaId.value);
});

const schemaTypeName = computed(function () {
	if (!watchingSchema.value) {
		return '';
	}
	return (
		componentsStore.getComponentNameByType(watchingSchema.value.type) ||
		watchingSchema.value.type
	);
});

const bindingSchema = computed(function () {
	return getSchemas({
		schema: watchingSchema.value
	});
});

function updateEventBinding(eventName: string, moduleName: string) {
	if (watchingSchema.value) {
		watchingSchema.value.events = {
			...watchingSchema.value?.events,
			[eventName]: moduleName
		};
	}
}
</script>

<template>
	<div class="editor">
		<div v-if="watchingSchema">
			<n-thing>
				<template #avatar>
					<n-icon :size="24">
						<Settings24Regular />
					</n-icon>
				</template>
				<template #header>
					<div>
						<n-tooltip trigger="hover" placement="right">
							<template #trigger>
								<div>{{ schemaTypeName }}</div>
							</template>
							<div class="list">
								<div class="list-item">
									<div class="list-header">schemaId</div>
									<div class="list-body">
										{{ watchingSchema.id }}
									</div>
								</div>
							</div>
						</n-tooltip>
					</div>
				</template>

				<n-space :vertical="true">
					<n-form v-if="bindingSchema.events" :model="watchingSchema.events">
						<n-form-item
							v-for="event in bindingSchema.events"
							:key="event.value"
							:label="event.label"
						>
							<FunctionCodeSelect
								:multiple="false"
								:value="
									watchingSchema?.events
										? watchingSchema.events[event.value]
										: undefined
								"
								@update:value="(v) => updateEventBinding(event.value, v)"
							/>
						</n-form-item>
					</n-form>
					<div v-else class="editor-empty">
						<n-empty description="未配置事件功能">
							<template #icon>
								<n-icon>
									<Settings24Regular />
								</n-icon>
							</template>
							<template #extra></template>
						</n-empty>
					</div>
				</n-space>
			</n-thing>
		</div>
		<div v-else class="editor-empty">
			<n-empty>
				<template #icon>
					<n-icon>
						<Settings24Regular />
					</n-icon>
				</template>
				<template #extra></template>
			</n-empty>
		</div>
	</div>
</template>

<style scoped lang="scss">
.editor {
	height: 100%;

	.editor-empty {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
}

.list {
	.list-header {
		width: 8em;
	}
}
</style>
