import type { ProjectDefinition } from '../types.ts';

export function getTestProject001(): ProjectDefinition {
	return {
		id: '3865f2fe-57bb-4ba8-9f10-407f2deeff5c',
		name: 'testProject_001',
		title: '普通高中高三第一学期期中考试',
		pages: [
			{
				id: 'page001.json',
				title: '第一页',
				localFlag: true
			},
			{
				id: 'page002.json',
				title: '第二页',
				localFlag: true
			},
			{
				id: 'page003.json',
				title: '第三页',
				localFlag: true
			},
			{
				id: 'page004.json',
				title: '第四页',
				localFlag: true
			}
		]
	};
}
