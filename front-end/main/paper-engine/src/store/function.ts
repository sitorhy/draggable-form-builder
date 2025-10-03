import type { FunctionCode } from '../types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { ESMLoader } from '../libs/esm-loader.ts';

export const useFunctionStore = defineStore<
	'function',
	{
		functions: FunctionCode[];
		modules: Map<string, any>;
	},
	{},
	{
		getAllFunctionCode: (
			page: number,
			size: number
		) => Promise<{
			total: number;
			page: number;
			size: number;
			data: Partial<FunctionCode>[];
		}>;
		createFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode>;
		findFunctionCodeById(id: string): Promise<FunctionCode | null>;
		findFunctionCodeByName(name: string): Promise<FunctionCode | null>;
		updateFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode>;
		loadModule(code: FunctionCode): Promise<any>;
		loadModuleById(id: string): Promise<any>;
        reset: () => void;
	}
>('function', {
	state() {
		return {
			functions: [],
			modules: new Map<string, any>()
		};
	},
	actions: {
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
				data: this.functions
					.map((i) => {
						return {
							id: i.id,
							name: i.name,
							feature: i.feature,
							description: i.description
						};
					})
					.slice(
						Math.min(Math.floor(this.functions.length / size), page - 1),
						Math.min(Math.floor(this.functions.length / size), page - 1) + size
					),
				page: Math.min(Math.floor(this.functions.length / size), page - 1) + 1,
				size: size,
				total: this.functions.length
			});
		},
		createFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode> {
			return new Promise<FunctionCode>((resolve, reject) => {
				if (
					this.functions.findIndex(
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
					this.functions.unshift(append);
					resolve(append);
				}
			});
		},
		findFunctionCodeById(id: string): Promise<FunctionCode | null> {
			return Promise.resolve(this.functions.find((i) => i.id === id) || null);
		},
		findFunctionCodeByName(name: string): Promise<FunctionCode | null> {
			return Promise.resolve(
				this.functions.find((i) => i.name === name) || null
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
					this.functions.splice(index, 1, {
						...(newCode as FunctionCode)
					});
					resolve(this.functions[index] as FunctionCode);
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
		},
        reset() {
            this.functions = [];
        }
	}
});
