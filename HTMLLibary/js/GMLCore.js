/**
 * Created by guominglong on 2017/12/11.
 * 核心库
 */

/**
 * 基础类,可以被初始化
 * */
class BaseObject{

    constructor(){

    }

    /**
     * 判断类型是否相同
     * */
    isKindOf(_classType){
        if(!_classType)
            return false;
        return this.constructor === _classType;
    }

    /**
     * 判断类型是否相同或者继承_classTypeStr的类型
     * */
    isMemberOf(_classType){
        if(!_classType)
            return false;
        return this instanceof _classType;
    }


    destroy(){

    }
}

/**
 * 基础场景管理类
 * */
class BaseScene extends BaseObject{
    static get main() {
        if (!window.gmlbaseScene)
            window.gmlbaseScene = new BaseScene();
        return window.gmlbaseScene;
    }
    constructor(){
        super();
        this._mainCanvas = new GMLCanvas();//主画布
        this._rootSprite = new GMLSprite();//根显示容器
        this._currentDrawIndex = 0;//全局图层绘制索引,用于鼠标点击检测
        this._defaultOverDisItem = null;//鼠标移入时的响应可视化对象
    }

    start(){
        //将画布添加至document
        document.body.appendChild(this._mainCanvas.canvas);
        this._mainCanvas.canvas.style.zIndex = 0;
        this._mainCanvas.canvas.style.position = "absolute"
        this._mainCanvas.canvas.style.left = "0px";
        this._mainCanvas.canvas.style.top = "0px";

        //添加系统事件检测
        this.addSystemEvents();

        //开始时间轴
        TimeLine.main.start(this.updateAnimation);
    }

    get frameRate(){
        return TimeLine.main.frameRate;
    }

    /**
     * 设置帧频
     * */
    set frameRate(n){
        TimeLine.main.frameRate = n;
    }


    /**
     * 私有函数,添加系统事件检测
     * */
    addSystemEvents(){
        //截获右键点击事件
        document.oncontextmenu = this._onRightClick;
        //添加系统级的通知监听
        window.addEventListener("keydown",function(evt){
            BaseNotificationCenter.main.postNotify(NotifyStruct.onKeyDown,evt);
        })
        window.addEventListener("keyup",function(evt){
            //spr3.x += 2;
            BaseNotificationCenter.main.postNotify(NotifyStruct.onKeyUp,evt);
        })

        window.addEventListener("mousedown",function(evt){
            //执行鼠标down检测
            BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.Down);
        })

        window.addEventListener("mouseup",function(evt){
            //执行鼠标up检测
            BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.Up);
        })

        window.addEventListener("click",function(evt){
            //执行鼠标click检测
            BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.Click);
        })

        window.addEventListener("dblclick",function(evt){
            //执行鼠标doubleClick检测
            BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.DoubleClick);
        })

        window.addEventListener("mousemove",function(evt){
            //let arg = {"x":evt.x,"y":evt.y};//arg 之所以evt.x向左偏移10px,是因为主canvas并没有在html的0,0点,而是10,10点
            ////鼠标over,out检测
            let disPlayItem = BaseScene.main._mouseHitTest(evt,GMLMouseEvent.Over);
            let item = BaseScene.main._defaultOverDisItem;
            if(disPlayItem) {
                if(item)
                {
                    if(disPlayItem==item)
                    {
                        return;
                    }
                    BaseScene.main._defaultOverDisItem = null;
                    let outNe = new GMLMouseEvent(GMLMouseEvent.Out,{globelX:evt.x,globelY:evt.y});
                    item.dispatchEvent(outNe);//向其派发鼠标Out事件

                    BaseScene.main._defaultOverDisItem = disPlayItem;
                    let overNe = new GMLMouseEvent(GMLMouseEvent.Over,{globelX:evt.x,globelY:evt.y});
                    disPlayItem.dispatchEvent(overNe);//向其派发鼠标Over事件
                }else{
                    BaseScene.main._defaultOverDisItem = disPlayItem;
                    let ne2 = new GMLMouseEvent(GMLMouseEvent.Over,{globelX:evt.x,globelY:evt.y});
                    disPlayItem.dispatchEvent(ne2);//向其派发鼠标Over事件
                }
            }else{
                if(item){
                    BaseScene.main._defaultOverDisItem = null;
                    let ne = new GMLMouseEvent(GMLMouseEvent.Out,{globelX:evt.x,globelY:evt.y});
                    item.dispatchEvent(ne);//向其派发鼠标移出事件
                }
            }

            //鼠标move事件派发
            BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.Move);
        })

        window.addEventListener("mouseout",function(evt){
            if(BaseScene.main._defaultOverDisItem){
                let ne = new GMLMouseEvent(GMLMouseEvent.Out,{globelX:evt.x,globelY:evt.y});
                BaseScene.main._defaultOverDisItem.dispatchEvent(ne)//向指定对象派发mouseout事件
            }
        });
    }

    /**
     * 比较两个可视化对象,谁的层级更高,则返回谁
     * */
    _compareDisplayObj(preDisplayItem,currentDisplayItem){
        if(currentDisplayItem._zIndex >= preDisplayItem._zIndex)
            return currentDisplayItem;
        else
            return preDisplayItem;
    }

    /**
     * 鼠标检测
     * return 检测结果GMLDispaly对象或者 null
     * */
    _mouseHitTest(evt,type){
        let tempResultDisplayObj = null;
        let observerSet = BaseNotificationCenter.main.getObserversByKey(type);
        let argX = evt.x;
        let argY = evt.y;
        if(observerSet){
            //遍历set 循环进行点检测
            observerSet.forEach(function(mp,key){
                for(let item of mp.entries())
                {
                    let obs = item[0];
                    if(obs && obs instanceof GMLDisplay)
                    {
                        //进行点检测
                        let hitItem = obs.hitTestPoint(argX,argY);
                        if(hitItem){
                            if(tempResultDisplayObj)
                            {
                                //与上一次检测到的item进行比较, 谁的层级更高,则谁触发相应事件
                                tempResultDisplayObj = BaseScene.main._compareDisplayObj(tempResultDisplayObj,obs);
                            }else{
                                //直接赋值
                                tempResultDisplayObj = obs;
                            }
                        }
                    }
                }
            })
        }
        return tempResultDisplayObj;
    }

    /**
     * 鼠标检测,并派发事件
     * */
    _mouseHitTestAndDispatch(evt,type){
        let tempResultDisplayObj = BaseScene.main._mouseHitTest(evt,type);
        if(tempResultDisplayObj){
            let ne = new GMLMouseEvent(type,{globelX:evt.x,globelY:evt.y});
            tempResultDisplayObj.dispatchEvent(ne);//向指定对象派发事件
            //console.log(tempResultDisplayObj.name);
        }
    }

    /**
     * 自定义右键点击事件
     * */
    _onRightClick(evt){
        //注意,这里的this指代的是document

        //点检测,并向监听者派发事件
        BaseScene.main._mouseHitTestAndDispatch(evt,GMLMouseEvent.RightClick);
        //执行自己的鼠标右键点击操作,比如显示自定义菜单

        return false;//屏蔽屏幕源生的右键菜单
    }

    /**
     * 时间轴更新动画函数
     * */
    updateAnimation(){
        BaseScene.main._currentDrawIndex = 0;
        //这里的this 是一个undefined 因为他是window.requestAnimationFrame 的一个回调函数
        let ctx = BaseScene.main._mainCanvas.context2D;
        //先清空
        ctx.clearRect(0,0,BaseScene.main._mainCanvas.width,BaseScene.main._mainCanvas.height);
        //再重绘
        BaseScene.main._rootSprite.drawInContext(ctx,0,0,1,1);//跟容器必须绘制在ctx的0,0位置且 缩放必须为1倍
    }

    /**
     * 尺寸变更
     * */
    resize(w,h){
        this._mainCanvas.width = w;
        this._mainCanvas.height = h;
    }

    /**
     * 停止
     * */
    stop(){
        TimeLine.main.stop();
    }

    /**
     * 添加可视对象到子可视化对象数组中的最后一位
     * */
    addChild(_child){
        BaseScene.main._rootSprite.addChild(_child)
    }

    /**
     * 添加可视对象到子可视化对象数组中的最后一位
     * */
    addChildAt(_child,idx){
        BaseScene.main._rootSprite.addChildAt(_child,idx)
    }

    /**
     * 移除一个子对象
     * */
    removeChild(_child){
        BaseScene.main._rootSprite.removeChild(_child);
    }

    /**
     * 批量移除子对象
     * */
    removeChildren(){
        BaseScene.main._rootSprite.removeChildren();
    }

    /**
     * 获取所有子成员
     * */
    children(){
        return BaseScene.main._rootSprite.children();
    }


}

