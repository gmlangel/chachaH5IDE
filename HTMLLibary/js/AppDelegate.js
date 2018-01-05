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
        //初始化背景音
        this.bgAudio = new GMLAudio();
        this.bgAudio.preload = true;
        this.bgAudio.src = "./resource/bg.mp3"


        console.log(this.bgAudio);
       // document.body.appendChild(this.bgAudio);
        //初始化场景
        this.scene = BaseScene.main;
        this.container = new GMLSprite();//地图和monster的容器
        this.scene.addChild(this.container);
        this.bg = null;//背景
        this.allMonster = []
        this.monsterArr = ["./resource/girl1/","./resource/girl2/","./resource/boy1/","./resource/boy2/"];
        this.monsterConfigYingShe = {};//资源路径和key的映射
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
        if(OSManager.OS == "IOS")
        {
            window.addEventListener("touchstart",function(evt){
                if(evt.targetTouches.length >0 && AppDelegate.app.selfMonster){
                    //方向盘方式
                    let globelx = AppDelegate.app.selfMonster.x + AppDelegate.app.container.x
                    let globely = AppDelegate.app.selfMonster.y + AppDelegate.app.container.y
                    let t = evt.targetTouches[0];
                    globelx = t.pageX - globelx;
                    globely = t.pageY - globely;
                    let jiaodu = Math.atan2(globely,globelx);
                    jiaodu = jiaodu / Math.PI * 180;
                    jiaodu = jiaodu < 0 ? 360 + jiaodu : jiaodu;
                    console.log(jiaodu);
                    if(jiaodu > 22.5 && jiaodu <= 67.5)
                    {
                        //右下
                        AppDelegate.app.keyMoveX = 1;
                        AppDelegate.app.keyMoveY = 1;
                        AppDelegate.app.updateSelfMonster();
                    }else if(jiaodu > 67.5 && jiaodu <= 112.5){
                        //下
                        AppDelegate.app.keyMoveX = 0;
                        AppDelegate.app.keyMoveY = 1;
                        AppDelegate.app.updateSelfMonster();
                    }else if(jiaodu > 112.5 && jiaodu < 157.5){
                        //左下
                        AppDelegate.app.keyMoveX = -1;
                        AppDelegate.app.keyMoveY = 1;
                        AppDelegate.app.updateSelfMonster();
                    }
                    else if(jiaodu > 157.5 && jiaodu < 202.5){
                        //左
                        AppDelegate.app.keyMoveX = -1;
                        AppDelegate.app.keyMoveY = 0;
                        AppDelegate.app.updateSelfMonster();
                    }else if(jiaodu > 202.5 && jiaodu < 247.5){
                        //左上
                        AppDelegate.app.keyMoveX = -1;
                        AppDelegate.app.keyMoveY = -1;
                        AppDelegate.app.updateSelfMonster();
                    }else if(jiaodu > 247.5 && jiaodu < 292.5){
                        //上
                        AppDelegate.app.keyMoveX = 0;
                        AppDelegate.app.keyMoveY = -1;
                        AppDelegate.app.updateSelfMonster();
                    }else if(jiaodu > 292.5 && jiaodu < 337.5){
                        //右上
                        AppDelegate.app.keyMoveX = 1;
                        AppDelegate.app.keyMoveY = -1;
                        AppDelegate.app.updateSelfMonster();
                    }else{
                        //右
                        AppDelegate.app.keyMoveX = 1;
                        AppDelegate.app.keyMoveY = 0;
                        AppDelegate.app.updateSelfMonster();
                    }

                    ////点击位移方式
                    //let t = evt.targetTouches[0];
                    //let localX = -AppDelegate.app.container.x + t.pageX;
                    //let localY = -AppDelegate.app.container.y + t.pageY;
                    //AppDelegate.app.selfMonster.toEndPoint(localX,localY)
                }
            })
            window.addEventListener("touchend",function(evt){
                //方向盘方式
                AppDelegate.app.keyMoveX = 0;
                AppDelegate.app.keyMoveY = 0;
                AppDelegate.app.updateSelfMonster();

            })
        }

        this.nickName = _nickName.length > 7 ? _nickName.substr(0,7) : _nickName;
        //启动场景
        this.scene.start();
        this.bgAudio.play();
        this.bgAudio.loop = true;
        //添加背景
        this.bg = new GMLImage("./resource/bg.jpg",[0,0,this.scene.width,this.scene.height]);
        this.scene.addChildAt(this.bg,0);
        //链接socket
        this.ws = new WebSocketHandler("ws://39.106.135.11:31111",[])
        this.ws.addEventListener(WebSocketEvent.SOCKET_CLOSE,this.onSocketClose,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_DATA,this.onSocketData,this);
        this.ws.addEventListener(WebSocketEvent.SOCKET_ERROR,this.onSocketError,this)
        this.ws.addEventListener(WebSocketEvent.SOCKET_CONNECTED,this.onSocketConnected,this)

        setInterval(function(){
            if(AppDelegate.app.selfMonster && AppDelegate.app.ws.isOpen){
                let req = {"cmd":0x00FF101E,"seq":0,"uid":AppDelegate.app.selfMonster.uid,"ca":{x:AppDelegate.app.selfMonster.x,y:AppDelegate.app.selfMonster.y}}
                AppDelegate.app.ws.sendData(JSON.stringify(req))
            }
        },30)
    }
    onSocketClose(e){
        console.log("socket断开")
    }
    onSocketData(e){
        this.jiexiData(e.data);
    }

    onSocketError(e){
        console.log("socket发生错误");
    }

    onSocketConnected(e){
        //开始登陆
        let req = {"cmd":0x00FF0003,"seq":0,"ln":this.nickName};
        this.ws.sendData(JSON.stringify(req));
    }

    /**
     *
     * 正式开始*/
    _trueBegin(){
        //加载所有的资源配置文件
        let j = this.monsterArr.length;
        let offset = 0;
        if(j <= 0){
            return;
        }
        this.monsterArr.forEach(function(item,idx){
            let conPath = item + "con.json";
            $.ajax({
                "pathKey":item,
                "url":conPath,
                "type":"GET",
                "timeout":60000,
                "success":function(data){
                    ConfigManager.main.configDic[data.name] = data
                    //批量加载资源
                    AppDelegate.app.loadAllResource(this.pathKey,data);
                    AppDelegate.app.monsterConfigYingShe[this.pathKey] = data.name;
                    offset++;
                    if(offset == j){
                        //生成小怪物
                        //开始游戏的正常流程
                        AppDelegate.app.startSelf();
                    }
                },
                "error":function(evt){
                    console.log(evt)
                    offset++;
                    if(offset == j){
                        //生成小怪物
                        //并开始游戏的正常流程
                        AppDelegate.app.startSelf();
                    }
                }
            })
        })

        //添加时间监听
        BaseNotificationCenter.main.addObserver(this,GMLKeyBoardEvent.KeyDown,this.ongKeyDown);
        BaseNotificationCenter.main.addObserver(this,GMLKeyBoardEvent.KeyUp,this.ongKeyUp);
        BaseNotificationCenter.main.addObserver(this,GMLEvent.EnterFrame,this.onenterFrame)
    }

    /**
     * 批量加载资源,这个流程在真实生产环境中还需要细分或逻辑调整
     * */
    loadAllResource(dirPath,data){
        let arr = [];
        arr.push(...data[AniTypeEnum.default])
        arr.push(...data[AniTypeEnum.left])
        arr.push(...data[AniTypeEnum.right])
        arr.push(...data[AniTypeEnum.top])
        arr.push(...data[AniTypeEnum.bottom])
        arr.push(...data[AniTypeEnum.leftBottom])
        arr.push(...data[AniTypeEnum.leftTop])
        arr.push(...data[AniTypeEnum.rightBottom])
        arr.push(...data[AniTypeEnum.rightTop])
        let selfins = AppDelegate.app;
        arr.forEach(function(item,idx){
            //console.log(dirPath + item)
            ResourceManager.main.getImgByURL(dirPath + item,selfins,t);
        })
        function t(){}

    }

    /**
     * 帧频事件
     * */
    onenterFrame(e){
        let arr = this.allMonster;
        let j = arr.length;
        for(var i = 0;i<j;i++){
            for(var z = i+1;z<j;z++){
                if(this.allMonster[i].y > this.allMonster[z].y){
                    let item = this.allMonster[z];
                    this.allMonster[z] = this.allMonster[i];
                    this.allMonster[i] = item;
                    this.container.swapChild(i,z);
                }
            }
        }

        //移动背景的位置
        if(this.bg && this.bg.width > 0 && this.bg.height > 0 && this.selfMonster){

            let tx = this.scene.width / 2;
            let offsetX = tx - this.selfMonster.x - this.container.x;
            tx = -(this.bg.img.width - this.scene.width)
            if(this.container.x + offsetX <= tx){
                this.container.x = tx;
            }else if(this.container.x + offsetX > 0){
                this.container.x = 0;
            }else{
                this.container.x += offsetX;
            }

            let ty = this.scene.height / 2;
            let offsetY = ty - this.selfMonster.y - this.container.y;
            ty = -(this.bg.img.height - this.scene.height)
            if(this.container.y + offsetY <= ty){
                this.container.y = ty;
            }else if(this.container.y + offsetY > 0){
                this.container.y = 0;
            }else{
                this.container.y += offsetY;
            }
            this.bg.zhuaquRect = [-this.container.x,-this.container.y,this.scene.width,this.scene.height]
        }
    }

    /**
     * 解析服务器返回的数据
     * */
    jiexiData(data){
        try{
            let jsonObj = JSON.parse(data);
            switch(jsonObj.cmd){
                case 0x00FF0004:
                    //登陆信息回调
                    this.userinfo = jsonObj;//设置全局用户信息
                    if(jsonObj.code == 0){
                        //进入教室
                        let req = {
                            "cmd":0x00FF0014,
                            "seq":0,
                            "rc":"testchanel",
                            "uid":this.userinfo.uid,
                            "nn":this.userinfo.nn,
                            "hi":this.userinfo.hi,
                            "sex":this.userinfo.sex,
                            "ca":{x:parseInt(this.scene.width/2+Math.random()*100),y:parseInt(this.scene.height/2+Math.random()*100)},
                            "rp":this.userinfo.resourcePath
                        };
                        this.ws.sendData(JSON.stringify(req));
                    }else{
                        console.log("登录失败")
                    }

                    break;
                case 0x00FF0007:
                    //掉线通知
                    console.log("掉线了");
                    break;
                case 0x00FF0015:
                    //进入教室回调
                    if(jsonObj.code == 0){
                        console.log("进入教室成功");
                        this.allUserArr = jsonObj.ua;
                        this._trueBegin();
                    }else{
                        console.log("进入教室失败");
                    }
                    break;
                case 0x00FF0017:
                    //其它用户数据变更
                    let arr = jsonObj.ua;
                    arr.forEach(function(obj,idx){
                        if(obj.type == 1){
                            //新用户进入
                            AppDelegate.app.userIn(obj)
                        }else{
                            //老用户退出
                            AppDelegate.app.userOut(obj)
                        }
                    })
                    break;
                case 0x00FF111E:
                    //更新所有monster的坐标,除了自己
                    let dic = jsonObj.datas;
                    let j = this.allMonster.length;
                    if(j == 0)
                        return;
                    let temparr = this.allMonster;
                    for(var key in dic){
                        if(key==this.selfMonster.uid)
                        {
                            //不更新自己
                            continue;
                        }

                        for(let i=0;i<j;i++){
                            if(key == temparr[i].uid){
                                //更新其它所有的monster的位置
                                temparr[i].toEndPoint(dic[key].x,dic[key].y);
                            }
                        }
                    }
                    break;
            }
        }catch(err){
            console.log("数据不是json",data)
        }
    }

    //其它用户进入
    userIn(item){
        let nn = item.nn;
        let sp = item.rp;
        let sk = AppDelegate.app.monsterConfigYingShe[sp];
        let mons = new Monster(nn,sp,sk);
        mons.x = item.ca.x;
        mons.y = item.ca.y;
        AppDelegate.app.container.addChild(mons);
        mons.uid = item.uid;
        AppDelegate.app.allMonster.push(mons);
        return mons;
    }

    //其它用户退出
    userOut(item){
        let j = AppDelegate.app.allMonster.length;
        let arr = AppDelegate.app.allMonster
        for(var i=0;i<j;i++){
            let mons =  arr[i]
            if(mons.uid == item.uid){
                AppDelegate.app.container.removeChild(mons)
                arr.splice(i,1);
                break;
            }
        }
    }

    startSelf(){
        this.allUserArr.forEach(function(item,idx){
            let mons = AppDelegate.app.userIn(item)
            if(item.uid == AppDelegate.app.userinfo.uid){
                //是自己
                AppDelegate.app.selfMonster = mons;
            }
        })
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
