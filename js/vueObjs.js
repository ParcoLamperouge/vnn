var app = new Vue({
	el: '#app',
	data: {
		seen: true,
		message: '通过操作节点模拟数学模型建立'
	}
});
var modalHelp = new Vue({
	el: '#modal-help',
	data: {
		step: 0,
		max: 6,
		padding: 40,
		title: '提示',
		message: 'Welcome',
		content: [
			'点击按钮观看提示',
			'1.工具栏： 点击可分别进行新建画布、通过JSON加载模型、删除元素、保存JSON、展示样例等操作',
			'2.节点栏： 拖拽节点至右边的画布即可新建该类型的节点',
			'3.画布区域',
			'4.拖拽元素的右节点拉出曲线，可连接至其他元素的左节点',
			'5.填入之前保存的JSON,点击按钮加载项目',
			'6.节点单击可进入选中状态，再点一次恢复;双击可进行编辑'
		],
		timer: []
	},
	methods: {
		initPos: function(){
			$(".modal-dialog").css('position', 'relative');
			$(".modal-dialog").css('left', 'auto');
			$(".modal-dialog").css('right', 'auto');
			$(".modal-dialog").css('top', '20%');
			this.step = 0;
			this.message = this.content[this.step];
		},
		previousTips: function(){
			if(this.step > 1){
				this.step -= 1;
			}
			this.showStep();
		},
		nextTips: function(){
			if(this.step < this.max){
				this.step += 1;
			}
			this.showStep();
		},
		showStep: function(){
			var p = this.padding;
			this.message = this.content[this.step];
			$(".help-border").removeClass('help-border');
			this.timer.forEach(function(t){
				clearTimeout(t);
			})
			switch(this.step){
				case 1: {
					$(".canvas-toolbar").addClass('help-border');
					$(".modal-dialog").css('position', 'absolute');
					$(".modal-dialog").css('top', $(".canvas-toolbar").position().top + p);
					$(".modal-dialog").css('left', $(".canvas-toolbar").width() + p);
					break;
				}
				case 2: {
					forceClear();
					$(".canvas-elementbar").addClass('help-border');
					$(".modal-dialog").css('top', $(".canvas-elementbar").position().top + p);
					$(".modal-dialog").css('right', 'auto');
					$(".modal-dialog").css('left', $(".canvas-elementbar").width() + p);
					break;
				}
				case 3: {
					forceClear();
					loadExample();
					$(".drag-area").addClass('help-border');
					$(".modal-dialog").css('top', $(".drag-area").position().top);
					$(".modal-dialog").css('left', 'auto');
					$(".modal-dialog").css('right', p);
					break;
				}
				case 4: {
					$(".modal-dialog").css('top', $(".drag-area").position().top);
					$(".modal-dialog").css('left', 'auto');
					$(".modal-dialog").css('right', p);
					forceClear();
					loadExample();
					$('#json-area').text('');
					jsPlumb.getEndpoints('01')[1].canvas.style.border = '4px solid #ffc107';
					jsPlumb.getEndpoints('02')[0].canvas.style.border = '4px solid #ffc107';
					var a = setTimeout(function(e){
						jsPlumb.getAllConnections()[0].addType('highlight');
					}, 1000);
					this.timer.push(a);
					var b = setTimeout(function(e){
						jsPlumb.getAllConnections()[1].addType('highlight');
					}, 2000);
					this.timer.push(b); 
					break;
				}
				case 5: {
					forceClear();
					tab1.select();
					$("#user-input-content").addClass('help-border');
					$(".modal-dialog").css('top', $("#user-input-content").position().top + p);
					$(".modal-dialog").css('right', 'auto');
					$(".modal-dialog").css('left', $("#user-input-content").width() + p);
					var a = setTimeout(function(e){
						$('#json-area').text(formatJson(tipsData));
					}, 1000)
					this.timer.push(a);
					var b = setTimeout(function(e){
						$(".help-border").removeClass('help-border');
						$("#btn-loadproject").addClass('help-border');
					}, 2000);
					this.timer.push(b); 
					var c = setTimeout(function(e){
						loadProject();
						$("#tips01").addClass('help-border');
					}, 3000);
					this.timer.push(c); 
					break;
				}
				case 6: {
					forceClear();
					$('#json-area').text(formatJson(tipsData));
					loadProject();
					tab2.select();
					$("#tips01").addClass('help-border');
					editNode($("#tips01")[0]);
					$("#user-input-content").addClass('help-border');
					$(".modal-dialog").css('top', $("#user-input-content").position().top + p);
					$(".modal-dialog").css('left', $("#user-input-content").width() + p);
					break;
				}
			}
		}
	}
})
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
// 			var content = $('#' + this.bindEleId + ' > .vnn-tooltip')[0];
// 			if(event.target.id == 'alias'){
// 				content.innerHTML = event.target.value;
// 			}
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
		message: '项目JSON'
	},
	methods: {
		select: function(event, f){
			pad1.seen = true;
			pad2.seen = false;
			tab1.isActive = true;
			tab2.isActive = false;
			if(f)
			$('#json-area')[0].value = f ;
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