/**
 * 基础事件派发者
 * Created by guominglong on 2017/4/7.
 */
class BaseEventDispatcher extends BaseObject{

    constructor(){
        super();
        this.eventNode = document.createElement("div");
        this.events = new Map();
    }

    /**
     * 派发事件
     * @param evt 是一个BaseEvent
     * */
    dispatchEvent(evt){
        if(!evt){
            return;
        }
        evt.gCurrentTarget = this;
        this.eventNode.dispatchEvent(evt);
        evt.gCurrentTarget = null;//用完就释放,避免循环引用
    }

    /**
     * 添加一个事件监听
     * @param evtType 自定义的事件类型(也可以是系统的事件类型)
     * @param execFunc 事件的处理函数
     * @param useCapture 是否在捕获阶段执行,默认为false(在目标阶段和冒泡阶段执行)
     * */
    addEventListener(evtType,execFunc,useCapture = false){
        if(!evtType){
            return;
        }
        //let arr = [MouseEvent.Click,MouseEvent.RightClick,MouseEvent.DoubleClick,MouseEvent.Down,MouseEvent.Up,MouseEvent.Over,MouseEvent.Out,MouseEvent.Move]
        //if(arr.indexOf(evtType) > 0)
        //{
        //    //针对鼠标点击事件,做特殊处理,以使其正常响应
        //    BaseNotificationCenter.main.addObserver(this,evtType,function(){});//这里只需要一个非实质函数作为参数即可,因为这个函数在后续流程中是不会被用到的
        //}

        if(this.events.has(evtType)){
            //如果添加过监听,就追加
            this.events.get(evtType).add(execFunc)
        }else{
            //如果没有添加过监听,就新建监听集合
            this.events.set(evtType,new Set([execFunc]));
        }
        this.eventNode.addEventListener(evtType,execFunc,useCapture);
    }

    /**
     * 添加一个事件监听
     * @param evtType 自定义的事件类型(也可以是系统的事件类型)
     * @param execFunc 事件的处理函数
     * @param useCapture 是否在捕获阶段执行,默认为false(在目标阶段和冒泡阶段执行)
     * */
    removeEventListener(evtType,execFunc,useCapture = false){
        if(!evtType){
            return;
        }
        if(this.events.has(evtType)){
            //如果添加过监听,就追加
            let evtSet = this.events.get(evtType);
            evtSet.forEach((value,key) => {
                if(value == execFunc){
                    evtSet.delete(value)//移除事件监听
                }
            })
                //如果监听函数数组的长度为0,代表不再需要用map来维护,直接删除
                if(evtSet.size == 0){
                    this.events.delete(evtType)
                }
        }
        this.eventNode.removeEventListener(evtType,execFunc,useCapture)
    }

    /**
     * 移除所有的监听事件
     * */
    removeAllEventListener(){
        //遍历map
        let mySelf = this;
        this.events.forEach((value,key)=>{
            //遍历每一个监听类型对应的set函数数组
            let funcSet = value;
            funcSet.forEach((func,idx)=>{
                //移除指定的监听事件
                mySelf.eventNode.removeEventListener(key,func);
            })
            //清空函数数组
            funcSet.clear();
        })
        //清空map
        this.events.clear();
    }

    destroy(){
        super.destroy();
        this.removeAllEventListener();
    }
}

/**
 * 通知中心
 * */
