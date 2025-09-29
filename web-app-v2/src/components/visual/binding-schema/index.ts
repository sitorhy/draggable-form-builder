import page from './page';
import datePicker from './date-picker';
import textInput from './textInput';
import formItem from './form-item';
import form from './form';
import grid from './grid';
import container from './container';
import linearList from './linear-list';
import ellipsis from './ellipsis';
import image from './image';
import radioGroup from './radio-group';
import radio from './radio';
import equation from './equation';
import richText from './rich-text';
import type { PropertyInjectionSchema } from '../../../types';
import type { PropertyFormItemSchemaOptions } from './common';

export type PropertyItemSchemasReturnType = {
	formProps: Record<string, any>;
	schemas: SectionsReturnType;
};

export type SectionsReturnType = {
	sections: {
		title: string;
		id: string;
		schema: PropertyInjectionSchema[];
	}[];
};

export function getSchemas(
	options: PropertyFormItemSchemaOptions
): PropertyItemSchemasReturnType {
	const type = options.schema?.type;

	switch (type) {
		case 'datePicker': {
			return datePicker();
		}
		case 'page': {
			return page();
		}
		case 'textInput': {
			return textInput(options);
		}
		case 'formItem': {
			return formItem();
		}
		case 'form': {
			return form();
		}
		case 'grid': {
			return grid(options);
		}
		case 'container': {
			return container(options);
		}
		case 'linearList':
		case 'list': {
			return linearList(options);
		}
		case 'ellipsis': {
			return ellipsis(options);
		}
		case 'image': {
			return image();
		}
		case 'radioGroup': {
			return radioGroup();
		}
		case 'radio': {
			return radio();
		}
		case 'equation': {
			return equation(options);
		}
		case 'richText': {
			return richText();
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
					const { config, visible, formItemProps } = extraFormItemConfig;
					Object.assign(i, {
						visible
					});
					if (config) {
						i.config = {
							...i.config,
							...config
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
