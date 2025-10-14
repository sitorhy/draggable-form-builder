import type { FunctionCode } from '../types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { ESMLoader } from '../libs/esm-loader';
import inlineFuncList from './inline-functions';

export const useFunctionStore = defineStore('function', {
	state() {
		return {
			functions: [...inlineFuncList] as FunctionCode[],
			modules: new Map<string, any>()
		};
	},
	actions: {
		tryGetDefaultFunctionByModuleName(name: string) {
			const description = (this.functions as FunctionCode[]).find(
				(i) => i.name === name
			);
			if (description) {
				return this.modules.get(description.id)?.default;
			}
			return null;
		},
		tryGetModuleByName(name: string) {
			const description = (this.functions as FunctionCode[]).find(
				(i) => i.name === name
			);
			if (description) {
				return this.modules.get(description.id);
			}
			return null;
		},
		getAllFunctionCode(
			page: number,
			size: number
		): Promise<{
			total: number;
			page: number;
			size: number;
			data: Partial<FunctionCode>[];
		}> {
			return Promise.resolve({
				data: (this.functions as FunctionCode[])
					.map((i: FunctionCode) => {
						return {
							id: i.id,
							name: i.name,
							feature: i.feature,
							description: i.description
						};
					})
					.slice(
						Math.min(
							Math.floor((this.functions as FunctionCode[]).length / size),
							page - 1
						),
						Math.min(
							Math.floor((this.functions as FunctionCode[]).length / size),
							page - 1
						) + size
					),
				page:
					Math.min(
						Math.floor((this.functions as FunctionCode[]).length / size),
						page - 1
					) + 1,
				size: size,
				total: (this.functions as FunctionCode[]).length
			});
		},
		reset() {
			(this.functions as FunctionCode[]) = [...inlineFuncList];
		},
		createFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode> {
			return new Promise<FunctionCode>((resolve, reject) => {
				if (
					(this.functions as FunctionCode[]).findIndex(
						(i) => i.name === (newCode.name || '').trim()
					) >= 0
				) {
					reject(new Error('函数定义已存在'));
				} else {
					const newId = uuid();
					const append: FunctionCode = {
						...newCode,
						id: newId
					} as FunctionCode;
					(this.functions as FunctionCode[]).unshift(append);
					resolve(append);
				}
			});
		},
		findFunctionCodeById(id: string): Promise<FunctionCode | null> {
			return Promise.resolve(this.functions.find((i: FunctionCode) => i.id === id) || null);
		},
		findFunctionCodeByName(name: string): Promise<FunctionCode | null> {
			return Promise.resolve(
				(this.functions as FunctionCode[]).find((i) => i.name === name) || null
			);
		},
		updateFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode> {
			return new Promise<FunctionCode>((resolve, reject) => {
				const index = this.functions.findIndex(
					(i) => i.id === (newCode.id || '').trim()
				);
				if (index < 0) {
					reject(new Error('函数定义不存在'));
				} else {
					(this.functions as FunctionCode[]).splice(index, 1, {
						...(newCode as FunctionCode)
					});
                    const code = this.functions[index] as FunctionCode;
					this.modules.delete(code.id);
					this.loadModule(code)
						.then(() => {
							resolve(code);
						})
						.catch(reject);
				}
			});
		},
		async loadModule(code: FunctionCode): Promise<any> {
			if (!code) {
				return null;
			}
			// 查询实例化缓存
			if (this.modules.has(code.id)) {
				return this.modules.get(code.id);
			}
			const module = await ESMLoader(code.code);
			this.modules.set(code.id, module);
			return module;
		},
		async loadModuleById(id: string): Promise<any> {
			if (!id) {
				return null;
			}
			if (this.modules.has(id)) {
				return this.modules.get(id);
			}
			const functionCode = await this.findFunctionCodeById(id);
			if (!functionCode) {
				throw new Error('函数集不存在');
			}
			return await this.loadModule(functionCode as FunctionCode);
		}
	}
});
