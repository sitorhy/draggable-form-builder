<script setup lang="ts">
defineProps({
	path: {
		type: String,
		default: ''
	}
});
</script>

<template>
	<div class="page">
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