class BaseNotificationCenter extends BaseObject{
    static get main() {
        if (!window.gmlNotificationCenter)
            window.gmlNotificationCenter = new BaseNotificationCenter();
        return window.gmlNotificationCenter;
    }

    constructor(){
        super();
        this._notifyMap = new Map();
    }

    /**
     * 触发通知监听
     * */
    postNotify(key,argObject){
        if(this._notifyMap.has(key)){
            let arr = this._notifyMap.get(key)
            for (let mp of arr){
                for(let item of mp.entries())
                {
                    item[1].call(item[0],argObject)
                }
            }
        }
    }

    /**
     * 根据监听key获取监听者数组
     * @return Set([Map])
     * */
    getObserversByKey(key){
        if(this._notifyMap.has(key)){
            return this._notifyMap.get(key)
        }
        else{
            return null;
        }
    }

    /**
     * 添加通知监听
     * @param observer 被监听对象
     * @param key 监听的类型
     * @param execFunc被监听对象所拥有的public类型的处理函数
     * */
    addObserver(observer,key,execFunc){
        if(this._notifyMap.has(key)){
            let mp = new Map();
            mp.set(observer,execFunc);
            this._notifyMap.get(key).add(mp);
        }else{
            let mp = new Map();
            mp.set(observer,execFunc);
            this._notifyMap.set(key,new Set([mp]));
        }
    }

    /**
     * 移除指定对象上的指定类型的通知监听
     * */
    removeObserver(observer,key){
        if(this._notifyMap.has(key)){
            let arr = this._notifyMap.get(key);
            let tempArr = Array.from(arr).concat()
            tempArr.forEach(function(mp,idx){
                if(mp.has(observer))
                {
                    arr.delete(mp);
                    mp.clear();
                }
            })
        }
    }

    /**
     * 移除指定key对应的通知监听数组
     * */
    removeAllObserverByKey(key){
        if(this._notifyMap.has(key)){
            let arr = this._notifyMap.get(key);
            for(let mp of arr){
                mp.clear();
            }
            arr.clear();
        }
    }

    /**
     * 移除全部的通知监听
     * */
    removeAllObserver(){
        let keys = this._notifyMap.keys();
        for(let key of keys){
            let arr = this._notifyMap.get(key);
            for(let mp of arr){
                mp.clear();
            }
            arr.clear();
        }
        this._notifyMap.clear();
    }
}

/**
 *  文本对其方式 枚举
 * */
class GMLTextFieldAliginEnum{
    /**
     * 横向居中
     * */
    static get Center(){
        return "center"
    }

    /**
     * 横向左对其
     * */
    static get Left(){
        return "left"
    }

    /**
     * 横向右对其
     * */
    static get Right(){
        return "right"
    }

    //注释的原因是因为它可以用 itiwY来实现
    ///**
    // * 纵向顶部对其
    // * */
    //static get Top(){
    //    return "top"
    //}
    //
    ///**
    // * 纵向居中对其
    // * */
    //static get Middle(){
    //    return "middle"
    //}
    //
    ///**
    // * 纵向底部对其
    // * */
    //static get Bottom(){
    //    return "bottom"
    //}

    constorctor(){

    }
}


//显示对象类型声明----------------begin-------------------------
/**
 * 画布
 * */
class GMLCanvas extends BaseEventDispatcher{
    constructor(){
        super();
        this.canvas = document.createElement("canvas");

        this._argChanged = true;
        this._width = 0;//宽度
        this._height = 0;//高度
    }

    get width(){
        return this._width;
    }
    set width(n){
        this._width = (n < 0 ? 0 : n) * ScreenManager.main.quilaty;
        this.canvas.width = this._width + "";
    }
    get height(){
        return this._height;
    }
    set height(n){
        this._height = (n < 0 ? 0 : n) * ScreenManager.main.quilaty;
        this.canvas.height = this._height + "";
    }


    get context2D(){
        if(this._argChanged)
        {
            //重新创建画布上下文
            this._context2D = this.canvas.getContext("2d");
        }
        return this._context2D;
    }

}

/**
 * 显示对象基础类
 * */
class GMLDisplay extends BaseEventDispatcher{
    constructor(){
        super();

        this._width = 0;//宽度
        this._height = 0;//高度
        this._scaleX = 1;//横向缩放比
        this._scaleY = 1;//纵向缩放比
        this._x = 0;//横向坐标
        this._y = 0;//纵向坐标
        this._z = 0;//深度坐标
        this._rotateZ = 0;//沿Z轴旋转的角度
        this._rotateX = 0;//沿x轴旋转的角度
        this._rotateY = 0;//沿y轴旋转的角度
        this._alpha = 1;//不透明度
        this._hidden = false;//是否隐藏
        this._itiwX = 0;//Internal to its way内部对其方式,横向的值  取值0-1之间.默认0  为左上角为基点.假如为1的话,则右上角为基点
        this._itiwY = 0;//Internal to its way内部对其方式,纵向的值  取值0-1之间.默认0  为左上角为基点.假如为1的话,则最下角为基点


        this._parent = null;//父容器显示对象的引用
        //this._rootParent = null;//根容器显示对象的引用   之所以注释掉,是因为感觉没什么用

        //以下用于做鼠标点击检测
        this._rectVect = [0,0,0,0];//[x,y,w,h]

        this._zIndex = 0;//GMLDisplay被绘制到ctx的顺序,用于点检测计算

    }
    get itiwX(){
        return this._itiwX;
    }

    set itiwX(n){
        this._itiwX = n < 0 ? 0 : n;
        this._itiwX = this._itiwX > 1 ? 1 : this._itiwX;
    }

    get itiwY(){
        return this._itiwY;
    }

    set itiwY(n){
        this._itiwY = n < 0 ? 0 : n;
        this._itiwY = this._itiwY > 1 ? 1 : this._itiwY;
    }

