import page from './page';
import datePicker from './date-picker';
import textInput from './textInput';
import formItem from './form-item';
import form from './form';
import type { PropertyInjectionSchema } from '../../../types.ts';
import type { PropertyFormItemSchemaOptions } from './common.ts';

export function getSchemas(options: PropertyFormItemSchemaOptions): {
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
			return datePicker(options);
		}
		case 'page': {
			return page(options);
		}
		case 'textInput': {
			return textInput(options);
		}
		case 'formItem': {
			return formItem(options);
		}
		case 'form': {
			return form(options);
		}
	}

	return {
		formProps: {},
		schemas: {
			sections: []
		}
	};
}

export function generateBindingSchema(options: PropertyFormItemSchemaOptions): {
	formProps: Record<string, any>;
	schemas: {
		sections: {
			title: string;
			id: string;
			schema: PropertyInjectionSchema[];
		}[];
	};
} {
	const config = getSchemas(options);
	if (Array.isArray(options.itemProps)) {
		config.schemas.sections.forEach((section) => {
			const schema = section.schema;
			schema.forEach((i) => {
				const extraFormItemConfig = (options.itemProps || []).find(
					(j) => j.prop === i.prop
				);
				if (extraFormItemConfig) {
					const { props, visible, formItemProps } = extraFormItemConfig;
					Object.assign(i, {
						visible
					});
					if (props) {
						i.props = {
							...i.props,
							...props
						};
					}
					if (formItemProps) {
						i.formItemProps = {
							...i.formItemProps,
							...formItemProps
						};
					}
				}
			});
		});
	}
	return config;
}
