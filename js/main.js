var areaId = 'drag-area';
var selectedConn = [];
var selectedNode = [];
var autosave = {};
var node = vnnConfig.node;
var twinklingCountDown = 50;
function main() {
	$('#main').on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();
		eventHandler(event.target.dataset);
	});

	jsPlumb.setContainer(document.getElementById(areaId));

	$('.node-template').draggable({
		helper: 'clone',
		scope: 'ss'
	});

	$('#' + areaId).droppable({
		scope: 'ss',
		drop: function(event, ui) {
			dropNode(ui.draggable[0].dataset.template, ui.position);
		}
	})

	jsPlumb.registerEndpointTypes({
		'in': {
			paintStyle: vnnConfig.endPoint.in.endpointStyle
		},
		'out': {
			paintStyle: vnnConfig.endPoint.out.endpointStyle
		}
	});

	jsPlumb.registerConnectionTypes({
		'basic': vnnConfig.connentionTypes.basic,
		'selected': vnnConfig.connentionTypes.selected
	});

	jsPlumb.bind('click', function(conn, originalEvent) {
		var id = conn.id;
		var index = selectedConn.indexOf(conn.id);
		if (selectedConn.length == 0 || index < 0) {
			selectedConn.push(id);
			conn.toggleType('selected');
		} else if (index >= 0) {
			selectedConn.remove(id);
			conn.removeType('selected');
		}
		// btnDeleteConn.seen = selectedConn.length > 0;
		console.log(selectedConn);
	});
	jsPlumb.bind('beforeDrag', function(info) {
		console.log(info);
	});
	//bind nodes
	jsPlumb.bind('beforeDrop', function(info) {
		var build = true;
		var conns = jsPlumb.getAllConnections();
		var arr = info.connection.endpoints;
		var inputType = info.dropEndpoint.anchor.type;
		var outputType = arr.filter(function(e) {
			return e.anchor.elementId == info.sourceId;
		})[0].anchor.type;
		if (info.sourceId == info.targetId) {
			alert('输入输出节点不能相同。');
			return false;
		} else if (inputType == 'Right') {
			alert('终点[输入节点]请选择左连接点。');
			return false;
		} else if (outputType == 'Left') {
			alert('起点[输出节点]请选择右连接点。');
			return false;
		}

		conns.forEach(function(e) {
			if (e.sourceId == info.sourceId && e.targetId == info.targetId) {
				var infoSourcePos = info.connection.endpoints.filter(function(f) {
					return f.elementId == e.sourceId
				})[0].anchor.type;
				var infoTargetPos = info.dropEndpoint.anchor.type;
				var existSourcePos = e.endpoints.filter(function(f) {
					return f.elementId == e.sourceId
				})[0].anchor.type;
				var existTargetPos = e.endpoints.filter(function(f) {
					return f.elementId == e.targetId
				})[0].anchor.type;
				if (infoSourcePos == existSourcePos && infoTargetPos == existTargetPos) {
					build = false;
					alert('连接已存在。');
					return;
				}
			}
		});
		return build;
	});
	// 	jsPlumb.draggable('obj0', {
	// 		containment: 'parent'
	// 	});
}

// 渲染html
function renderHtml(type, position) {
	return Mustache.render($('#' + type).html(), position)
}

// function addNode() {
// 	var id = uuid.v1();
// 	$('#' + areaId).append(node.template.replace('nodeId', id));
// 	addDraggable(id);
// 	addEndpoint(id);
// }

function addDraggable(id) {
	jsPlumb.draggable(id, {
		containment: 'parent'
	});
}

function addEndpoint(id) {
	var input = vnnConfig.endPoint.in,
		output = vnnConfig.endPoint.out;
	input.uuid = id + '-in';
	output.uuid = id + '-out';
	jsPlumb.addEndpoint(id, input, node.common);
	jsPlumb.addEndpoint(id, output, node.common);
}

function dropNode(template, position) {
	position.left -= $('.canvas-toolbar').outerWidth();
	position.top -= $('.web-font').outerHeight();
	position.id = uuid.v1();
	position.generateId = uuid.v1;
	var html = renderHtml(template, position);
	$('#' + areaId).append(html);
	initNode(template, position.id);
	generateSaveData('Autosave');
}

function initNode(template, id) {
	jsPlumb.draggable(id, {
		containment: 'parent'
	});
	addEndpoint(id);
}

function addConnection(sourceId, targetId) {
	jsPlumb.connect({
		uuids: [sourceId, targetId]
	});
}

function twinkling(eleId) {
	if(twinklingCountDown > 0){
		$('#' + eleId).addClass('twinkling');
		setTimeout(function() {
			$('#' + eleId).removeClass('twinkling');
		}, 2000)
		twinklingCountDown --;
	}
}