    get width(){
        return this._width;
    }
    set width(n){
        this._width = n < 0 ? 0 : n;
    }
    get height(){
        return this._height;
    }
    set height(n){
        this._height = n < 0 ? 0 : n;
    }
    get scaleX(){
        return this._scaleX;
    }
    set scaleX(n){
        this._scaleX = n < 0 ? 0 : n;
    }
    get scaleY(){
        return this._scaleY;
    }
    set scaleY(n){
        this._scaleY = n < 0 ? 0 : n;
    }
    get x(){
        return this._x;
    }
    set x(n){
        this._x = n;
    }
    get y(){
        return this._y;
    }
    set y(n){
        this._y = n;
    }
    get z(){
        return this._z;
    }
    set z(n){
        this._z = n;
    }
    get rotateZ(){
        return this._rotateZ;
    }
    set rotateZ(n){
        this._rotateZ = n;
    }
    get rotateX(){
        return this._rotateX;
    }
    set rotateX(n){
        this._rotateX = n;
    }
    get rotateY(){
        return this._rotateY;
    }
    set rotateY(n){
        this._rotateY = n;
    }
    get alpha(){
        return this._alpha;
    }
    set alpha(n){
        this._alpha = n < 0 ? 0 : n;
        this._alpha = this._alpha > 1 ? 1 : this._alpha;
    }
    get hidden(){
        return this._hidden;
    }
    set hidden(n){
        this._hidden = n;
    }
    get parent(){
        return this._parent;
    }
    set parent(n){
        this._parent = n;
    }



    /**
     * 将自身绘制到指定的绘图上下文当中
     * @param ctx Context2d 绘图上下文
     * @param offsetX Number 从根显示对象一直递归到this的 X轴位移(1比1比例时的位置)
     * @param offsetY Number 从根显示对象一直递归到this的 Y轴位移(1比1比例时的位置)
     * @param offsetScaleX Number 从根显示对象一直递归到this的 横向缩放比例(最终比例)
     * @param offsetScaleY Number 从根显示对象一直递归到this的 纵向缩放比例(最终比例)
     * */
    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
    }

    /**
     * 鼠标检测
     * */
    hitTestPoint(_mouseX,_mouseY){
        return null;
    }
}

/**
 * 色块类
 * */
class GMLShape extends GMLDisplay{
    constructor(){
        super();
        this._fColor = 0;//uint32 类型 填充色RGBA颜色  0xFF6600FF
        this._sColor = 0;//uint32 类型 笔触色RGBA颜色  0xFF6600FF
        this._fColorStr = "#00000000";//颜色的字符串形式
        this._sColorStr = "#00000000";//颜色的字符串形式
    }

    makeShape(_x,_y,_w,_h,_fillColor,_strokeColor){
        this.x = _x;
        this.y = _y;
        this.width = _w;
        this.height = _h;
        this.fColor = _fillColor;
        this.sColor = _strokeColor;
    }

    get fColor(){
        return this._fColor;
    }

    set fColor(uint32Color){
        this._fColor = uint32Color;
        this._fColorStr = GTool.covertUint32toColorStr(uint32Color)
    }

    get sColor(){
        return this._sColor;
    }

    set sColor(uint32Color){
        this._sColor = uint32Color;
        this._sColorStr = GTool.covertUint32toColorStr(uint32Color);
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
       // console.log("内部",offsetX,offsetY)
        //设置绘制的顺序,用于进行鼠标点检测
        this._zIndex = BaseScene.main._currentDrawIndex;
        BaseScene.main._currentDrawIndex++;
        ctx.save();
        this._rectVect = [
            offsetX + this.x * offsetScaleX,
            offsetY + this.y * offsetScaleY,
            this.width * offsetScaleX * this.scaleX,
            this.height * offsetScaleY * this.scaleY
        ];
        //按照内部对其方式进行位置偏移计算
        this._rectVect[0] -= this._rectVect[2] * this._itiwX;
        this._rectVect[1] -= this._rectVect[3] * this._itiwY;
        let quilaty = ScreenManager.main.quilaty;
        //开始绘制
        if(this._fColorStr != "#0")
        {
            //绘制背景
            ctx.fillStyle = this._fColorStr;
            ctx.fillRect(this._rectVect[0]*quilaty,this._rectVect[1]*quilaty,this._rectVect[2]*quilaty,this._rectVect[3]*quilaty);
        }
        if(this._sColorStr != "#0")
        {
            //绘制边框
            ctx.strokeStyle = this._sColorStr;
            ctx.strokeRect(this._rectVect[0]*quilaty,this._rectVect[1]*quilaty,this._rectVect[2]*quilaty,this._rectVect[3]*quilaty);
        }
        ctx.restore();

    }

    /**
     * 鼠标检测
     * */
    hitTestPoint(_mouseX,_mouseY){
        if(_mouseX >= this._rectVect[0] && _mouseX <= this._rectVect[0] + this._rectVect[2] && _mouseY >= this._rectVect[1] && _mouseY <= this._rectVect[1] + this._rectVect[3])
            return this;
        else
            return null;
    }
}

/**
 * 显示对象容器
 * */
class GMLSprite extends GMLDisplay{
    constructor() {
        super();
        this._children = [];//子显示对象数组
        this._contentNode = new GMLShape();
    }

    get itiwX(){
        return this._contentNode.itiwX;
    }

    set itiwX(n){
        super.itiwX = n;
        this._contentNode.itiwX = n;
    }

    get itiwY(){
        return this._contentNode.itiwY;
    }

    set itiwY(n){
        super.itiwY = n;
        this._contentNode.itiwY = n;
    }

    makeShape(_x,_y,_w,_h,_fillColor,_strokeColor){
        this._contentNode.makeShape(_x,_y,_w,_h,_fillColor,_strokeColor);
    }

    /**
     * 获取所有子成员
     * */
    children(){
        return this._children.concat();//将副本return出去,防止外部直接操作 this._children影响可视化对象数组. 外部只应该使用addChild,removeChild来操作显示对象.
    }

    /**
     * 添加可视对象到子可视化对象数组中的最后一位
     * */
    addChild(_child){
        if(_child && _child instanceof GMLDisplay){
            //从原有父级上移除
            if(_child.parent)
            {
                _child.parent.removeChild(_child);
            }

            //将之放置到数组末尾
            this._children.push(_child);
            _child.parent = this;
        }
    }

