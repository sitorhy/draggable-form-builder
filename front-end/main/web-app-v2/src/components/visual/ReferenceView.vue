<template>
	<div>
		<n-data-table
			:columns="columns"
			:data="data"
			:pagination="pagination"
			:bordered="false"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { useReferenceContext } from '../../store/reference-context.ts';
import { NEllipsis, NIcon, useMessage } from 'naive-ui';
import { Copy24Regular } from '@vicons/fluent';

const message = useMessage();

const referenceContext = useReferenceContext();

const data = computed(function () {
	return [...referenceContext.references.entries()].map((entry) => {
		const obj: Record<string, any> = {
			bindingPath: entry[0],
			key: entry[0]
		};
		if (entry[1]) {
			obj.name = entry[1].$options.name;
		}
		return obj;
	});
});

const columns = computed(() => {
	return [
		{
			title: '索引',
			key: 'bindingPath',
			render(row: { bindingPath: string }) {
				return h(
					'div',
					{
						style: {
							display: 'flex',
							alignItems: 'center'
						}
					},
					[
						h(NIcon, {}, () =>
							h(Copy24Regular, {
								onClick: () => {
									navigator.clipboard
										.writeText(row.bindingPath)
										.then(function () {
											message.info('已复制');
										})
										.catch(function (err) {
											console.error('复制文本到剪贴板失败', err);
										});
								}
							})
						),
						h(
							NEllipsis,
							{
								tooltip: true
							},
							{
								default: () => row.bindingPath
							}
						)
					]
				);
			}
		},
		{
			title: '组件',
			key: 'name',
			ellipsis: {
				tooltip: true,
				slots: {
					tooltip: () => '111'
				}
			},
			width: 120
		}
	];
});
const pagination = false;
</script>
