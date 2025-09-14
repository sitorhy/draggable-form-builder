import page from './page';
import datePicker from './date-picker';
import textInput from './textInput';
import formItem from './form-item';
import form from './form';
import type {
	PropertyInjectionSchema,
	RendererItemDefinition
} from '../../../types.ts';

export function generateBindingSchema(options: {
	schema: RendererItemDefinition | null | undefined;
}): {
	formProps: Record<string, any>;
	schemas: {
		sections: {
			title: string;
			id: string;
			schema: PropertyInjectionSchema[];
		}[];
	};
} {
	const type = options.schema?.type;

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