    /**
     * 添加可视对象到子可视化对象数组中的最后一位
     * */
    addChildAt(_child,idx){
        if(idx < 0 || idx > this._children.length)
            return;
        if(_child && _child instanceof GMLDisplay){
            //从原有父级上移除
            if(_child.parent)
            {
                _child.parent.removeChild(_child);
            }

            if(idx == this._children.length)
            {
                //将之放置到数组末尾
                this._children.push(_child);
            }else{
                //将之插入到数组中的指定索引
                this._children.splice(idx,0,_child);
            }
            _child.parent = this;
        }
    }

    /**
     * 移除一个子对象
     * */
    removeChild(_child){
        let idx = this._children.indexOf(_child);
        if(idx > -1){
            //有相同元素,则移除
            this._children.splice(idx,1)
        }
        _child.parent = null;
    }

    /**
     * 批量移除子对象
     * */
    removeChildren(){
        while(this._children.length){
            let chi = this._children.shift();
            chi.parent = null;
        }
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){

        //设置绘制的顺序,用于进行鼠标点检测
        this._zIndex = BaseScene.main._currentDrawIndex;
        BaseScene.main._currentDrawIndex++;
        let tOffsetX = offsetX + this._x * offsetScaleX;
        let tOffsetY = offsetY + this._y * offsetScaleY;
        let tOffsetScaleX = offsetScaleX * this._scaleX;
        let tOffsetScaleY = offsetScaleY * this._scaleY;
        this._rectVect = [tOffsetX,tOffsetY,this.width * tOffsetScaleX,this.height * tOffsetScaleY]
        //绘制自身
        this._contentNode.drawInContext(ctx,tOffsetX,tOffsetY,tOffsetScaleX,tOffsetScaleY)
        //绘制子对象
        this._children.forEach(function(item,idx){
            //console.log("外部",tOffsetX,tOffsetY)
            item.drawInContext(ctx,tOffsetX,tOffsetY,tOffsetScaleX,tOffsetScaleY)
        });
    }

    /**
     * 鼠标检测
     * */
    hitTestPoint(_mouseX,_mouseY){
        let result = null;
        //先检测子级
        let j = this._children.length;
        //从界面视图的最顶层看是逐层向下检测
        for(let i=j- 1;i>=0;i--)
        {
            let item = this._children[i];
            result = item.hitTestPoint(_mouseX,_mouseY);
            if(result)
                break;//检测到了,就跳出循环
        }

        if(!result)
        {
            //如果子视图未检测到点击,则再检测自己
            if(_mouseX >= this._rectVect[0] && _mouseX <= this._rectVect[0] + this._rectVect[2] && _mouseY >= this._rectVect[1] && _mouseY <= this._rectVect[1] + this._rectVect[3])
                result = this;
            else if(this._contentNode.hitTestPoint(_mouseX,_mouseY)){
                result = this;
            }
        }
        return result;

    }
}


/**
 * 图像类
 * */
class GMLImage extends GMLDisplay{
    /**
     * @param _src 图像地址
     * @param _zhuaquRect 要在原图像上截取图像的区域
     * */
    constructor(_src,_zhuaquRect){
        super();
        this.img = null;
        this.zhuaquRect = [0,0,0,0];//_zhuaquRect ||
        if(_zhuaquRect && _zhuaquRect.constructor === Array && _zhuaquRect.length == 4){
            this.zhuaquRect = _zhuaquRect;
        }
        //加载图像
        ResourceManager.main.getImgByURL(_src,this,this.onImgLoadEnd);
    }
    get scaleX(){
        return super.scaleX;
    }

    set scaleX(n){
        super.scaleX = n;
    }


    get scaleY(){
        return super.scaleY;
    }

    set scaleY(n){
        super.scaleY = n;
    }

    /**
     * 当图像加载完毕所执行的回调处理
     * */
    onImgLoadEnd(_img){
        this.img = _img;
        this.width = this.img.width;
        this.height = this.img.height;
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
        //设置绘制的顺序,用于进行鼠标点检测
        this._zIndex = BaseScene.main._currentDrawIndex;
        BaseScene.main._currentDrawIndex++;
        ctx.save();
        if(this.img)
        {
            //ctx.drawImage()
            //9个参数时  第一个是原图像img,  第2至第5共4个参数是在原图上截取指定区域的图像,  第6至第9共4个参数是将截取好的图像绘制到ctx画布的指定区域并且自动拉伸缩放.
            //3个参数时  第一个是原图像img,  第2至第3共2个参数是将原图像绘制到ctx的指定坐标,宽高为img的原始宽高.
            //5个参数时  第一个是原图像img,  第2至第5共4个参数是将原图像绘制到ctx的区域内,并自动拉伸.
            if(this.zhuaquRect[2] > 0 && this.zhuaquRect[3] > 0)
            {
                this._width = this.zhuaquRect[2];//用截取宽度 代替宽度
                this._height = this.zhuaquRect[3];//用截取高度 代替高度
                this._rectVect = [
                    offsetX + this.x * offsetScaleX,
                    offsetY + this.y * offsetScaleY,
                    this.width * offsetScaleX * this.scaleX,
                    this.height * offsetScaleY * this.scaleY
                ];
                //按照内部对其方式进行位置偏移计算
                this._rectVect[0] -= this._rectVect[2] * this._itiwX;
                this._rectVect[1] -= this._rectVect[3] * this._itiwY;
                //有截取尺寸,则按9参数来绘制
                let quilaty = ScreenManager.main.quilaty;
                ctx.drawImage(this.img,this.zhuaquRect[0],this.zhuaquRect[1],this.zhuaquRect[2],this.zhuaquRect[3],this._rectVect[0] * quilaty,this._rectVect[1] * quilaty,this._rectVect[2] * quilaty,this._rectVect[3] * quilaty);
            }else{
                //没有截取尺寸,则按5参数来绘制
                this._rectVect = [
                    offsetX + this.x * offsetScaleX,
                    offsetY + this.y * offsetScaleY,
                    this.width * offsetScaleX * this.scaleX,
                    this.height * offsetScaleY * this.scaleY
                ];
                //按照内部对其方式进行位置偏移计算
                this._rectVect[0] -= this._rectVect[2] * this._itiwX;
                this._rectVect[1] -= this._rectVect[3] * this._itiwY;
                let quilaty = ScreenManager.main.quilaty;
                ctx.drawImage(this.img,this._rectVect[0] * quilaty,this._rectVect[1] * quilaty,this._rectVect[2] * quilaty,this._rectVect[3] * quilaty);
            }
        }
        ctx.restore();
    }