function eventHandler(data) {
	if (data.type === 'deleteNode') {
		deleteNode(data.id)
// 	} else if (data.type === 'editNode') {
// 		var id = data.id;
// 		tab2.select(event, data);
// 		tab2.eleType = 'node',
// 		tab2.eleId = id;
// 		//增加边框闪烁
// 		twinkling('user-input-content');
// 	} else if (data.type === 'iconNode') {
// 
// 		event.target = event.target.parentElement;
// 		data = event.target.parentElement.dataset;
// 		var id = data.id;
// 		tab2.select(event, data);
// 		twinkling('user-input-content');
// 		tab2.eleType = 'node',
// 		tab2.eleId = id;
// 	}else if (data.type === 'nodeSelected'){
// 		var id = data.id;
// 		if (selectedNode.indexOf(id) < 0) {
// 			selectedNode.push(id);
// 			$('#' + id).addClass('selected');
// 		} else {
// 			selectedNode.remove(id);
// 			$('#' + id).removeClass('selected');
// 		}
	}
}
function editNode(item){
	var target;
	if(event.target.classList.contains('node-clone')){
		target = event.target;
	}else if(event.target.parentElement.classList.contains('node-clone')){
		target = event.target.parentElement;
	}
	var id = target.id,
		data = target.dataset;
	var i = $("#" + id + ' >  i')[0];
	$(".marker").remove();
	$('#pad-node-edit').prepend('<div class="marker web-font"><i class="' + i.className + '"></i>' + ( data.nodetype || '' ) + '</div>')
	tab2.select(event, data);
	tab2.eleType = 'node',
	tab2.eleId = id;
	//增加边框闪烁
	twinkling('user-input-content');
}
function selectNode(item){
	event.preventDefault()
	var target;
	if(event.target.classList.contains('node-clone')){
		target = event.target;
	}else if(event.target.parentElement.classList.contains('node-clone')){
		target = event.target.parentElement;
	}
	var id = target.id,
		data = target.dataset;
	var previousPos = autosave.nodeList.filter(function(n){
		return n.id == id;
	})[0].position;
	var currentPos = {
		top: Number(target.style.top.replace('px', '')),
		left: Number(target.style.left.replace('px', ''))
	}
	//if haven't been dragged
	if(previousPos.top == currentPos.top && previousPos.left == currentPos.left){
		if (selectedNode.indexOf(id) < 0) {
			selectedNode.push(id);
			$('#' + id).addClass('selected');
		} else {
			selectedNode.remove(id);
			$('#' + id).removeClass('selected');
		}
	}else{
		generateSaveData('Autosave');
	}
	
}
function deleteNode(id) {
	jsPlumb.remove(id);
	// 	var selectedId = e.parentNode.id;
	// 	jsPlumb.removeAllEndpoints(selectedId);
	// 	$('#' + selectedId).remove();
	generateSaveData('Autosave');
}

function deleteItem() {
	if (selectedConn.length > 0 || selectedNode.length > 0) {
		if (window.confirm('确定删除所选择的链接及节点吗？')) {
			var conns = jsPlumb.getAllConnections().filter(function(conn) {
				return selectedConn.indexOf(conn.id) >= 0;
			});
			conns.forEach(function(conn) {
				jsPlumb.deleteConnection(conn);
			});
			selectedConn = [];

			selectedNode.forEach(function(n) {
				jsPlumb.remove(n);
			});
			selectedNode = [];
			$('.node-clone.selected').removeClass('selected');
		}
		// btnDeleteConn.seen = selectedConn.length > 0;
	} else {
		//clearConnections
		// 		if (window.confirm('未选择链接，确定删除所有的链接吗？')) {
		// 			jsPlumb.deleteEveryConnection();
		// 			selectedConn = [];
		// 		}
	}
	generateSaveData('Autosave');
}

