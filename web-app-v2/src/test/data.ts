import type { RendererItemDefinition } from '../types.ts';

export function unitTest(): RendererItemDefinition {
	return {
		type: 'page',
		id: 'page_ffd7d498-e331-425c-903b-ad346bb76046',
		props: {
			path: 'pageOne',
			background: '#eee'
		},
		children: [
			{
				type: 'datePicker',
				id: 'datePicker_d1769a2e-e571-43e8-ad32-327c16704015',
				props: {
					path: 'date001',
					placeholder: '日期'
				},
				binding: [
					{
						prop: 'type',
						static: true
					}
				]
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
							rows: 2,
							maxlength: 255
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
			},
			{
				type: 'form',
				id: 'form_3ebeae90-2d3f-4703-b6e9-1742a4f352fa',
				props: {
					path: 'form001'
				},
				children: [
					{
						type: 'container',
						id: 'container_1a6b9697-6ace-4189-96a8-05ccbd7b0de6',
						props: {},
						children: [
							{
								type: 'grid',
								id: 'grid_099a7aa3-d8cb-433d-859c-ce0eeb22a582',
								props: {
									cols: 4
								},
								children: [
									{
										type: 'container',
										id: 'container_1b4a9636-9349-4771-a592-e5d602f59d8e',
										props: {},
										children: [
											{
												type: 'formItem',
												id: 'formItem_70477e55-189f-405a-b688-58cd3717f108',
												props: {
													label: '表单项',
													path: 'formItem513'
												},
												children: [
													{
														type: 'container',
														id: 'container_0ab38942-fe57-43f9-b977-fbff0bd013af',
														props: {},
														children: [
															{
																type: 'textInput',
																id: 'textInput_8d5fd4c9-d1aa-4482-86e3-f5b0fd1588d7',
																props: {
																	placeholder: '',
																	type: 'text',
																	rows: 2
																}
															}
														]
													}
												]
											}
										]
									},
									{
										type: 'container',
										id: 'container_4c755a44-d8de-4c8a-876b-b384944ac19d',
										props: {},
										children: []
									},
									{
										type: 'container',
										id: 'container_d0ff6a34-555a-406d-89e6-4b3ef08ee236',
										props: {},
										children: [
											{
												type: 'formItem',
												id: 'formItem_1d42fa4b-bacf-49e2-bd3d-14d3b8dc917a',
												props: {
													label: '表单项',
													path: 'formItem514'
												},
												children: [
													{
														type: 'container',
														id: 'container_3a1f6db4-8fa2-4228-b90d-d6a0be28bdeb',
														props: {},
														children: [
															{
																type: 'datePicker',
																id: 'datePicker_dc11d524-0e59-4236-88a1-437e67cc485e',
																props: {
																	placeholder: '',
																	type: 'date'
																}
															}
														]
													}
												]
											}
										]
									},
									{
										type: 'container',
										id: 'container_43858896-8ff5-437d-ab11-25eca531b6b7',
										props: {},
										children: []
									}
								]
							}
						]
					}
				]
			}
		]
	};
}
