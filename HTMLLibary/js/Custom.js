/**
 * Created by guominglong on 2018/1/2.
 */

/**
 * 怪物类
 * */
class Monster extends GMLSprite{

    constructor(_nickName,_resourcePath,_conKey){
        super();
        this._frames = [];//序列帧数组,每个元素都是GMLImage.
        this._nickName = _nickName;
        this._resourcePath = _resourcePath;
        this._conKey = _conKey;
        this._defaultAniType = AniTypeEnum.default;

        let tb = new GMLStaticTextField();
        tb.width = 200;
        tb.height = 20;
        tb.fontColor = 0xff6600ff;
        tb.fontName = "微软雅黑";
        tb.fontSize = 12;
        tb.text = this._nickName;
        this.tb_nickName = tb;
        this.addChild(this.tb_nickName);
    }

    get itiwX(){
        return super.itiwX;
    }

    set itiwX(n){
        super.itiwX = n;
        //遍历序列帧数组
        this._frames.forEach(function(item,idx){
            item.itiwX = this._itiwX;
        })
    }

    get itiwY(){
        return super.itiwY;
    }

    set itiwY(n){
        super.itiwY = n;
        //遍历序列帧数组
        this._frames.forEach(function(item,idx){
            item.itiwY = this._itiwY;
        })
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