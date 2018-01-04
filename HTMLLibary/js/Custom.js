/**
 * Created by guominglong on 2018/1/2.
 */

/**
 * 怪物类
 * */
class Monster extends GMLSprite{

    constructor(_nickName,_resourcePath,_conKey){
        super();
        this.hasEndPoint = false;//是否有终点
        this.endPointX = 0;//终点坐标
        this.endPointY = 0;//终点坐标
        this.offsetPX = 3;//每帧位移的像素,默认为2px
        this._frames = [];//序列帧数组,每个元素都是GMLImage.
        this._nickName = _nickName;
        this._resourcePath = _resourcePath;


        let tb = new GMLStaticTextField();
        tb.hAliginment = "center";
        tb.width = 200;
        tb.height = 12;
        tb.fontColor = 0xff0000ff;
        tb.fontName = "微软雅黑";
        tb.fontSize = 12;
        tb.text = this._nickName;
        this.tb_nickName = tb;
        this.addChild(this.tb_nickName);

        this._configDic = ConfigManager.main.configDic[_conKey] || {};//动画完整配置
        tb.itiwX = this.itiwX = parseFloat(this._configDic["itiwX"] || 0)
        tb.itiwY = this.itiwY = parseFloat(this._configDic["itiwY"] || 0)

        this.changeAniType(AniTypeEnum.default,0,0)
    }

    /**
     * 匀速按照指定方向移动
     * */
    changeAniType(aniType,fangxiangX,fangxiangY){
        this.fangxiangX = fangxiangX;
        this.fangxiangY = fangxiangY;
        if(this._defaultAniType != aniType) {
            this._defaultAniType = aniType;
            this._currentAniIdx = 0
            this._currentAniArr = this._configDic[this._defaultAniType] || [];//动画数组
            this._sumAniCount = this._currentAniArr.length;//总动画帧数
            if (this._sumAniCount == 0) {
                return;
            }
            this.updateImg();
        }
    }

    /**
     * 匀速移动到指定位置
     * */
    toEndPoint(_toX,_toY){
        this.hasEndPoint = true;
        this.endPointX = _toX;
        this.endPointY = _toY;
        let mx =  _toX - this.x
        if(mx > 0)
            mx = 1;
        else if(mx < 0)
            mx = -1
        let my =  _toY - this.y
        if(my > 0)
            my = 1;
        else if(my < 0)
            my = -1
        let tttkey = mx + "," + my;
        this.changeAniType(AppDelegate.app.fangxiangDic[tttkey],mx,my);
    }

    get itiwX(){
        return super.itiwX;
    }

    set itiwX(n){
        super.itiwX = n;
    }

    get itiwY(){
        return super.itiwY;
    }

    set itiwY(n){
        super.itiwY = n;
    }

    drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY){
        if(this.hasEndPoint){
            //判断当前位置是否已经接近 要去的终点如果已经接近,则不移动
            if(Math.abs(this.x - this.endPointX) <= this.offsetPX && Math.abs(this.y - this.endPointY) <= this.offsetPX){
                this.x = this.endPointX;
                this.y = this.endPointY;
                //this.changeAniType(AniTypeEnum.default,0,0);之所以不用这行代码,是因为图像会反复闪烁
                this.fangxiangX = 0;
                this.fangxiangY = 0;
                this.hasEndPoint = false;
            }
        }
        if(this._currentAniIdx < this._sumAniCount - 1){
            this._currentAniIdx++;
        }else{
            this._currentAniIdx = 0;
        }
        //console.log(this._sumAniCount,this._currentAniIdx,this._currentAniIdx < this._sumAniCount - 1);
        this.updateImg();
        if(this.hasEndPoint == false || Math.abs(this.x - this.endPointX) > this.offsetPX)
            this.x += this.fangxiangX * this.offsetPX;//每帧横向移动offsetPX
        if(this.hasEndPoint == false || Math.abs(this.y - this.endPointY) > this.offsetPX)
            this.y += this.fangxiangY * this.offsetPX;//每帧纵向移动offsetPX
        super.drawInContext(ctx,offsetX,offsetY,offsetScaleX,offsetScaleY);
    }

    updateImg(){

        if(this._currentImg)
            this.removeChild(this._currentImg);
        let img = new GMLImage(this._resourcePath + this._currentAniArr[this._currentAniIdx])
        img.itiwX = this.itiwX;
        img.itiwY = this.itiwY;
        this.tb_nickName.y = -(img.height * img.itiwY);
        this._currentImg = img;
        this.addChildAt(this._currentImg,0);
    }

    /**
     * 加载资源
     * */
    loadResource(sourcePath){

    }

    /**
     * 深度拷贝,免除loadResource带来的配置文件分析和资源加载的开销
     * */
    copy(){

    }
}

