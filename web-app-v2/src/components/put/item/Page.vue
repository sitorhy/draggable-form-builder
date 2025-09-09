<script setup lang="ts">
import { useEmphasizeStore } from '../../../store/emphasize.ts';

const emphasizeStore = useEmphasizeStore();

// 点击页面空白处
function onPageFocus() {
	emphasizeStore.unwatchSchema();
}
</script>

<template>
	<div class="page" @click.stop="onPageFocus">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
.page {
	width: 100%;
	height: 100%;
	background: #eee;
}
</style>
