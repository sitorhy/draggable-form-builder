export function useThrottle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
) {
	let timeout: number | undefined = undefined;

	return function () {
		if (timeout != null) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			func();
			clearTimeout(timeout);
			timeout = undefined;
		}, delay);
	};
}