    /**
     * 鼠标检测
     * */
    hitTestPoint(_mouseX,_mouseY){
        if(_mouseX >= this._rectVect[0] && _mouseX <= this._rectVect[0] + this._rectVect[2] && _mouseY >= this._rectVect[1] && _mouseY <= this._rectVect[1] + this._rectVect[3])
        {
            if(this.img){
                //点击透明像素时,不能算作被点击
                let imgx = (_mouseX - this._rectVect[0]) / this._rectVect[2] * this.img.width;//获取相对于原始图像上的X点
                let imgy = (_mouseY - this._rectVect[1]) / this._rectVect[3] * this.img.height;//获取相对于原始图像上的Y点
                // console.log(_mouseX,this._rectVect[0],this._rectVect[2])
                let resultData = this.img.data.data;//ImageData.data
                //console.log(this.img.data);
                if(this.getAlphaByXY(resultData,imgx,imgy,this.img.width * 4) == 0)
                {
                    //console.log(_mouseX,this._rectVect[0],this._rectVect[2])
                    return null
                }else{
                    return this;
                }

            }else{
                return null
            }
        }
        else{
            return null;
        }

    }

    /**
     * 获取位图上,指定x,y坐标点的alpha值
     * */
    getAlphaByXY(_imgData,_imgX,_imgY,_lineLength){
        let ty = parseInt(_imgY);
        let tx = parseInt(_imgX);
        let tlen = parseInt(_lineLength);
        return _imgData[ty * tlen + tx * 4 + 3];
    }
}

/**
 * 静态文本类
 * */
class GMLStaticTextField extends GMLDisplay{

    constructor(){
        super();
        this._text = "";//文本内容
        this._hAliginment = GMLTextFieldAliginEnum.Left;//文本横向对其方式  默认为左对其
        this._backgroundShape = new GMLShape();//背景
        this._fontColor = 0x000000ff;//笔触颜色
        this._fontColorStr = "#000000ff"
        this._fontSize = 20;//字体大小
        this._fontName = "微软雅黑";//字体名称
        this.isBold = false;//是否为粗体
        this._resultText = [];//最终绘制到画布的文本
        this._isTextChanged = false;//文本是否更改  取决于width, _fontSize,_fontName,_text是否更改
        this._hasBorder = false;//是否有边框
        this._borderColor = 0;//边框默认颜色
        this._hasBackground = false;//是否有背景
        this._backgroundColor = 0;//背景默认颜色
    }
    get hasBorder(){
        return this._hasBorder;
    }

    set hasBorder(b){
        this._hasBorder = !!b;
        if(this._hasBorder && this._borderColor == 0)
            this.borderColor = 0x000000ff;//默认为黑色不透明边框
    }

    get hasBackground(){
        return this._hasBackground;
    }

    set hasBackground(b){
        this._hasBackground = !!b;
        if(this._hasBackground && this._backgroundColor == 0)
            this.backgroundColor = 0xffffffff;//默认为白色不透明背景
    }

    get borderColor(){
        return this._borderColor;
    }

    set borderColor(uint32Color){
        this._borderColor = uint32Color;
        this._backgroundShape.sColor = uint32Color;
    }

    get backgroundColor(){
        return this._backgroundColor;
    }

    set backgroundColor(uint32Color){
        this._backgroundColor = uint32Color;
        this._backgroundShape.fColor = uint32Color;
    }

    get width(){
        return this._width;
    }

    set width(n){
        super.width = n;
        this._isTextChanged = true;
    }
    get fontColor(){
        return this._fontColor;
    }
    set fontColor(uint32Color){
        this._fontColor = uint32Color;
        this._fontColorStr = GTool.covertUint32toColorStr(uint32Color);
    }

    get fontSize(){
        return this._fontSize;
    }

    set fontSize(n){
        this._fontSize = n < 0 ? 0 : n;
        this._isTextChanged = true;
    }

    get fontName(){
        return this._fontName;
    }

    set fontName(str){
        this._fontName = str || "微软雅黑";
        this._isTextChanged = true;
    }

    get text(){
        return this._text;
    }

    set text(str){
        this._text = (str || "").toString();
        this._isTextChanged = true;
    }

    get hAliginment(){
        return this._hAliginment;
    }

    set hAliginment(_enum){
        this._hAliginment = _enum;
    }


    get itiwX(){
        return this._backgroundShape.itiwX;
    }

    set itiwX(n){
        super.itiwX = n;
        this._backgroundShape.itiwX = n;
    }

    get itiwY(){
        return this._backgroundShape.itiwY;
    }

    set itiwY(n){
        super.itiwY = n;
        this._backgroundShape.itiwY = n;
    }

    get width(){
        return super.width;
    }

    set width(n){
        super.width = n;
        this._backgroundShape.width = n;
    }

    get height(){
        return super.height;
    }

    set height(n){
        super.height = n;
        this._backgroundShape.height = n;
    }