function clearCanvas(str) {
	if ($('.node-clone').length > 0) {
		if(!str){
			str = '确定清空已有内容？';
		}
		if (window.confirm(str)) {
			jsPlumb.deleteEveryEndpoint();
			jsPlumb.deleteEveryConnection();
			var clearNodeList = $(".node-clone");
			for (var i = 0; i < clearNodeList.length; i++) {
				clearNodeList[i].remove();
			}
			selectedConn = [];
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
}

function loadProject() {
	tab1.select();
	var projectData = $('#history-area')[0].value;
	if (projectData) {
		clearCanvas();
		var projectData = JSON.parse(projectData.trim());
		draw(projectData.nodeList, projectData.connectionList);
	} else {
		alert('请输入JSON');
		twinkling('user-input-content');
	}

}

function loadExample() {
	if(clearCanvas('即将加载示例，确定清空已有内容？')){
		draw(exampleData.nodeList, exampleData.connectionList);
		generateSaveData('Autosave');
	}
}

function save() {
	var projectName = window.prompt('请输入名称');
	var saveData = formatJson(JSON.stringify(generateSaveData(projectName))).trim();
	tab1.select(event, saveData);
	return;
}
function generateSaveData(projectName){
	var nodes = $('.node-clone');
	var conns = jsPlumb.getAllConnections();
	if (nodes.length <= 0) {
		return;
	} else {
		//generate project id
		var pid = uuid.v1();
		var saveData = {
			id: pid,
			name: projectName || pid,
			nodeList: [],
			connectionList: []
		}
		conns.forEach(function(e) {
			saveData.connectionList.push({
				sourceId: e.sourceId,
				targetId: e.targetId
			})
			// console.log('Source: ' + e.sourceId + ' Target: ' + e.targetId);
		});
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var precursorIds = [],
				successorIds = [];
			var asSource = saveData.connectionList.filter(function(e) {
				return e.sourceId == node.id
			});
			var asTarget = saveData.connectionList.filter(function(e) {
				return e.targetId == node.id
			});
			asSource.forEach(function(r) {
				successorIds.push(r.targetId);
			});
			asTarget.forEach(function(r) {
				successorIds.push(r.sourceId);
			});
			var attrList = eval("vnnConfig.nodeDataAttributes." + node.getAttribute('data-nodeType').toLowerCase());
			var objData = {};
			attrList.forEach(function(a) {
				eval('var current = {' + a.attrName + ': node.getAttribute("data-" + a.attrName)}');
				Object.assign(objData, current)
			});
			var nodeData = {
				id: node.id,
				type: node.getAttribute('data-nodeType'),
				data: objData,
				precursorIds: precursorIds,
				successorIds: successorIds,
				position: {
					top: Number(node.style.top.replace('px', '')),
					left: Number(node.style.left.replace('px', ''))
				}
			};
			saveData.nodeList.push(nodeData);
		}
	}
	autosave = saveData;
	console.log('System auto save......');
	return autosave;
}

var DataProcess = {
	inputData: function(nodes) {
		var ids = this.getNodeIds(nodes)
		var g = new graphlib.Graph()

		ids.forEach(function(id) {
			g.setNode(id)
		})

		var me = this;

		nodes.forEach(function(item) {
			me['dealNode'](g, item, item.type)
		});

		console.log(g.nodes())
		var distance = graphlib.alg.dijkstra(g, 'Start');
		return this.generateDepth(distance);
	},
	setNodesPosition: function(nodes) {
		var me = this
		nodes.forEach(function(item) {
			me.getNodePosition(item)
		})
	},
	getNodePosition: function(node) {
		var $node = document.getElementById(node.id)
		node.top = parseInt($node.style.top)
		node.left = parseInt($node.style.left)
	},
	generateDepth: function(deep) {
		var depth = []

		Object.keys(deep).forEach(function(key) {
			var distance = deep[key].distance

			if (!depth[distance]) {
				depth[distance] = []
			}

			depth[distance].push(key)
		})
		return depth;
	},
	getNodeIds: function(nodes) {
		return nodes.map(function(item) {
			return item.id;
		})
	},
	dealNode: function(g, node, nodeType) {
		var successorIds = node.successorIds;
		var that = this;
		successorIds.forEach(function(id) {
			that.setEdge(g, node.id, id);
		});
	},
	setEdge: function name(g, from, to) {
		console.log(from + ' ---> ' + to);
		g.setEdge(from, to);
	}
}

function computeXY(nodeList) {
	var matrix = DataProcess.inputData(nodeList)
	var base = {
		topBase: 50,
		topStep: 150,
		leftBase: 150,
		leftStep: 200
	}

	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			var key = matrix[i][j]
			var dest = nodeList.find(function(item) {
				return item.id === key
			})
			dest.top = dest.top || base.topBase + i * base.topStep
			dest.left = dest.left || base.leftBase + j * base.leftStep
		}
	}
}

function draw(nodeList, connectionList) {
	this.computeXY(nodeList);
	var $container = $('#' + areaId);
	var me = this;

	nodeList.forEach(function(item, key) {
		var nodeData = {
			id: item.id,
			obj: {
				type: item.type,
				data: item.data
			},
			top: item.position.top,
			left: item.position.left
		}
		var template = $('#tpl-' + item.type.toLowerCase()).html();
		$container.append(Mustache.render(template, nodeData));
		addDraggable(item.id);
		addEndpoint(item.id);
	});
	connectionList.forEach(function(conn) {
		addConnection(conn.sourceId + '-out', conn.targetId + '-in');
	});
}
jsPlumb.ready(main);
