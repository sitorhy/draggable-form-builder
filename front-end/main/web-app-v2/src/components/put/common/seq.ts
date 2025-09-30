// 1. 定义生成器接口，确保实现类遵循此契约
interface ISequenceGenerator {
	/** 生成序列中的下一个序号 */
	next(): number;
	/** 重置生成器到初始状态 */
	reset(): void;
}

// 2. 定义配置接口，提供可选项
interface SequenceGeneratorOptions {
	/** 序列的起始值，默认为 1 */
	startFrom?: number;
	/** 每次递增的步长，默认为 1 */
	step?: number;
}

// 3. 实现序号生成器类
export class SequenceGenerator implements ISequenceGenerator {
	// 存储生成器的配置，使用私有属性
	private readonly options: Required<SequenceGeneratorOptions>;
	// 存储当前序号，使用私有属性，防止外部直接修改
	private currentValue: number;

	constructor(options?: SequenceGeneratorOptions) {
		// 合并默认配置，确保所有选项都存在
		this.options = {
			startFrom: 1,
			step: 1,
			...options
		};
		// 初始化当前序号为起始值
		this.currentValue = this.options.startFrom;
	}

	// 实现 ISequenceGenerator 接口中的 next() 方法
	public next(): number {
		// 先保存当前值，作为返回结果
		const result = this.currentValue;
		// 然后将当前值增加步长
		this.currentValue += this.options.step;
		// 返回保存的结果
		return result;
	}

	// 实现 ISequenceGenerator 接口中的 reset() 方法
	public reset(): void {
		// 将当前序号重置为起始值
		this.currentValue = this.options.startFrom;
	}
}