    get scaleX(){
        return super.scaleX
    }
    set scaleX(n){
        super.scaleX = n;
        this._isTextChanged = true;
    }
    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
        //设置绘制的顺序,用于进行鼠标点检测
        this._zIndex = BaseScene.main._currentDrawIndex;
        BaseScene.main._currentDrawIndex++;
        ctx.save();
        let tOffsetX = offsetX + this._x * offsetScaleX;
        let tOffsetY = offsetY + this._y * offsetScaleY;
        let tOffsetScaleX = offsetScaleX * this._scaleX;
        let tOffsetScaleY = offsetScaleY * this._scaleY;
        let quilaty = ScreenManager.main.quilaty;
        //设置文本样式
        ctx.textAlign = this._hAliginment;
        ctx.font = (this._fontSize * tOffsetScaleX * quilaty)+ "px " + this._fontName + " " + (this.isBold ? "bold" : "solid");
        ctx.fillStyle = this._fontColorStr;
        if(this._isTextChanged){
            //如果内容有更改,则重新计算_resultText
            this.reCountResultText(ctx);
            this._isTextChanged = false;
        }
        let tempYOffset = 0;
        if(OSManager.OS == "mac")
        {
            tempYOffset += ((this._fontSize + 2) * tOffsetScaleX * quilaty);//mac 系统绘制文本是以最下角为0,0点绘制的,所以需要有一个初始化Y偏移,否则看不到第一行文本.. 2px为行间距
        }
        let lineYOffset = (this._fontSize + 2) * tOffsetScaleX * quilaty;//行高偏移值
        let j = this._resultText.length;
        this.height = (this._fontSize + 4) * j;//根据行数,算出真实文本高度
        //画背景
        this._backgroundShape.drawInContext(ctx,tOffsetX,tOffsetY,tOffsetScaleX,tOffsetScaleY)

        this._rectVect = [tOffsetX,tOffsetY,this.width * tOffsetScaleX,this.height * tOffsetScaleY]
        //按照内部对其方式进行位置偏移计算
        this._rectVect[0] -= this._rectVect[2] * this._itiwX;
        this._rectVect[1] -= this._rectVect[3] * this._itiwY;
        let xJIzhun = this._rectVect[0];//文本对其的绘制基准点
        if(this._hAliginment == GMLTextFieldAliginEnum.Center)
            xJIzhun = this._rectVect[0] + this._rectVect[2]/2;
        else if(this._hAliginment == GMLTextFieldAliginEnum.Right)
            xJIzhun = this._rectVect[0] + this._rectVect[2];
        for(let i=0;i<j;i++){
            //绘制文本
            ctx.fillText(this._resultText[i],xJIzhun*quilaty,this._rectVect[1]*quilaty+tempYOffset+i*lineYOffset);
        }
        ctx.restore();
    }

    /**
     * 鼠标检测
     * */
    hitTestPoint(_mouseX,_mouseY){
        if(_mouseX >= this._rectVect[0] && _mouseX <= this._rectVect[0] + this._rectVect[2] && _mouseY >= this._rectVect[1] && _mouseY <= this._rectVect[1] + this._rectVect[3])
            return this;
        else
            return null;
    }

    reCountResultText(ctx){
        this._resultText = [];
        let str = this._text;
        let lineWidth = 0;
        var lastSubStrIndex= 0;
        let tempCharWidth = 0;
        let maxW = this._width * ScreenManager.main.quilaty * this._scaleX;
        for(let i=0;i<str.length;i++){
            tempCharWidth = ctx.measureText(str[i]).width;
            lineWidth+= tempCharWidth;
            if(lineWidth>maxW || str[i] == "\n"){
                let tempStr = str.substring(lastSubStrIndex,i).replace("\n","");

                this._resultText.push(tempStr);
                lineWidth=tempCharWidth;
                lastSubStrIndex=i;
                continue;//原来是没有这个continue的,是我自己加的
            }
            if(i==str.length-1){
                let tempStr = str.substring(lastSubStrIndex,i+1).replace("\n","");
                this._resultText.push(tempStr);
            }

        }

    }
}

//显示对象类型声明----------------end--------------------------


//事件相关类型声明------------------begin------------------
/**
 * 重载Event
 * */
class BaseEvent extends Event{
    constructor(type,data=null,...eventInitDict){
        super(type,eventInitDict);
        this.data = data;
        this.gCurrentTarget = null;
    }
}

/**
 * 鼠标事件
 * */
class GMLMouseEvent extends BaseEvent{
    static get Click(){
        return "GMLMouseEvent.Click"
    }

    static get RightClick(){
        return "GMLMouseEvent.RightClick"
    }

    static get Down(){
        return "GMLMouseEvent.down"
    }

    static get Up(){
        return "GMLMouseEvent.up"
    }

    static get Move(){
        return "GMLMouseEvent.move"
    }

    static get Over(){
        return "GMLMouseEvent.over"
    }

    static get Out(){
        return "GMLMouseEvent.out"
    }

    static get DoubleClick(){
        return "GMLMouseEvent.doubleclick"
    }

    constructor(type,data=null,...eventInitDict){
        super(type,data,...eventInitDict);
    }
}

/**
 * 键盘事件
 * */
class GMLKeyBoardEvent extends BaseEvent{
    static get KeyDown(){
        return "GMLKeyBoardEvent.KeyDown"
    }

    static get KeyUp(){
        return "GMLKeyBoardEvent.KeyUp"
    }

    constructor(type,data=null,...eventInitDict){
        super(type,data,...eventInitDict);
    }
}
//事件相关类型声明------------------end------------------



//动画相关类型声明------------------begin------------------
/**
 * 时间轴  默认帧频为每秒30帧
 * */
class TimeLine extends BaseObject{

    //静态变量 主动画时间轴
    static get main(){
        if(!window.mainTimeLine)
            window.mainTimeLine = new TimeLine();
        return window.mainTimeLine;
    }

    constructor(){
        super();
        this._frameRate = 30;//帧频
        this._timekuadu = 1000.0/this._frameRate;//帧频跨度, 类内部使用,用于计算是否执行帧频函数
        this._currentTimeStep = 0;
        this._aniID = 0;//动画函数ID
        this._isPause = false;
    }

    get frameRate(){
        return this._frameRate;
    }
    /**
     * 设置帧频
     * */
    set frameRate(n){
        this._frameRate = n < 0 ? 0 : n;
        this._frameRate = this._frameRate > 50 ? 50 : this._frameRate;
        this._timekuadu = 1000.0/this._frameRate;//重新计算帧频跨度
    }

    /**
     * 开始时间轴
     * */
    start(frameFunc){
        this._currentTimeStep = 0;
        TimeLine.main._isPause = false;
        if(frameFunc && typeof(frameFunc) === "function")
        {
            this.frameFunc = frameFunc;
            this._aniID = window.requestAnimationFrame(TimeLine.main.updateTimeLine)
        }
    }

