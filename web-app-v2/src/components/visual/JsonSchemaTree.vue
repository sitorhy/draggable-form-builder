<script setup lang="ts">
import { computed } from 'vue';
import { BaseTree, OpenIcon } from '@he-tree/vue';
import { useSchemaStore } from '../../store/schema.ts';
import { useComponentsStore } from '../../store/component.ts';
import { Info24Regular, Target24Filled } from '@vicons/fluent';

import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';

const schemaStore = useSchemaStore();
const componentsStore = useComponentsStore();

const treeData = computed(function () {
	return [schemaStore.schema];
});
</script>

<template>
	<BaseTree class="mtl-tree" v-model="treeData" treeLine>
		<template #default="{ node, stat }">
			<OpenIcon
				v-if="stat.children.length"
				:open="stat.open"
				class="mtl-mr"
				@click="stat.open = !stat.open"
			/>
			<div class="mtl-ml">
				<div class="node-desc">
					<span>{{ componentsStore.getComponentNameByType(node.type) }}</span>
					<div class="node-desc-actions">
						<n-icon color="#18a058">
							<Info24Regular />
						</n-icon>

						<n-icon color="#18a058">
							<Target24Filled />
						</n-icon>
					</div>
				</div>
			</div>
		</template>
	</BaseTree>
</template>

<style lang="scss" scoped>
.node-desc {
	display: flex;
}

.node-desc-actions {
	padding-top: 2px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	visibility: hidden;

	> * {
		margin-left: 4px;
	}
}

.tree-node:hover .node-desc-actions {
	visibility: visible;
}
</style>
