/**
 * app主入口
 * Created by guominglong on 2017/12/13.
 */
class AppDelegate{
    static get app(){
        if(!window.app)
            window.app = new AppDelegate();
        return window.app;
    }

    constructor(){
        this.scene = BaseScene.main;
        this.monsterArr = ["./resource/girl1/"];
        this.selfSourcePath = "";//自身形象对应的资源路径
        this.selfKey = "";//自身形象对应的配置文件key
        this.keyMoveX = 0;
        this.keyMoveY = 0;
        this.fangxiangDic={
            "0,0":AniTypeEnum.default,
            "0,-1":AniTypeEnum.top,
            "1,-1":AniTypeEnum.rightTop,
            "1,0":AniTypeEnum.right,
            "1,1":AniTypeEnum.rightBottom,
            "0,1":AniTypeEnum.bottom,
            "-1,1":AniTypeEnum.leftBottom,
            "-1,0":AniTypeEnum.left,
            "-1,-1":AniTypeEnum.leftTop
        }
    }

    /**
     * 启动
     * */
    init(){
        //设置清晰度为2倍屏
        ScreenManager.main.quilaty = 2;


    }

    /**
     * 开始游戏
     * */
    beginGame(_nickName){
        this.nickName = _nickName.length > 7 ? _nickName.substr(0,7) : _nickName;
        //启动场景
        this.scene.start();

        //加载所有的资源配置文件
        let j = this.monsterArr.length;
        let offset = 0;
        if(j <= 0){
            return;
        }
        this.selfSourcePath = this.monsterArr[this.nickName.length % j];
        this.monsterArr.forEach(function(item,idx){
            let conPath = item + "con.json";
            $.ajax({
                "pathKey":item,
                "url":conPath,
                "type":"POST",
                "timeout":30,
                "success":function(data){
                    if(this.pathKey == AppDelegate.app.selfSourcePath){
                        AppDelegate.app.selfKey = data.name;
                    }
                    ConfigManager.main.configDic[data.name] = data
                    offset++;
                    if(offset == j){
                        //生成小怪物
                        //构建自身的游戏形象,并开始游戏的正常流程
                        AppDelegate.app.startSelf();
                    }
                },
                "error":function(evt){
                    console.log(evt)
                    offset++;
                    if(offset == j){
                        //生成小怪物
                        //构建自身的游戏形象,并开始游戏的正常流程
                        AppDelegate.app.startSelf();
                    }
                }
            })
        })

        //添加时间监听
        BaseNotificationCenter.main.addObserver(this,GMLKeyBoardEvent.KeyDown,this.ongKeyDown);
        BaseNotificationCenter.main.addObserver(this,GMLKeyBoardEvent.KeyUp,this.ongKeyUp);
    }

    startSelf(){
        this.selfMonster = new Monster(this.nickName,this.selfSourcePath,this.selfKey);
        this.selfMonster.x = this.scene.width / 2;
        this.selfMonster.y = this.scene.height / 2;
        this.scene.addChild(this.selfMonster);
    }

    ongKeyDown(e){
        let kc = e.data.keyCode;
        switch(kc){
            case 40:this.keyMoveY = 1;this.updateSelfMonster();break;
            case 38:this.keyMoveY = -1;this.updateSelfMonster();break;
            case 37:this.keyMoveX = -1;this.updateSelfMonster();break;
            case 39:this.keyMoveX = 1;this.updateSelfMonster();break;
            case 83:this.keyMoveY = 1;this.updateSelfMonster();break;
            case 87:this.keyMoveY = -1;this.updateSelfMonster();break;
            case 65:this.keyMoveX = -1;this.updateSelfMonster();break;
            case 68:this.keyMoveX = 1;this.updateSelfMonster();break;
        }

    }

    ongKeyUp(e){
        let kc = e.data.keyCode;
        switch(kc){
            case 40:this.keyMoveY = 0;this.updateSelfMonster();break;
            case 38:this.keyMoveY = 0;this.updateSelfMonster();break;
            case 37:this.keyMoveX = 0;this.updateSelfMonster();break;
            case 39:this.keyMoveX = 0;this.updateSelfMonster();break;
            case 83:this.keyMoveY = 0;this.updateSelfMonster();break;
            case 87:this.keyMoveY = 0;this.updateSelfMonster();break;
            case 65:this.keyMoveX = 0;this.updateSelfMonster();break;
            case 68:this.keyMoveX = 0;this.updateSelfMonster();break;
        }
    }

    /**
     * 更新自身怪物动画
     * */
    updateSelfMonster(){
        let key = this.keyMoveX + "," + this.keyMoveY;
        if(this.selfMonster)
        {
            this.selfMonster.changeAniType(this.fangxiangDic[key],this.keyMoveX,this.keyMoveY)
        }
    }


    /**
     * 尺寸变更
     * */
    resize(w,h){
        BaseScene.main.resize(w,h)
    }

    /**
     * 停止
     * */
    stop(){
        BaseScene.main.stop();
    }
}
