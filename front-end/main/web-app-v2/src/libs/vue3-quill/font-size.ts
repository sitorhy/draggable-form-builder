import Quill from 'quill';

const sizes = [
	'10px',
	'12px',
	'14px',
	'16px',
	'20px',
	'24px',
	'36px',
	'11pt',
	'17pt',
	'22pt'
];
const Font: any = Quill.import('attributors/style/size');
Font.whitelist = sizes;
Quill.register(Font, true);

export default sizes;
