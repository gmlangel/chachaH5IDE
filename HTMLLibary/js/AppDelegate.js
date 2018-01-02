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
    }

    startSelf(){
        this.selfMonster = new Monster(this.nickName,this.selfSourcePath,this.selfKey);
        this.selfMonster.x = this.scene.width / 2;
        this.selfMonster.y = this.scene.height / 2;
        this.scene.addChild(this.selfMonster);
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
