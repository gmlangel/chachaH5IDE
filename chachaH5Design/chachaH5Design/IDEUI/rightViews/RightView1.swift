//  右上面板
//  RightView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RightView1: GMLView {
    open var maxWidth:CGFloat = 400;
    open var minWidth:CGFloat = 200;
    open var minHeight:CGFloat = 50;
    
    /**
     当前正在显示的面板
     */
    var currentShowPanel:GMLView?;
    var attributePanel:GMLView!;
    var pathPanel:GMLView!;
    override func gml_initialUI() {
        self.bgColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        self.layer?.borderWidth = 0.5;
        self.layer?.borderColor = GMLSkinManager.instance.fengexianColor
        
        //属性按钮
        let btn_shuxing = getBtn();
        btn_shuxing.frame.size.width = 50;
        btn_shuxing.title = "属性";
        btn_shuxing.action = #selector(showAttribute);
        btn_shuxing.target = self;
        self.addSubview(btn_shuxing);
        btn_shuxing.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_shuxing.frame.size.width);
            make.height.equalTo(btn_shuxing.frame.size.height);
            make.left.equalTo(self.snp.left).offset(5);
        }
        
        //路径按钮
        let btn_path = getBtn();
        btn_path.frame.size.width = 90
        btn_path.title = "文件结构";
        btn_path.action = #selector(showWenjianjiegou);
        btn_path.target = self;
        self.addSubview(btn_path);
        btn_path.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_path.frame.size.width);
            make.height.equalTo(btn_path.frame.size.height);
            make.left.equalTo(btn_shuxing.snp.right).offset(5);
        }
        
        //初始化属性面板
        attributePanel = RightView_Attribute(frame: NSZeroRect);
        self.addSubview(attributePanel)
        currentShowPanel = attributePanel;
        attributePanel.snp.makeConstraints { (make) in
            make.top.equalTo(btn_path.snp.bottom).offset(5);
            make.left.equalTo(self);
            make.right.equalTo(self);
            make.bottom.equalTo(self);
        }
        
        //初始化路径面板
        pathPanel = RightView_Path(frame: NSZeroRect);
        self.addSubview(pathPanel)
        pathPanel.isHidden = true;
        pathPanel.snp.makeConstraints { (make) in
            make.top.equalTo(btn_path.snp.bottom).offset(5);
            make.left.equalTo(self);
            make.right.equalTo(self);
            make.bottom.equalTo(self);
        }
    }
    
    fileprivate func getBtn() -> NSButton{
        let btn = NSButton(frame: NSRect(x: 0, y: 0, width: 20, height: 20));
        return btn;
    }
    
    /**
     显示属性面板
     */
    func showAttribute(_ sender:Any){
        if currentShowPanel != attributePanel{
            currentShowPanel?.isHidden = true;
            currentShowPanel = attributePanel;
            currentShowPanel?.isHidden = false;
        }
    }
    
    /**
     显示文件结构
     */
    func showWenjianjiegou(_ sender:Any){
        if currentShowPanel != pathPanel{
            currentShowPanel?.isHidden = true;
            currentShowPanel = pathPanel;
            currentShowPanel?.isHidden = false;
        }
    }
}
