export const PAGE_FORMAT = [
	{
		label: 'WEB',
		value: 'web',
		size: {
			width: '100%',
			height: 'fit-content',
			minHeight: '34px'
		}
	},
	{
		label: '拉伸',
		value: 'full',
		size: {
			width: '100%',
			height: '100%',
			minHeight: '34px'
		}
	},
	{
		label: 'A4',
		value: 'A4',
		size: {
			width: '210mm',
			height: '297mm'
		}
	},
	{
		label: 'A5',
		value: 'A5',
		size: {
			width: '148mm',
			height: '210mm'
		}
	},
	{
		label: 'B5',
		value: 'B5',
		size: {
			width: '176mm',
			height: '250mm'
		}
	},
	{
		label: '48开',
		value: '48开',
		size: {
			width: '185mm',
			height: '85mm'
		}
	}
];

export const PAGE_DIRECTION = [
	{
		label: '横向',
		value: 'landscape'
	},
	{
		label: '纵向',
		value: 'portrait'
	}
];

export const FORM_LABEL_ALIGN = [
	{
		label: '左对齐',
		value: 'left'
	},
	{
		label: '右对齐',
		value: 'right'
	}
];

export const FORM_LABEL_PLACEMENT = [
	{
		label: '标签左置',
		value: 'left'
	},
	{
		label: '标签上置',
		value: 'top'
	}
];

export const TEXT_INPUT_TYPE = [
	{
		label: '文本',
		value: 'text'
	},
	{
		label: '密码',
		value: 'password'
	},
	{
		label: '文本框',
		value: 'textarea'
	}
];

export const DATA_SOURCE_SCHEMAS = [
	{
		label: '对象检索',
		value: 'object'
	},
	{
		label: 'HTTP/HTTPS',
		value: 'http'
	}
];

export const DATA_SOURCE_OBJECT_SCHEMA_HOST = [
	{
		label: '路径',
		value: 'path'
	}
];

export const DATA_SOURCE_HTTP_SCHEMA_HOST = [
	{
		label: `${location.hostname}${location.port ? ':' + location.port : ''}`,
		value: `${location.hostname}${location.port ? ':' + location.port : ''}`
	},
	{
		label: 'env.BASE_URL',
		value: '${BASE_URL}'
	}
];

export const FONTS = [
	{
		label: '宋体',
		value: '宋体'
	},
	{
		label: '黑体',
		value: '黑体'
	},
	{
		label: '仿宋',
		value: '仿宋'
	},
	{
		label: '楷体',
		value: '楷体'
	},
	{
		label: '微软雅黑',
		value: '微软雅黑'
	},
	{
		label: 'Arial',
		value: 'Arial'
	},
	{
		label: 'Time New Roman',
		value: 'Time New Roman'
	}
];

export const WHITE_SPACE_OPTIONS = [
	{
		label: 'normal',
		value: 'normal'
	},
	{
		label: 'nowrap',
		value: 'nowrap'
	},
	{
		label: 'pre',
		value: 'pre'
	},
	{
		label: 'pre-wrap',
		value: 'pre-wrap'
	},
	{
		label: 'pre-line',
		value: 'pre-line'
	},
	{
		label: 'break-spaces',
		value: 'break-spaces'
	}
];

export const FLEX_WRAP_OPTIONS = [
	{
		label: 'nowrap',
		value: 'nowrap'
	},
	{
		label: 'wrap',
		value: 'wrap'
	},
	{
		label: 'revert',
		value: 'revert'
	},
	{
		label: 'inherit',
		value: 'inherit'
	},
	{
		label: 'unset',
		value: 'unset'
	},
	{
		label: 'wrap-reverse',
		value: 'wrap-reverse'
	},
	{
		label: 'initial',
		value: 'initial'
	}
];

export const DISPLAY_OPTIONS = [
	{
		label: '弹性布局',
		value: 'flex'
	},
	{
		label: '行内弹性布局',
		value: 'inline-flex'
	},
	{
		label: '行内',
		value: 'inline'
	},
	{
		label: '块级',
		value: 'block'
	},
	{
		label: 'initial',
		value: 'initial'
	}
];

export const JUSTIFY_CONTENT_OPTIONS = [
	{
		value: 'stretch',
		label: '拉伸'
	},
	{
		value: 'flex-start',
		label: '起点'
	},
	{
		value: 'flex-end',
		label: '终点'
	},
	{
		value: 'center',
		label: '居中'
	},
	{
		value: 'space-between',
		label: '首尾均分'
	},
	{
		value: 'space-around',
		label: '居中均分'
	},
	{
		label: 'initial',
		value: 'initial'
	}
];

export const ALIGN_ITEMS_OPTIONS = [
	{
		value: 'stretch',
		label: '拉伸'
	},
	{
		value: 'flex-start',
		label: '起点'
	},
	{
		value: 'flex-end',
		label: '终点'
	},
	{
		value: 'center',
		label: '居中'
	},
	{
		label: 'initial',
		value: 'initial'
	}
];

export const FLEX_OPTIONS: {
	label: string;
	value: any;
}[] = [
	{
		label: 'initial',
		value: 'initial'
	}
];
for (let i = 1; i <= 12; i++) {
	FLEX_OPTIONS.push({
		value: i,
		label: `${i}`
	});
}

export const BUTTON_TYPE_OPTIONS = [
	{
		label: 'default',
		value: 'default'
	},
	{
		label: 'tertiary',
		value: 'tertiary'
	},
	{
		label: 'primary',
		value: 'primary'
	},
	{
		label: 'success',
		value: 'success'
	},
	{
		label: 'info',
		value: 'info'
	},
	{
		label: 'warning',
		value: 'warning'
	},
	{
		label: 'error',
		value: 'error'
	}
];