/**
 * 配置文件管理器
 * */
class ConfigManager extends BaseObject{
    constructor(){
        super();
        this.configDic = {};//用于存储所有的配置文件
    }
    static get main(){
        if(!window.conManager)
        {
            window.conManager = new ConfigManager();
        }
        return window.conManager
    }
}

/**
 * 怪物动画类型
 * */
class AniTypeEnum{
    static get default(){
        return "ani_default";
    }

    static get left(){
        return "ani_move_left";
    }
    static get right(){
        return "ani_move_right";
    }
    static get top(){
        return "ani_move_top";
    }
    static get bottom(){
        return "ani_move_bottom";
    }
    static get leftTop(){
        return "ani_move_left_top";
    }
    static get rightTop(){
        return "ani_move_right_top";
    }
    static get leftBottom(){
        return "ani_move_left_bottom";
    }
    static get rightBottom(){
        return "ani_move_right_bottom";
    }
}

/**
 * WebSocket管理
 * */
/**
 * 一个websocket实例
 * */
class WebSocketHandler extends BaseEventDispatcher{

    /**
     * 初始化
     * @param url  websocket的地址如'ws://html5rocks.websocket.org/echo'
     * @param protocols 可选值,用于约束websocket的子协议如:soap,xmpp等等
     * @param responseType 设置接受的返回值的类型  可选为string  blob  arraybuffer
     * */
    constructor(url,protocols,responseType = 'arraybuffer'){
        super();
        if(url){
            //根据不同参数,创建不同的webSocket对象
            if(protocols.length > 0)
                this.ws = new WebSocket(url,protocols)
            else
                this.ws = new WebSocket(url);
            //this.ws.binaryType = responseType;
            this.ws.onclose = this.ongClose;
            this.ws.onopen = this.ongOpen;
            this.ws.onmessage = this.ongmessage;
            this.ws.onerror = this.ongError;
            this.ws.delegate = this;
        }else{
            throw new Error("websocket的链接地址不能为空")
        }
        this.isOpen = false;//socket是否链接成功
    }

    ongClose(evt){
        //这个地方不用this,是因为this指代websocket.这个问题很奇怪
        evt.currentTarget.delegate.isOpen = false;
        evt.currentTarget.delegate.dispatchEvent(new WebSocketEvent(WebSocketEvent.SOCKET_CLOSE,evt))
    }

    ongOpen(evt){
        //这个地方不用this,是因为this指代websocket.这个问题很奇怪
        evt.currentTarget.delegate.isOpen = true;
        evt.currentTarget.delegate.dispatchEvent(new WebSocketEvent(WebSocketEvent.SOCKET_CONNECTED))
    }

    ongmessage(evt){
        //这个地方不用this,是因为this指代websocket.这个问题很奇怪
        evt.currentTarget.delegate.dispatchEvent(new WebSocketEvent(WebSocketEvent.SOCKET_DATA,evt.data))
    }

    ongError(evt){
        //这个地方不用this,是因为this指代websocket.这个问题很奇怪
        evt.currentTarget.delegate.dispatchEvent(new WebSocketEvent(WebSocketEvent.SOCKET_ERROR))
    }

    /**
     * 向服务器发送数据
     * @param data 可以为String,ArrayBuffer,ArrayBufferView,Blob
     * */
    sendData(data){
        if(this.isOpen)
            this.ws.send(data);
    }

    /**
     * 关闭socket
     * */
    close(code = WebSocketHandler.CustomCloseCode,reason = WebSocketHandler.CustomCloseReason){
        this.ws.close(code,reason)
    }

    destroy(){
        super.destroy()
        this.ws.delegate = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.onopen = null;
    }
}
/**
 * 定义用户主动发起关闭时的状态码
 * */
WebSocketHandler.CustomCloseCode = "19870309";
WebSocketHandler.CustomCloseReason = "用户主动关闭socket";

/**
 * 自定义的websocket相关事件
 * */
class WebSocketEvent extends BaseEvent{

}
//当socket关闭
WebSocketEvent.SOCKET_CLOSE = "WebSocketEvent.socket.close";
//当socket发生错误
WebSocketEvent.SOCKET_ERROR = "WebSocketEvent.socket.error";
//当socket有数据过来
WebSocketEvent.SOCKET_DATA = "WebSocketEvent.socket.data";
//当socket链接成功
WebSocketEvent.SOCKET_CONNECTED = "WebSocketEvent.socket.connected";