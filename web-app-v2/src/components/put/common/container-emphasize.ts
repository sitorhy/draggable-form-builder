import {
	markRaw,
	ref,
	computed,
	onUnmounted,
	watch,
	type ComputedRef
} from 'vue';
import { useEmphasizeStore } from '../../../store/emphasize.ts';

export function useRendererContainerEmphasize(
	options: ComputedRef<{
		schemaId: string;
		containerStyle: object;
	}>
) {
	const emphasizeStore = useEmphasizeStore();

	const containerRef = ref();
	const containerSize = ref<{
		left: number;
		top: number;
		width: number;
		height: number;
	} | null>(null);

	const resizeObserver = markRaw(
		new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				const target = entry.target as HTMLElement;
				if (target) {
					containerSize.value = {
						left: target.offsetLeft,
						top: target.offsetTop,
						width: target.offsetWidth,
						height: target.offsetHeight
					};
				} else {
					containerSize.value = null;
				}
			} else {
				containerSize.value = null;
			}
		})
	);

	// 注入after伪类尺寸信息
	const containerSizeStyle = computed(() => {
		if (!containerSize.value) {
			return {};
		}
		return {
			...options.value.containerStyle,
			'--observe-top': `${containerSize.value.top}px`,
			'--observe-left': `${containerSize.value.left}px`,
			'--observe-width': `${containerSize.value.width}px`,
			'--observe-height': `${containerSize.value.height}px`
		};
	});

	function onContainerClick() {
		emphasizeStore.watchSchema(options.value.schemaId);
	}

	watch(containerRef, () => {
		// DOM 类型
		if (
			containerRef.value &&
			containerRef.value.children &&
			containerRef.value.children[0]
		) {
			resizeObserver.disconnect();
			resizeObserver.observe(containerRef.value.children[0]);
		} else {
			if (!Array.isArray(containerRef.value)) {
				const el = containerRef.value.$el;
				resizeObserver.disconnect();
				resizeObserver.observe(el);
			}
		}
	});

	onUnmounted(() => {
		resizeObserver.disconnect();
	});

	return {
		containerRef,
		containerSizeStyle,
		onContainerClick
	};
}
