export function useThrottle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
) {
	let timeout: number | null = null;

	return function () {
		if (timeout != null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			func();
			clearTimeout(timeout);
			timeout = null;
		}, delay);
	};
}
