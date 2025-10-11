import type { RendererItemDefinition } from '../types.ts';

export function unitTest(): RendererItemDefinition {
	return {
		type: 'page',
		id: 'page_ffd7d498-e331-425c-903b-ad346bb76046',
		props: {
			path: 'pageOne',
			background: '#eee',
			format: 'web',
			padding: '0px'
		},
		children: [
			{
				type: 'button',
				id: 'button_df6ae8d4-f53e-46be-83d2-c7604442fc17',
				props: {
					type: 'primary'
				},
				children: [
					{
						type: 'container',
						id: 'container_2b5e2b0c-d7b8-4928-8377-a3cd292c6700',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'row'
							}
						},
						children: [
							{
								type: 'ellipsis',
								id: 'ellipsis_670554ef-ec8d-45db-9fc2-20bdd9c6a9f8',
								props: {
									text: '按钮'
								}
							}
						]
					}
				]
			},
			{
				type: 'datePicker',
				id: 'datePicker_d1769a2e-e571-43e8-ad32-327c16704015',
				props: {
					path: 'date001',
					placeholder: '日期'
				}
			},
			{
				type: 'linearList',
				id: 'linearList_06f601da-67a6-4753-8625-9493b9e9cbc0',
				props: {
					path: 'list001',
					static: true,
					dataSource: null,
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
							maxlength: 255,
							disabled: false,
							path: 'text'
						}
					}
				]
			},
			{
				type: 'list',
				id: 'list_8c1cadac-56cb-4cbe-aa8d-a36afd755492',
				props: {
					path: 'list002',
					static: true,
					dataSource: null,
					loop: [
						{
							id: '0x1237'
						},
						{
							id: '0x1238'
						},
						{
							id: '0x1239'
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
					path: 'form001',
					requireMarkPlacement: 'left'
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
									cols: 4,
									rows: 1,
									xGap: 12,
									yGap: 0
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
													label: '文本',
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
										children: [
											{
												type: 'formItem',
												id: 'formItem_796d9ecb-d0d9-46ac-8589-cbf71ea7852a',
												props: {
													label: '单选',
													path: 'formItem569'
												},
												children: [
													{
														type: 'container',
														id: 'container_0cfb0434-9c13-4be0-9a82-115383090bc7',
														props: {
															style: {
																display: 'flex',
																flexDirection: 'column'
															}
														},
														children: [
															{
																type: 'radioGroup',
																id: 'radioGroup_93b1399b-3225-49b5-bd5e-de0cf70d69ef',
																props: {
																	path: 'radioGroup570',
																	text: '单选组',
																	name: 'radioGroup'
																},
																children: [
																	{
																		type: 'container',
																		id: 'container_963e3d17-d21b-4199-aed9-3528d7ecffa5',
																		props: {
																			style: {
																				display: 'flex',
																				flexDirection: 'column'
																			}
																		},
																		children: [
																			{
																				type: 'radio',
																				id: 'radio_4006b348-1111-41b2-8aa7-17cf2bfbb4cf',
																				props: {
																					label: '单选项111',
																					value: '111'
																				}
																			},
																			{
																				type: 'radio',
																				id: 'radio_1fa1d4c8-832b-4f0a-bb6d-156ab5f3e378',
																				props: {
																					label: '单选项222',
																					value: '222'
																				}
																			}
																		]
																	}
																]
															}
														]
													}
												]
											}
										]
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
													label: '日期',
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
										children: [
											{
												type: 'formItem',
												id: 'formItem_694d26fe-9c60-4292-b34c-5ede683b1a30',
												props: {
													label: '表单项',
													path: 'formItem12'
												},
												children: [
													{
														type: 'container',
														id: 'container_1fbd53aa-4a3c-4bfb-a55b-a4ca37d07cdc',
														props: {
															style: {}
														},
														children: [
															{
																type: 'radioGroup',
																id: 'radioGroup_e8c9bf97-f54d-406e-8c59-be6496458bdd',
																props: {
																	path: 'radioGroup13',
																	text: '单选组',
																	name: 'radioGroup'
																},
																children: [
																	{
																		type: 'container',
																		id: 'container_aff308f1-9c2d-4a50-9b11-94ae1016c6d6',
																		props: {
																			style: {
																				display: 'flex',
																				flexDirection: 'column'
																			}
																		},
																		children: [
																			{
																				type: 'linearList',
																				id: 'linearList_09c7da59-a836-4cd3-88de-96ce71808e4d',
																				props: {
																					path: 'linearList14',
																					static: true,
																					loop: [
																						{
																							id: 'd42a808c-b592-4f41-a79e-2d84524c0b49',
																							value: '1111',
																							label: '单选1111'
																						},
																						{
																							id: '84e4382e-a40f-4d6d-96b0-b13fa5143258',
																							value: '2222',
																							label: '单选2222'
																						}
																					],
																					dataSource: null,
																					slots: {}
																				},
																				children: [
																					{
																						type: 'container',
																						id: 'container_825815bb-b917-420f-88c6-7e9801bd0622',
																						props: {
																							style: {}
																						},
																						children: [
																							{
																								type: 'radio',
																								id: 'radio_9c58b486-fe36-4b34-8986-1ba84f8fa741',
																								props: {
																									label: '单选项'
																								},
																								binding: {
																									value: 'object://path:value',
																									label: 'object://path:label'
																								}
																							}
																						]
																					}
																				]
																			}
																		]
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				type: 'textInput',
				id: 'textInput_8660ddd2-d03c-40e6-940e-2e7f44b7f862',
				props: {
					path: 'textInput838',
					placeholder: '',
					type: 'text',
					rows: 2,
					maxlength: 255
				}
			},
			{
				type: 'textInput',
				id: 'textInput_6a3a041c-ec2c-4034-80aa-18d636c9fa3f',
				props: {
					path: 'textInput839',
					placeholder: '',
					type: 'text',
					rows: 2,
					maxlength: 255
				}
			},
			{
				type: 'container',
				id: 'container_ee8ff148-17f3-4b29-aa22-eba7de97aa1c',
				props: {
					style: {
						display: 'inline-flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start'
					},
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start'
				},
				children: [
					{
						type: 'ellipsis',
						id: 'ellipsis_f8056fec-5178-4cd4-8acc-a47aeac9f288',
						props: {
							text: '文本同步：{{syncText}}'
						},
						binding: {
							syncText: 'object://path:pageOne.textInput839?filter=toSafeString'
						}
					}
				]
			},
			{
				type: 'container',
				id: 'container_08f88382-1f92-443c-8bff-0b3a2a79cf2c',
				props: {
					style: {
						display: 'flex',
						flexDirection: 'row',
						flex: 1
					}
				},
				children: [
					{
						type: 'linearList',
						id: 'linearList_de41eca2-d34b-4a47-a069-3d86ee76af5c',
						props: {
							path: 'linearList195',
							static: true,
							loop: [
								{
									id: '98d89cc6-949a-4d0c-9ac8-09f271807e70',
									img: '/files/445Garchomp.png'
								},
								{
									id: '9e870a99-5847-49ea-a2a3-b8bbd5f85a91',
									img: '/files/598Ferrothorn.png'
								},
								{
									id: '40ec5252-ed29-4446-8a71-bae4f1fa62d6',
									img: '/files/637Volcarona.png'
								}
							],
							dataSource: null,
							slots: {}
						},
						children: [
							{
								type: 'container',
								id: 'container_2bcf7780-4505-4298-9195-d65cd1b3ab74',
								props: {
									style: {
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center'
									}
								},
								children: [
									{
										type: 'image',
										id: 'image_24ba5176-d79d-4a8d-9ff2-54ad3321ae38',
										props: {
											src: 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0xNCA3LjVhMS41IDEuNSAwIDEgMS0zIDBhMS41IDEuNSAwIDAgMSAzIDB6bS0xIDBhLjUuNSAwIDEgMC0xIDBhLjUuNSAwIDAgMCAxIDB6TTMgNmEzIDMgMCAwIDEgMy0zaDhhMyAzIDAgMCAxIDMgM3Y4YTMgMyAwIDAgMS0zIDNINmEzIDMgMCAwIDEtMy0zVjZ6bTMtMmEyIDIgMCAwIDAtMiAydjhjMCAuMzczLjEwMi43MjIuMjggMS4wMmw0LjY2OS00LjU4OGExLjUgMS41IDAgMCAxIDIuMTAyIDBsNC42NyA0LjU4OEExLjk5IDEuOTkgMCAwIDAgMTYgMTRWNmEyIDIgMCAwIDAtMi0ySDZ6bTAgMTJoOGMuMzcgMCAuNzE1LS4xIDEuMDEyLS4yNzRsLTQuNjYyLTQuNThhLjUuNSAwIDAgMC0uNyAwbC00LjY2MiA0LjU4QTEuOTkgMS45OSAwIDAgMCA2IDE2eiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9nPjwvc3ZnPg==',
											width: 100,
											height: 100
										},
										binding: {
											src: 'object://path:img'
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
				id: 'container_e1d15095-f4ab-4cd6-aef4-496a3344c9d9',
				props: {
					style: {}
				},
				children: [
					{
						type: 'equation',
						id: 'equation_090aa052-6075-4a8b-81e3-ad378410acc1',
						props: {
							katex:
								'f\\left(x\\right)=a_0+\\sum_{n=1}^{\\infty}\\left(a_n\\cos{\\frac{n\\pi x}{L}}+b_n\\sin{\\frac{n\\pi x}{L}}\\right)'
						}
					}
				]
			}
		]
	};
}
