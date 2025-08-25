export function unitTest() {
	return {
		type: 'page',
		id: 'page_ffd7d498-e331-425c-903b-ad346bb76046',
		children: [
			{
				type: 'datePicker',
				id: 'datePicker_d1769a2e-e571-43e8-ad32-327c16704015',
				props: {
					placeholder: '日期'
				}
			},
			{
				type: 'linearList',
				id: 'linearList_06f601da-67a6-4753-8625-9493b9e9cbc0',
				props: {
					dataSource: '',
					loop: [
						{
							id: '0x1234'
						},
						{
							id: '0x1235'
						},
						{
							id: '0x1236'
						}
					]
				},
				children: [
					{
						type: 'textInput',
						id: 'textInput_74a30130-acad-449f-99ff-54778a74fd86',
						props: {
							placeholder: '文本框',
							type: 'text',
							rows: 2
						}
					}
				]
			},

			{
				type: 'list',
				id: 'list_8c1cadac-56cb-4cbe-aa8d-a36afd755492',
				props: {
					dataSource: '',
					loop: [
						{
							id: '0x1234'
						},
						{
							id: '0x1235'
						},
						{
							id: '0x1236'
						}
					],
					slots: {
						prefix: {
							type: 'container',
							id: 'container_d2698a66-927c-43e2-8cbe-813e2c6a676f',
							props: {},
							children: []
						},
						suffix: {
							type: 'container',
							id: 'container_ad2d9e37-5a37-44a4-88b6-133475b7329f',
							props: {},
							children: []
						}
					}
				},
				children: [
					{
						type: 'container',
						id: 'container_3f3c9931-eb5d-428b-9c45-60125f65f604',
						props: {},
						children: []
					}
				]
			}
		]
	};
}
