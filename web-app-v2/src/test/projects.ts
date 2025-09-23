import type { ProjectDefinition } from '../types.ts';

export function getTestProjects(): ProjectDefinition[] {
	return [
		{
			id: '3865f2fe-57bb-4ba8-9f10-407f2deeff5c',
			name: '普通高中高三第一学期期中考试',
			pages: [
				{
					id: 'a4ed92e2-d828-40ac-8b69-cacc0f45eea4',
					name: '第一页',
					schema: {
						type: 'page',
						id: 'page_f7d2e08e-bfbc-4721-904d-1ab1e13ccc07',
						props: {
							path: 'page678',
							background: '#eee'
						},
						children: [
							{
								type: 'container',
								id: 'container_4fe49172-a664-4e04-a345-4b392b496e12',
								props: {
									style: {
										flexDirection: 'column'
									}
								},
								children: []
							}
						]
					}
				},
				{
					id: '6a6cc6e1-4ead-4170-aa0a-15efb8133fee',
					name: '第二页',
					schema: {
						type: 'page',
						id: 'page_2de129c8-c8d8-4773-806d-74d3faabf78b',
						props: {
							path: 'page832',
							background: '#eee'
						},
						children: [
							{
								type: 'container',
								id: 'container_76b4d3e2-5e34-476d-ae00-53bf0b8ef773',
								props: {
									style: {
										flexDirection: 'column'
									}
								},
								children: []
							}
						]
					}
				}
			]
		}
	];
}
