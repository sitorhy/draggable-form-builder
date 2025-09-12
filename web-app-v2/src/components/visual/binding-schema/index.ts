import page from './page';
import datePicker from './date-picker';

export function generateBindingSchema(options: { type: string }) {
	const type = options.type;

	switch (type) {
		case 'datePicker': {
			return datePicker();
		}
		case 'page': {
			return page();
		}
	}

	return {
		formProps: {},
		schema: []
	};
}
