/**
 * app主入口
 * Created by guominglong on 2017/12/13.
 */
class AppDelegate{
    static app(){
        if(!window.app)
            window.app = new AppDelegate();
        return window.app;
    }

    constructor(){
        this._mainCanvas = new GMLCanvas();//主画布
        this._rootSprite = new GMLSprite();//根显示容器
    }

    /**
     * 启动
     * */
    start(){

        //将画布添加至document
        document.body.appendChild(this._mainCanvas.canvas);

        //开始时间轴
        TimeLine.mainTimeLine().start(this.updateAnimation);

        //添加系统级的通知监听
        window.addEventListener("keydown",function(evt){
            BaseNotificationCenter.main().postNotify(NotifyStruct.onKeyDown,evt);
        })
        window.addEventListener("keyup",function(evt){
            //spr3.x += 2;
            BaseNotificationCenter.main().postNotify(NotifyStruct.onKeyUp,evt);
        })

        window.addEventListener("mousedown",function(evt){
            let arg = {"x":evt.x - 10,"y":evt.y - 10};//arg 之所以evt.x向左偏移10px,是因为主canvas并没有在html的0,0点,而是10,10点
            //BaseNotificationCenter.main().postNotify(NotifyStruct.onMouseDown,arg);
            //鼠标检测
            let disPlayItem = AppDelegate.app()._rootSprite.hitTestPoint(arg.x,arg.y);
            if(disPlayItem) {
                disPlayItem.dispatchEvent(new BaseEvent("mousedown"));//向其派发鼠标按下事件
            }
        })

        //测试用
        let spr1 = new GMLSprite();
        spr1.name = "s1"
        spr1.makeShape(0,0,500,500,0xff6600ff,0x000000ff);
        this._rootSprite.addChild(spr1);
        spr1.x = 0;

        let spr2 = new GMLSprite();
        spr2.name = "s2"
        spr2.makeShape(0,0,100,100,0xf06000ff,0xf06000ff);
        this._rootSprite.addChild(spr2);
        spr2.x = 120;

        let spr3 = new GMLSprite();
        spr3.name = "s3"
        spr3.makeShape(0,0,100,100,0x006600ff,0x006600ff);
        this._rootSprite.addChild(spr3);
        spr3.x = 230;

        //添加键盘控制的位移动画
        BaseNotificationCenter.main().addObserver(spr3,NotifyStruct.onKeyDown,function(evt){
            let kecode = evt.keyCode;
            switch(kecode){
                case 32:spr3.scaleX = spr3.scaleY = 1.3;break;
                case 37:spr3.x -= 5;break;
                case 39:spr3.x += 5;break;
                case 38:spr3.y -= 5;break;
                case 40:spr3.y += 5;break;
            }
        });

        BaseNotificationCenter.main().addObserver(spr3,NotifyStruct.onKeyUp,function(evt){
            let kecode = evt.keyCode;
            switch(kecode){
                case 32:
                    spr3.scaleX = spr3.scaleY = 1;
                    break;
            }
        });

        //添加用于测试的点击事件
        spr3.addEventListener("mousedown",function(evt){
            console.log(evt.gCurrentTarget)
        })


        for(let i=0;i<1;i++)
        {
            let img = new GMLImage("./resource/bg.png",[50,50,300,300]);

            img.name = "img_" + i;
            img.scaleX = 0.5;
            img.scaleY = 0.5;
            img.itiwX = 0.5;
            img.itiwY = 0.5;
            img.addEventListener("mousedown",function(evt){
                console.log(evt.gCurrentTarget.name)
            })
            let sprtt = new GMLSprite()
            sprtt.makeShape(0,0,300,300,0xf500f5,0xf500f5);
            sprtt.x = 150;
            sprtt.y = 150;
            sprtt.scaleX = 0.5;
            sprtt.scaleY = 0.5;
            sprtt.addChildAt(img,0);
            this._rootSprite.addChild(sprtt);
        }



        //BaseNotificationCenter.main().addObserver(AppDelegate.,NotifyStruct.onMouseDown,function(arg){
        //
        //});


        //spr3.addEventListener("onkeyup",function(){
        //
        //})
    }


    /**
     * 时间轴更新动画函数
     * */
    updateAnimation(){
        //这里的this 是一个undefined 因为他是window.requestAnimationFrame 的一个回调函数
        let ctx = AppDelegate.app()._mainCanvas.context2D;
        //先清空
        ctx.clearRect(0,0,AppDelegate.app()._mainCanvas.width,AppDelegate.app()._mainCanvas.height);
        //再重绘
        AppDelegate.app()._rootSprite.drawInContext(ctx,0,0,1,1);//跟容器必须绘制在ctx的0,0位置且 缩放必须为1倍
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
        TimeLine.mainTimeLine().stop();
    }
}


/**
 * 通知的定义
 * */
class NotifyStruct{
    /**
     * 键盘按下
     * */
    static get onKeyDown(){
        return "NotifyStruct.onKeyDown";
    }

    /**
     * 键盘抬起
     * */
    static get onKeyUp(){
        return "NotifyStruct.onKeyUp";
    }

    /**
     * 鼠标按下
     * */
    static get onMouseDown(){
        return "NotifyStruct.onMouseDown";
    }

    constructor(){

    }
}