    /**
     * 帧频函数
     * */
    updateTimeLine(timeStep){
        if(!TimeLine.main._isPause)
        {
            //判断是否应该执行具体的帧频函数, 判断条件为为否达到帧频跨度
            if(timeStep - TimeLine.main._currentTimeStep >= TimeLine.main._timekuadu){
                TimeLine.main._currentTimeStep = timeStep;
                TimeLine.main.frameFunc();
            }/*else{
                console.log("判断成功");
            }*/

            //没停止或者暂停,就继续播放下一帧
            TimeLine.main._aniID = window.requestAnimationFrame(TimeLine.main.updateTimeLine)
        }else{
            //停止动画
            window.cancelAnimationFrame(TimeLine.main._aniID);
        }
    }

    /**
     * 停止时间轴
     * */
    stop(){
        TimeLine.main.isPause = true;
    }
}

//动画相关类型声明------------------end------------------


/**
 * 资源加载类
 * */
class ResourceManager extends BaseObject{
    static get main(){
        if(!window.resourceManager)
            window.resourceManager = new ResourceManager();
        return window.resourceManager;
    }
    constructor(){
        super();
        this._imgMap = new Map();
        this._waitLoadimgMap = new Map();
    }

    getImgByURL(url,observer,callBackFunc){
        let tempUrl = url || "";
        if(typeof(callBackFunc) == "function" && observer && tempUrl != ""){
            //判断资源是否存在,存在则直接返回
            if(this._imgMap.has(tempUrl))
            {
                let img = this._imgMap.get(tempUrl);
                callBackFunc.call(observer,img)
            }else{
                if(ResourceManager.main._waitLoadimgMap.has(tempUrl))
                {
                    let tempSet = ResourceManager.main._waitLoadimgMap.get(tempUrl)
                    tempSet.add({"observer":observer,"callBackFunc":callBackFunc});
                    //重复的项不要重复进行img load操作
                    return;
                }else{
                    ResourceManager.main._waitLoadimgMap.set(tempUrl,new Set([{"observer":observer,"callBackFunc":callBackFunc}]))
                }
                //不存在则加载
                let limg = new Image();
                //加载成功的监听
                limg.onload = function(evt){
                    //当图像加载完毕,则遍历ResourceManager.main._waitLoadimgMap集合,向所有注册过这个图像资源的对象执行回调函数.
                    let resultImg = evt.target;
                    //计算resultImg对应的位图数据
                    let tempcanvas = document.createElement("canvas");
                    let tempctx = tempcanvas.getContext("2d");
                    tempctx.drawImage(resultImg,0,0);
                    resultImg.data = tempctx.getImageData(0,0,resultImg.width,resultImg.height);
                    //将图像添加到资源字典
                    ResourceManager.main._imgMap.set(resultImg.imgKey,resultImg);
                    //遍历集合
                    let tSet = ResourceManager.main._waitLoadimgMap.get(resultImg.imgKey)
                    tSet.forEach(function(value,key){
                        let obs = value["observer"];
                        let cb = value["callBackFunc"];
                        cb.call(obs,resultImg);//执行回调
                        delete value["observer"];
                        delete value["callBackFunc"]
                    })
                    tSet.clear();
                    ResourceManager.main._waitLoadimgMap.delete(resultImg.imgKey)
                }
                //加载失败的监听
                limg.onerror = function(evt){
                    //图像加载失败,执行一系列的释放操作
                    let resultImg = evt.target;
                    //遍历集合
                    let tSet = ResourceManager.main._waitLoadimgMap.get(resultImg.imgKey)
                    tSet.forEach(function(value,key){
                        delete value["observer"];
                        delete value["callBackFunc"]
                    })
                    tSet.clear();
                    ResourceManager.main._waitLoadimgMap.delete(resultImg.imgKey)
                }

                limg.src = tempUrl;
                limg.imgKey = tempUrl;
            }
        }
    }
}

/**
 * 工具类
 * */
class GTool{

    static covertUint32toColorStr(uint32Color){
        ////精确写法
        ////之所以不这么写是因为按位运算uint32会丢精度,以下计算模拟按位运算
        //let r = parseInt(uint32Color / 0xffffff);
        //r = r < 0 ? 0 : r;
        //r = r > 255 ? 255 : r;
        //let g = (uint32Color & 0x00ff0000) >> 16;
        //let b = (uint32Color & 0x0000ff00) >> 8;
        //let a = uint32Color & 0x000000ff;
        //let result = "#"
        //result = result + (r < 0x1f ? "0" + r.toString(16): r.toString(16));
        //result = result + (g < 0x1f ? "0" + g.toString(16) : g.toString(16));
        //result = result + (b < 0x1f ? "0" + b.toString(16) : b.toString(16));
        //result = result + (a < 0x1f ? "0" + r.toString(16) : a.toString(16));
        //return result;

        //简易写法
        let tempResult = uint32Color.toString(16);
        while(tempResult.length < 8){
            tempResult = "0" + tempResult;
        }
        return "#" + tempResult;
    }
}

/**
 * 系统管理类
 * */
class OSManager{
    static get OS(){
        return "mac";
    }
    constructor(){

    }
}

/*
 * 屏幕管理类
 * **/
class ScreenManager{
    static get main(){
        if(!window.gmlscreen)
            window.gmlscreen = new ScreenManager();
        return window.gmlscreen;
    }

    constructor(){
        this._quilaty = 1;//清晰度, 默认为1倍(对应1倍屏幕)   .如果为2则对应2倍屏幕.最多支持8倍
    }

    get quilaty(){
        return this._quilaty
    }

    set quilaty(n){
        this._quilaty = n < 0 ? 0 : n;
        this._quilaty = this._quilaty > 8 ? 8 : this._quilaty;
        //每次清晰度修改,都会更新一系列相关设置
        document.body.style.zoom = 1.0 / this._quilaty;
        window.dispatchEvent(new Event("resize"));
    }
}
