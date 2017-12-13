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
                if(value == execFunc)evtSet.delete(value)
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
        this._width = n < 0 ? 0 : n;
        this.canvas.width = this._width + "";
    }
    get height(){
        return this._height;
    }
    set height(n){
        this._height = n < 0 ? 0 : n;
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


        this._parent = null;//父容器显示对象的引用
        //this._rootParent = null;//根容器显示对象的引用   之所以注释掉,是因为感觉没什么用

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
        this._alpha = n > 1 ? 1 : n;
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

}
/**
 * 色块类
 * */
class GMLShape extends GMLDisplay{
    constructor(){
        super();
        this._fColor = 0;//填充色RGBA颜色  #FF6600FF
        this._sColor = 0;//笔触色RGBA颜色  #FF6600FF
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

    set fColor(color){
        this._fColor = color;
    }

    get sColor(){
        return this._sColor;
    }

    set sColor(color){
        this._sColor = color;
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
        ctx.strokeStyle = this.sColor;
        ctx.fillStyle = this.fColor;
        ctx.fillRect((offsetX + this.x) * offsetScaleX,(offsetY + this.y) * offsetScaleY,this.width * offsetScaleX * this.scaleX,this.height * offsetScaleY * this.scaleY);
        ctx.strokeRect((offsetX + this.x) * offsetScaleX,(offsetY + this.y) * offsetScaleY,this.width * offsetScaleX * this.scaleX,this.height * offsetScaleY * this.scaleY);
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

    set width(n){
        super.width = n;
        this._contentNode.width = this._width;
    }

    get width(){
        return super.width;
    }


    set height(n){
        super.height = n;
        this._contentNode.height = this._height;
    }

    get height(){
        return super.height;
    }


    //set scaleX(n){
    //    super.scaleX = n;
    //    this._contentNode.scaleX = this._scaleX;
    //}
    //
    //get scaleX(){
    //    return super.scaleX;
    //}
    //
    //
    //set scaleY(n){
    //    super.scaleY = n;
    //    this._contentNode.scaleY = this._scaleY;
    //}
    //
    //get scaleY(){
    //    return super.scaleY;
    //}

    //set x(n){
    //    super.x = n;
    //    this._contentNode.x = this._x;
    //}
    //
    ////必须成对  重新,  否则会被看做undefined
    //get x(){
    //    return super.x;
    //}
    //
    //set y(n){
    //    super.y = n;
    //    this._contentNode.y = this._y;
    //}
    //
    ////必须成对  重新,  否则会被看做undefined
    //get y(){
    //    return super.y;
    //}

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
            let idx = this._children.indexOf(_child);
            if(idx > -1){
                //有相同元素,则先移除
                this._children.splice(idx,1)
            }
            //将之放置到数组末尾
            this._children.push(_child);
        }
    }

    /**
     * 添加可视对象到子可视化对象数组中的最后一位
     * */
    addChildAt(_child,idx){
        if(idx < 0 || idx > this._children.length)
            return;
        if(_child && _child instanceof GMLDisplay){
            let idx = this._children.indexOf(_child);
            if(idx > -1){
                //有相同元素,则先移除
                this._children.splice(idx,1)
            }
            if(idx == this._children.length)
            {
                //将之放置到数组末尾
                this._children.push(_child);
            }else{
                //将之插入到数组中的指定索引
                this._children.splice(idx,0,_child);
            }
        }
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){

        let tOffsetX = offsetX + this._x;
        let tOffsetY = offsetY + this._y;
        let tOffsetScaleX = offsetScaleX * this._scaleX;
        let tOffsetScaleY = offsetScaleY * this._scaleY;
        //绘制自身
        this._contentNode.drawInContext(ctx,tOffsetX,tOffsetX,tOffsetScaleX,tOffsetScaleY)
        //绘制子对象
        this._children.forEach(function(item,idx){
            item.drawInContext(ctx,tOffsetX,tOffsetY,tOffsetScaleX,tOffsetScaleY)
        });
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

