/**
 * Created by guominglong on 2018/1/2.
 */

/**
 * 怪物类
 * */
class Monster extends GMLSprite{

    constructor(_nickName,_resourcePath,_conKey){
        super();
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

    changeAniType(aniType,fangxiangX,fangxiangY){
        if(this._defaultAniType != aniType)
        {
            this.fangxiangX = fangxiangX;
            this.fangxiangY = fangxiangY;
            this._defaultAniType = aniType;
            this._currentAniIdx = 0
            this._currentAniArr = this._configDic[this._defaultAniType] || [];//动画数组
            this._sumAniCount = this._currentAniArr.length;//总动画帧数
            if(this._sumAniCount == 0){
                return;
            }
            this.updateImg();
        }

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

        if(this._currentAniIdx < this._sumAniCount - 1){
            this._currentAniIdx++;
        }else{
            this._currentAniIdx = 0;
        }
        console.log(this._sumAniCount,this._currentAniIdx,this._currentAniIdx < this._sumAniCount - 1);
        this.updateImg();
        this.x += this.fangxiangX * this.offsetPX;//每帧横向移动1px
        this.y += this.fangxiangY * this.offsetPX;//每帧纵向移动1px
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