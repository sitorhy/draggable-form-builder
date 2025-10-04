/* @vite-ignore */

/**
 * Change Log
 * Add Core Method ESMLoader
 */

export const moduleString = (str: string) => `data:text/javascript,${str}`;
export const ESMLoader = (str: any) => import( /* @vite-ignore */ moduleString(str));
export const strToESM = (str: string) => {
	console.log('deprecated: strToESM() use ESMLoader()');
	return ESMLoader(str);
};
export const escapeHtml = (s: string) =>
	(s + '').replace(/[&<>"']/g, function (m: string): string {
		return (
			{
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;'
			}[m] || ''
		);
	});

export const fetch = window.fetch;
export const fetchImport = (url: string) => fetch(url).then(ESMLoader);
export const dynamicImport = (url: string) => {
	console.log(
		'deprecated: please use importScript() or ESMImport() and not dynamicImport'
	);
	/* @vite-ignore */
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	typeof window === 'undefined' ? fetchImport(url) : import( /* @vite-ignore */ url);
};
// You should not use it as it has sideeffects that are complex use ESMLoader for consistent behavior.
// With nodeJS Relativ resolution would not work with the browser it would
// ./ === url split / last item if that gets added it would behave consistent as long as all dependencys
// are using ESMImport thats why its not documented or added to external api till import.meta is solved.
/* @vite-ignore */
export const ESMImport = (url: string) =>
	typeof window === 'undefined' ? fetchImport(url) : import(/* @vite-ignore */ url);
export { ESMImport as importScript };

// Exports a Module that exports a str object
// Usage importStrToExport('https://mytemplate.com/index.html').then(({ str })=>console.log(str))
// Example that shows how to assign a result to a var for advanced scenarios. like in tag-html or
// tagged-template-strings packages.
// Most Advanced usecase is shim const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
export const importStrToExport = (url: string) =>
	fetch(url).then((str) => ESMLoader(`export const str = \`${str}\``));
// Most Advanced usecase is shim const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
//export const inlineRequire = parseRequire statments into obj then return Obj with results of results
//Global symbol registry
//ES6 has a global resource for creating symbols: the symbol registry. The symbol registry provides us with a one-to-one relationship between strings and symbols. The registry returns symbols using Symbol.for( key ).
//Symbol.for( key1 ) === Symbol.for( key2 ) whenever key1 === key2. This correspondance works even across service workers and iframes.
