//  右下面板
//  RightView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RightView2: GMLView {
    open var maxWidth:CGFloat = 400;
    open var minWidth:CGFloat = 200;
    open var minHeight:CGFloat = 50;
    
    /**
     控件容器
     */
    fileprivate var contentV:RightView_CollectionV!;//必须用界面反射来实现
    
    override func gml_initialUI() {
        self.bgColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        self.layer?.borderWidth = 0.5;
        self.layer?.borderColor = GMLSkinManager.instance.fengexianColor
        
        
        //组件按钮
        let btn_controller = getBtn();
        btn_controller.frame.size.width = 50;
        btn_controller.title = "组件";
        btn_controller.action = #selector(reFillContent);
        btn_controller.target = self;
        self.addSubview(btn_controller);
        btn_controller.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_controller.frame.size.width);
            make.height.equalTo(btn_controller.frame.size.height);
            make.left.equalTo(self.snp.left).offset(5);
        }
        
        //模板按钮
        let btn_templete = getBtn();
        btn_templete.frame.size.width = 50
        btn_templete.title = "模板";
        btn_templete.action = #selector(reFillContent);
        btn_templete.target = self;
        self.addSubview(btn_templete);
        btn_templete.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_templete.frame.size.width);
            make.height.equalTo(btn_templete.frame.size.height);
            make.left.equalTo(btn_controller.snp.right).offset(5);
        }
       
        //初始化内容容器
        contentV = RightView_CollectionV(frame: NSRect(x:0,y:0,width:400,height:400));
        contentV.gml_fillUserInfo(nil);
        self.addSubview(contentV)
        contentV.snp.makeConstraints { (make) in
            make.top.equalTo(btn_templete.snp.bottom).offset(5);
            make.left.equalTo(self.snp.left);
            make.right.equalTo(self.snp.right);
            make.bottom.equalTo(self.snp.bottom);
        }
    }
    
    fileprivate func getBtn() -> NSButton{
        let btn = NSButton(frame: NSRect(x: 0, y: 0, width: 20, height: 20));
        return btn;
    }
    
    func reFillContent(_ sender:Any){
        
    }
    
   
}

