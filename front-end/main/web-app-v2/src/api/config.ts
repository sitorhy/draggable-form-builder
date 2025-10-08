export function useApiConfig() {
	const hostname = '127.0.0.1';
	const protocol = 'http';
	const port = 8081;

	return {
		hostname,
		protocol,
		port
	};
}
