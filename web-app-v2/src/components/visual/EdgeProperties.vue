<script setup lang="ts">
import SizePropertyInput from './SizePropertyInput.vue';

const left = defineModel('left', {
	type: String,
	default: '0px'
});

const right = defineModel('right', {
	type: String,
	default: '0px'
});

const top = defineModel('top', {
	type: String,
	default: '0px'
});

const bottom = defineModel('bottom', {
	type: String,
	default: '0px'
});
</script>

<template>
	<div class="edge-root">
		<div class="top">
			<SizePropertyInput v-model:value="top" direction="horizontal" />
		</div>
		<div class="middle">
			<div class="left">
				<SizePropertyInput v-model:value="left" direction="vertical" />
			</div>
			<div class="placeholder"></div>
			<div class="right">
				<SizePropertyInput v-model:value="right" direction="vertical" />
			</div>
		</div>
		<div class="bottom">
			<SizePropertyInput v-model:value="bottom" direction="horizontal" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.edge-root {
	width: 240px;
	height: 135px;
	border: solid 1px #ccc;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	background: #eeeeee;
}

.left,
.right {
	width: 42px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.middle {
	display: flex;
	flex: 1;
	justify-content: space-between;

	.placeholder {
		flex: 1;
		border: solid 1px #ccc;
		background: white;
	}
}

.top,
.bottom {
	height: 42px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
