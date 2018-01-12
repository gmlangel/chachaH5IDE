/**
 * Created by guominglong on 2018/1/2.
 */

/**
 * 怪物类
 * */
class Monster extends GMLSprite{

    constructor(_nickName,_resourcePath,_conKey){
        super();
        this.waitMovePointArr = [];//等待移动路径
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
        this.waitMovePointArr = [];
        this._toMove(_toX,_toY);
    }

    _toMove(_toX,_toY){
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

    /**
     * 根据路线轨迹移动
     * */
    toMoveByPath(pathArr){
        this.waitMovePointArr = pathArr;
        if(this.waitMovePointArr.length <= 0)
            return;
        this.waitMovePointArr.push(this.waitMovePointArr[this.waitMovePointArr.length-1])//创造两个相同的终点,以便人物动画恢复默认状态
        let currentP = this.waitMovePointArr.shift();
        this._toMove(currentP.x,currentP.y);
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

        if(!this.hasEndPoint && this.waitMovePointArr.length > 0)
        {
            let currentP = this.waitMovePointArr.shift();
            this._toMove(currentP.x,currentP.y);
        }
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


/**
 * A星寻路算法
 * */
class AStar extends BaseObject{
    static get main(){
        if(!window.gmlaSTAR)
            window.gmlaSTAR = new AStar();
        return window.gmlaSTAR;
    }
    constructor(){
        super();
        this.o = 10;//每隔多少像素,计算一次. 如果为1的话,计算时间特别长,浏览器会卡死
    }

    /**
     * 障碍物图像数据检索路径
     * */
    searchRoadByImgData(start_x,start_y,end_x,end_y,_img){
        let data = _img.data.data;
        let imgW = _img.width*4
        if(this._getColorByXY(data,end_x,end_y,imgW,0) == 0){
            //如果终点不可到达,则生成一条起点到离终点最近点的 路径
            return [];
        }
        let toff = this.o;
        start_x = parseInt(start_x/toff)*toff;
        start_y = parseInt(start_y/toff)*toff;
        end_x = parseInt(end_x/toff)*toff;
        end_y = parseInt(end_y/toff)*toff;
        var openList=[],    //开启列表
            closeList=[],   //关闭列表
            result=[],      //结果数组
            result_index;   //结果数组在开启列表中的序号

        openList.push({x:start_x,y:start_y,G:0});//把当前点加入到开启列表中，并且G是0

        do{
            //当openlist中没有值了,或者openlist中,有{x:end_x,y:end_y}则退出循环
            var currentPoint = openList.pop();
            closeList.push(currentPoint);
            var surroundPoint=this._SurroundPoint(currentPoint);
            for(var i in surroundPoint) {
                var item = surroundPoint[i];                //获得周围的八个点
                if (
                    this._getColorByXY(data,item.x,item.y,imgW,0) > 1 &&         //判断是否是障碍物
                    !this._existList(item, closeList) &&          //判断是否在关闭列表中
                    this._getColorByXY(data,item.x,currentPoint.y,imgW,0) > 1 &&   //判断之间是否有障碍物，如果有障碍物是过不去的
                    this._getColorByXY(data,currentPoint.x,item.y,imgW,0) > 1) {
                    //g 到父节点的位置
                    //如果是上下左右位置的则g等于10，斜对角的就是14
                    var g = currentPoint.G + ((currentPoint.x - item.x) * (currentPoint.y - item.y) == 0 ? 10 : 14);
                    if (!this._existList(item, openList)) {       //如果不在开启列表中
                        //计算H，通过水平和垂直距离进行确定
                        item['H'] = Math.abs(end_x - item.x) * 10 + Math.abs(end_y - item.y) * 10;
                        item['G'] = g;
                        item['F'] = item.H + item.G;
                        item['parent'] = currentPoint;
                        openList.push(item);
                    }
                    else {                                  //存在在开启列表中，比较目前的g值和之前的g的大小
                        var index = this._existList(item, openList);
                        //如果当前点的g更小
                        if (g < openList[index].G) {
                            openList[index].parent = currentPoint;
                            openList[index].G = g;
                            openList[index].F=g+openList[index].H;
                        }

                    }
                }
            }
            //如果开启列表空了，没有通路，结果为空
            if(openList.length==0) {
                break;
            }
            openList.sort(this._sortF);//这一步是为了循环回去的时候，找出 F 值最小的, 将它从 "开启列表" 中移掉

        }while(!(result_index=this._existList({x:end_x,y:end_y},openList)));

        //判断结果列表是否为空
        if(!result_index) {
            result=[];
        }
        else {
            var currentObj=openList[result_index];
            do{
                //把路劲节点添加到result当中
                result.unshift({
                    x:currentObj.x,
                    y:currentObj.y
                });
                currentObj=currentObj.parent;
            }while (currentObj.x!=start_x || currentObj.y!=start_y);

        }
        return result;

    }

    //用F值对数组排序
    _sortF(a,b){
        return b.F- a.F;
    }

    //获取周围八个点的值
    _SurroundPoint(curPoint){
        var x=curPoint.x,y=curPoint.y;
        let toff = this.o;
        return [
            {x:x-toff,y:y-toff},
            {x:x,y:y-toff},
            {x:x+toff,y:y-toff},
            {x:x+toff,y:y},
            {x:x+toff,y:y+toff},
            {x:x,y:y+toff},
            {x:x-toff,y:y+toff},
            {x:x-toff,y:y}
        ]
    }
    //判断点是否存在在列表中，是的话返回的是序列号
    _existList(point,list) {
        for(var i in list) {
            if(point.x==list[i].x && point.y==list[i].y) {
                return i;
            }
        }
        return false;
    }

    /**
     * 获取位图上,指定x,y坐标点ARGB中的一个色值,比如取50,50坐标点的红色色值
     * @param _imgData位图数据  ImageData.Data
     * @param _imgX X坐标
     * @param _imgY Y坐标
     * @param _lineLength   指_imgData位图宽度
     * @param _offset 0可以取R值, 1可以取G值,2可以去B值,3可以去Alpha值
     * */
    _getColorByXY(_imgData,_imgX,_imgY,_lineLength,_offset){
        let ty = parseInt(_imgY);
        let tx = parseInt(_imgX);
        let tlen = parseInt(_lineLength);
        return _imgData[ty * tlen + tx * 4 + _offset] || 0;
    }
}