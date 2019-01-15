//visual node network configs
var vnnConfig = {
	node: {},
	endPoint: {},
	connentionTypes: {}
}
//默认节点div模板
vnnConfig.node.template = '<div id="nodeId" class="drag-ele">' +
		'<i style="float: right" onclick="deleteNode(this)">x</i>' +
		'<div class="content">Content</div>' +
		'</div>';

//默认节点样式
vnnConfig.node.common = {
	isSource: true,
	isTarget: true,
	connector: ['Bezier'], //Bezier StateMachine
	connectorOverlays: [
		['Arrow', {
			width: 12,
			length: 10,
			location: 1,
			id: 'arrow'
		}],
	],
	maxConnections: -1
}

vnnConfig.endPoint.in = {
	endpoint: 'Dot', //Rectangle Dot Img
	endpointStyle: {
		fill: '#666',
		radius: 5
	},
	connectionType: 'basic',
	anchor: 'Left',
	type: 'in'
}
vnnConfig.endPoint.out = {
	endpoint: ['Image', {
				src: 'svg/triangle-sm.svg',
// 				cssClass: 'endpoint-img',
// 				hoverClass: 'endpoint-hover'
			} ], 
	endpointStyle: {
		fill: '#666',
		radius: 5
	},
	src: '/svg/triangle.svg',
	connectionType: 'basic',
	anchor: 'Right',
	type: 'out',
}

vnnConfig.connentionTypes.basic = {
	paintStyle:{ stroke:'#cccccc', strokeWidth: 4 },
	hoverPaintStyle:{ stroke:'#4dabf7', strokeWidth: 6 },
	cssClass:'connector-normal'
}
vnnConfig.connentionTypes.selected = {
	paintStyle:{ stroke:'#626c91', strokeWidth:4  },
	hoverPaintStyle:{ stroke:'#4dabf7', strokeWidth: 6 },
	cssClass:'connector-normal'
}

vnnConfig.nodeDataAttributes = {
	datasource: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'filepath', placeholder: '文件路径'},
		{attrName: 'other', placeholder: '备注'},
	],
	algrorithm: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'algrorithm', placeholder: '算法'}
	],
	comment: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'comment', placeholder: 'comment'}
	],
	frame: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'frame', placeholder: 'frame'}
	],
	table: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'table', placeholder: 'table'}
	],
	timer: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'timer', placeholder: 'timer'}
	],
	info: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'info', placeholder: 'info'}
	],
	merge: [
		{attrName: 'alias', placeholder: '名称'},
		{attrName: 'merge', placeholder: 'merge'}
	]
}