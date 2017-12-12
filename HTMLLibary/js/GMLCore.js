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
class GMLDisplay extends BaseEventDispatcher{
    constructor(){
        super();
        this._argChanged = false;//属性是否变更过

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
        this._rootParent = null;//根容器显示对象的引用
        this._children = [];//子显示对象数组
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

