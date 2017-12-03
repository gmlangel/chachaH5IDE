//
//  CenterView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class CenterView: GMLView {
    fileprivate var moshi:String = "";//放大模式， 缩小模式，拖拽模式
    //title
    var tb_title:NSTextField!;
    
    //控件容器
    var containerV:CenterContainerView!;
    fileprivate var containerVWidth:CGFloat = 800;
    fileprivate var containerVHeight:CGFloat = 400;
    
    //辅助按钮
    var tb_bili:NSTextField!;//画布的缩放比例
    var btn_zoomIn:NSButton!;//缩小按钮
    var btn_zoomOut:NSButton!;//放大按钮
    var btn_drag:NSButton!;//拖拽命令按钮
    override func gml_initialUI() {
        //添加所有H5相关控件的容器
        containerV = CenterContainerView(frame:NSRect(x:10,y:40,width:containerVWidth,height:containerVHeight));
        containerV.bgColor = NSColor.white;
        self.addSubview(containerV);
        
        //添加title
        tb_title = getTextfield();
        self.addSubview(tb_title);
        tb_title.snp.makeConstraints { (make) in
            make.width.equalTo(self);
            make.height.equalTo(22);
            make.top.equalTo(self);
            make.left.equalTo(self);
        }
        
        tb_title.stringValue = "未加载";
        
        //拖拽按钮
        btn_drag = getBtn();
        self.addSubview(btn_drag);
        btn_drag.title = "拖";
        btn_drag.snp.makeConstraints { (make) in
            make.width.equalTo(25);
            make.height.equalTo(25);
            make.bottom.equalTo(self.snp.bottom).offset(-5);
            make.right.equalTo(self.snp.right).offset(-30);
        }
        //放大按钮
        btn_zoomOut = getBtn();
        self.addSubview(btn_zoomOut);
        btn_zoomOut.title = "大";
        btn_zoomOut.snp.makeConstraints { (make) in
            make.width.equalTo(25);
            make.height.equalTo(25);
            make.bottom.equalTo(btn_drag);
            make.right.equalTo(btn_drag.snp.left).offset(-5);
        }
        btn_zoomOut.target = self;
        btn_zoomOut.action = #selector(zoomContainerV);
        
        //缩小按钮
        btn_zoomIn = getBtn();
        self.addSubview(btn_zoomIn);
        btn_zoomIn.title = "小";
        btn_zoomIn.snp.makeConstraints { (make) in
            make.width.equalTo(25);
            make.height.equalTo(25);
            make.bottom.equalTo(btn_drag);
            make.right.equalTo(btn_zoomOut.snp.left).offset(-5);
        }
        btn_zoomIn.target = self;
        btn_zoomIn.action = #selector(zoomContainerV);
        
        //缩放比例文本框
        tb_bili = getTextfield();
        tb_bili.alignment = .right;
        self.addSubview(tb_bili);
        tb_bili.snp.makeConstraints { (make) in
            make.width.equalTo(100);
            make.height.equalTo(18);
            make.centerY.equalTo(btn_zoomIn);
            make.right.equalTo(btn_zoomIn.snp.left).offset(-5);
        }
        tb_bili.stringValue = "100%";
    }
    
    fileprivate func getTextfield() -> NSTextField{
        let tb_titleLabel = NSTextField(frame: NSRect(x: 0, y: 0, width: 150, height: 22));
        tb_titleLabel.font = NSFont.systemFont(ofSize: 12)
        tb_titleLabel.isSelectable = false;
        tb_titleLabel.isEditable = false;
        tb_titleLabel.isBordered = false;
        tb_titleLabel.backgroundColor = NSColor.clear;
        tb_titleLabel.textColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        tb_titleLabel.alignment = .center;
        return tb_titleLabel;
    }
    
    fileprivate func getBtn() -> NSButton{
        let btn = NSButton(frame: NSRect(x: 0, y: 0, width: 25, height: 25));
        return btn;
    }
    
    func zoomContainerV(_ sender:AnyObject){
        
    }
    
    override func mouseDragged(with event: NSEvent) {
        if moshi == "tuozhuai"{
            containerV.frame = containerV.frame.offsetBy(dx: event.deltaX, dy: -event.deltaY);
        }
    }
    
    override func keyDown(with event: NSEvent) {
        if event.keyCode == 49{
            //拖拽模式
            moshi = "tuozhuai";
        }
    }
    
    override func keyUp(with event: NSEvent) {
        moshi = "";
    }
    override var acceptsFirstResponder: Bool{
        get{
            return true;
        }
    }

    
}
