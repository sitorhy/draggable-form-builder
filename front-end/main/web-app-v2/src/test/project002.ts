import type { ProjectDefinition } from '../types.ts';

export function getTestProject002(): ProjectDefinition {
	return {
		engine: 'Antd',
		id: '8301a968-45e5-46d1-9107-dab9cd190e24',
		name: 'testProject_002',
		title: '表单数据',
		pages: [
			{
				id: 'page005.json',
				title: '提交测试',
				localFlag: true
			}
		],
		functions: [
			{
				id: '19a876ec-322d-4149-95f4-956dec66eecd',
				name: 'validatePasswordSame',
				code:
					'export default function validatePasswordSame(rule, value) {\n' +
					'\ttry {\n' +
					'\t\tconst appContext = this.getApplicationContext();\n' +
					'\t\tconst bindingStore = appContext.bindingStore;\n' +
					'\n' +
					'\t\tconst formValue = bindingStore.state.page859.form887;\n' +
					'\t\tconst valid = value === formValue.password;\n' +
					"\t\tif (appContext.engine === 'Antd') {\n" +
					'\t\t\treturn valid ? Promise.resolve() : Promise.reject();\n' +
					'\t\t} else {\n' +
					'\t\t\treturn valid;\n' +
					'\t\t}\n' +
					'\t} catch (error) {\n' +
					'\t\treturn error;\n' +
					'\t}\n' +
					'}\n',
				description: '【表单】两次密码是否相同'
			},
			{
				id: 'ceaf587c-8298-4be3-8f80-4f2a677ff10c',
				name: 'validatePasswordStartWith',
				code:
					'export default function validatePasswordStartWith(rule, value) {\n' +
					'\ttry {\n' +
					'\t\tconst appContext = this.getApplicationContext();\n' +
					'\t\tconst bindingStore = appContext.bindingStore;\n' +
					'\n' +
					'\t\tconst formValue = bindingStore.state.page859.form887;\n' +
					'\n' +
					'\t\tconst valid =\n' +
					'\t\t\t!!formValue.password &&\n' +
					'\t\t\tformValue.password.startsWith(value) &&\n' +
					'\t\t\tformValue.password.length >= value.length;\n' +
					'\n' +
					"\t\tif (appContext.engine === 'Antd') {\n" +
					'\t\t\treturn valid ? Promise.resolve() : Promise.reject();\n' +
					'\t\t} else {\n' +
					'\t\t\treturn valid;\n' +
					'\t\t}\n' +
					'\t} catch (error) {\n' +
					'\t\treturn error;\n' +
					'\t}\n' +
					'}\n',
				description: '【表单】重复密码校验'
			},
			{
				id: '0e7cf9c9-611f-47dd-b14e-201ddea2fb79',
				name: 'validateAge',
				code:
					'export default function validateAge(rule, value) {\n' +
					'\tconst appContext = this.getApplicationContext();\n' +
					'\n' +
					"\tif (appContext.env === 'Antd') {\n" +
					'\t\tif (!value) {\n' +
					"\t\t\treturn new Promise.reject(new Error('需要年龄'));\n" +
					'\t\t} else if (!/^\\d*$/.test(value)) {\n' +
					"\t\t\treturn new Promise.reject(new Error('年龄应该为整数'));\n" +
					'\t\t} else if (Number(value) < 18) {\n' +
					"\t\t\treturn new Promise.reject(new Error('年龄应该超过十八岁'));\n" +
					'\t\t}\n' +
					'\t\treturn Promise.resolve();\n' +
					'\t} else {\n' +
					'\t\tif (!value) {\n' +
					"\t\t\treturn new Error('需要年龄');\n" +
					'\t\t} else if (!/^\\d*$/.test(value)) {\n' +
					"\t\t\treturn new Error('年龄应该为整数');\n" +
					'\t\t} else if (Number(value) < 18) {\n' +
					"\t\t\treturn new Error('年龄应该超过十八岁');\n" +
					'\t\t}\n' +
					'\t\treturn true;\n' +
					'\t}\n' +
					'}\n',
				description: '【表单】年龄校验'
			},
			{
				id: '80ab80a5-7957-482f-9bf6-08786d166a93',
				name: 'formSubmit',
				code:
					'export default async function submit() {\n' +
					"\tconst formRef = this.findComponentRef('form887', 'form');\n" +
					"\tif (formRef && typeof formRef.validate === 'function') {\n" +
					'\t\ttry {\n' +
					'\t\t\tconst valid = await formRef.validate();\n' +
					'\t\t\tif (valid) {\n' +
					"\t\t\t\tthis.tools.message.success('校验通过');\n" +
					'\t\t\t}\n' +
					'\t\t} catch (e) {\n' +
					'\t\t\tconsole.log(e.message);\n' +
					'\t\t\t// ignore\n' +
					'\t\t}\n' +
					'\t}\n' +
					'}',
				description: '【表单】验证按钮点击'
			}
		]
	};
}
