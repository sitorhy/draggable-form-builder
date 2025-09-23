import Quill from 'quill';

const fonts = [
	'SimSun',
	'SimHei',
	'Microsoft-YaHei',
	'KaiTi',
	'FangSong',
	'Arial',
	'Times-New-Roman',
	'sans-serif'
];
const Font: any = Quill.import('formats/font');
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);

export default fonts;
