export function useApiConfig() {
	const hostname = location.hostname;
	const protocol = 'http';
	const port = 8081;

	return {
		hostname,
		protocol,
		port
	};
}
