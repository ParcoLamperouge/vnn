/* 
	已弃用
 */
(function ($, window, undefined) {
    //#region 拖拽元素类
    function DragElement(node) {
        this.target = node;
        node.onselectstart = function () {
            //防止拖拽对象内的文字被选中
            return false;
        }
    }
    DragElement.prototype = {
        constructor: DragElement,
        setXY: function (x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this;
        },
        setTargetCss: function (css) {
            $(this.target).css(css);
            return this;
        }
    }
    //#endregion

    //#region 鼠标元素
    function Mouse() {
        this.x = 0;
        this.y = 0;
    }
    Mouse.prototype.setXY = function (x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }
    //#endregion

    //拖拽配置
    var draggableConfig = {
        zIndex: 1,
        dragElement: null,
        mouse: new Mouse()
    };

    var draggableStyle = {
        dragging: {
            cursor: "move"
        },
        defaults: {
            cursor: "default"
        }
    }

    var $document = $(document);

    function drag($ele) {
		var $dragArea = $ele;
		var $dragNodes = $ele.children(".drag-ele").toArray();
		$dragNodes.forEach(function($dragNode){
			//var $dragNode = $ele.find(".draggable");
			$dragNode = $("#" + $dragNode.id);
			$dragNode.on({
				"mousedown": function (event) {
					var dragElement = draggableConfig.dragElement = new DragElement($dragNode.get(0));
	
					draggableConfig.mouse.setXY(event.clientX, event.clientY);
					draggableConfig.dragElement
						.setXY(dragElement.target.style.left, dragElement.target.style.top)
						.setTargetCss({
							"zIndex": draggableConfig.zIndex++,
							"position": "relative"
						});
				},
				"mouseover": function () {
					$(this).css(draggableStyle.dragging);
				},
				"mouseout": function () {
					$(this).css(draggableStyle.defaults);
				}
			})
		});
        
    }

    function move(event) {
        if (draggableConfig.dragElement) {
            var mouse = draggableConfig.mouse,
                dragElement = draggableConfig.dragElement;
            dragElement.setTargetCss({
                "left": parseInt(event.clientX - mouse.x + dragElement.x) + "px",
                "top": parseInt(event.clientY - mouse.y + dragElement.y) + "px"
            });

            $document.off("mousemove", move);
            setTimeout(function () {
                $document.on("mousemove", move);
            }, 25);
        }
    }

    $document.on({
        "mousemove": move,
        "mouseup": function () {
            draggableConfig.dragElement = null;
        }
    });

    $.fn.drag = function (options) {
        drag(this);
    }

})(jQuery, window, undefined)

/*
	待追加核心功能：
		1.连线
		2.删除连线
		3.读取连线图，转换为公式规则
	待追加功能：
		1.drag-ele不能超越drag-area
		2.content可修改
		3.元素可以增加删除
		4.area添加侧边栏 供增加元素等操作
		5.样式修改
*/