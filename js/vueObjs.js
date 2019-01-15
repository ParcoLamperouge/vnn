var app = new Vue({
	el: '#app',
	data: {
		seen: true,
		message: '通过操作节点模拟数学模型建立'
	}
});
//btn - group
var btnClear = new Vue({
	el: '#btn-new',
	data: {
		text: 'new'
	}
});
var btnLoadProject = new Vue({
	el: '#btn-loadproject',
	data: {
		text: 'load'
	}
});
var btnDelete = new Vue({
	el: '#btn-deleteItem',
	data: {
		text: 'delete'
	}
});
var btnSave = new Vue({
	el: '#btn-save',
	data: {
		text: 'save'
	}
});
var btnLoadExample = new Vue({
	el: '#btn-loadexample',
	data: {
		text: 'example'
	}
});
var pad1 = new Vue({
	el: '#pad-json-edit',
	data: {
		seen: true,
	}
});
var pad2 = new Vue({
	el: '#pad-node-edit',
	data: {
		seen: false,
		bindEleId: '',
		seenItems: []
	},
	methods: {
		loadInput: function(data){
			this.seen = true;
			if(data){
				this.bindEleId = data.id;
				var l = eval("vnnConfig.nodeDataAttributes." + data.nodetype.toLowerCase());
				var d = data;
				if(l.length > 0){
					this.seenItems= [];
					this.seenItems = l;
					for(var j = 0; j < l.length; j++){
						var i = l[j];
						i.value = eval('data.' + i.attrName.toLowerCase());
					}
				}else{
					alert('查询节点类型： ' + data.nodetype + '配置信息出错。')
				}
			}
		},
		change: function(event){
			var ele = $('#' + this.bindEleId)[0];
			ele.setAttribute('data-' + event.target.id, event.target.value);
			var content = $('#' + this.bindEleId + ' > .tooltip')[0];
			if(event.target.id == 'alias'){
				content.innerHTML = event.target.value;
			}
		},
		clearList: function(){
			this.seenItems = [];
		}
	}
});
var tab1 = new Vue({
	el: '#tab-json-edit',
	data: {
		isActive: true,
		message: '项目JSON数据交互'
	},
	methods: {
		select: function(event, f){
			pad1.seen = true;
			pad2.seen = false;
			tab1.isActive = true;
			tab2.isActive = false;
			if(f)
			$('#history-area')[0].value = f ;
		}
	}
});
var tab2 = new Vue({
	el: '#tab-node-edit',
	data: {
		isActive: false,
		message: '节点信息编辑'
	},
	methods: {
		select: function(event, data){
			pad1.seen = false;
			tab2.isActive = true;
			tab1.isActive = false;
			pad2.loadInput(data);
		}
	}
});