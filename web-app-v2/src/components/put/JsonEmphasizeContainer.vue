<script setup lang="ts">
import { computed } from 'vue';
import { Delete24Regular, Settings24Regular } from '@vicons/fluent';
import { useSchemaActions } from '../../store/schema.ts';
import { useEmphasizeStore } from '../../store/emphasize.ts';

const emit = defineEmits(['click:setting', 'click:delete']);

defineOptions({
	name: 'JsonEmphasizeContainer'
});

const props = defineProps({
	schemaId: {
		type: String,
		default: ''
	},
	containerStyle: {
		type: Object,
		default: null
	},
	showAction: {
		type: Boolean,
		default: false
	}
});

const emphasizeStore = useEmphasizeStore();
const { removeNodeById } = useSchemaActions();

const style = computed(() => {
	return {
		...props.containerStyle
	};
});

const actionStyle = computed(() => {
	return {
		top: `${parseInt(props.containerStyle.top) - 22.3}px`,
		left: `${parseInt(props.containerStyle.width) + parseInt(props.containerStyle.left) - 22.3 * 2}px`
	};
});

function onSchemaDeleting() {
	emit('click:delete', props.schemaId);
}

function onSchemaSetting() {
	removeNodeById(props.schemaId);
	emphasizeStore.unwatchSchema();
	emit('click:setting', props.schemaId);
}
</script>

<template>
	<div class="actions" :style="actionStyle" v-if="showAction">
		<n-space :size="0">
			<div class="action-item" @click.stop="onSchemaDeleting">
				<n-icon :size="13">
					<Delete24Regular />
				</n-icon>
			</div>
			<div class="action-item" @click.stop="onSchemaSetting">
				<n-icon :size="13">
					<Settings24Regular />
				</n-icon>
			</div>
		</n-space>
	</div>
	<div class="emphasize-container" :style="style"></div>
</template>

<style lang="scss" scoped>
.emphasize-container {
	position: absolute;
	z-index: 10;
	pointer-events: none;
	box-sizing: border-box;
	border: 2px dashed green;
}

.actions {
	position: absolute;
	right: 0;
	color: white;
	z-index: 100;

	.action-item {
		width: 23px;
		text-align: center;
		background: green;

		&:hover {
			background: limegreen;
		}
	}
}
</style>
