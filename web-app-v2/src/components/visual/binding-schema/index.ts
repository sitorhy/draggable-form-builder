import page from './page';
import datePicker from './date-picker';
import textInput from './textInput';
import formItem from './form-item';
import form from './form';

export function generateBindingSchema(options: { type: string }) {
	const type = options.type;

	switch (type) {
		case 'datePicker': {
			return datePicker();
		}
		case 'page': {
			return page();
		}
		case 'textInput': {
			return textInput();
		}
		case 'formItem': {
			return formItem();
		}
		case 'form': {
			return form();
		}
	}

	return {
		formProps: {},
		schemas: {
			sections: []
		}
	};
}
