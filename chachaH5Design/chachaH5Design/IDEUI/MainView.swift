//  主视图
//  MainView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import SnapKit
class MainView:GMLView{
    fileprivate var dragType:String = "";//视图边沿拖拽状态，默认为没有任何视图被拖拽
    fileprivate var topView:TopView!;//顶部工具面板
    fileprivate var leftView:LeftView!;//左侧工具面板
    fileprivate var rightView1:RightView1!;//右侧工具面板
    fileprivate var rightView2:RightView2!;//右侧工具面板
    fileprivate var centerView:CenterView!;//中间工作区域面板
    
    required init?(coder: NSCoder) {
        super.init(coder: coder);
        self.gml_initialUI();
    }
    override func gml_initialUI() {
        let w = self.frame.size.width;
        let h = self.frame.size.height;
        let offsetH = h - 150;
        topView = TopView(frame: NSRect(x: 0, y: offsetH, width: w, height: 100));
        self.addSubview(topView);
        
        leftView = LeftView(frame: NSRect(x: 0, y: 0, width: 150, height: offsetH));
        self.addSubview(leftView);
        
        rightView1 = RightView1(frame: NSRect(x: w - 200, y: offsetH / 2, width: 200, height: offsetH / 2));
        self.addSubview(rightView1);
        rightView2 = RightView2(frame: NSRect(x: w - 200, y: 0, width: 200, height: offsetH / 2));
        self.addSubview(rightView2);
        
        centerView = CenterView(frame:NSRect(x:leftView.frame.maxX, y: 0, width: rightView1.frame.minX - leftView.frame.maxX, height: offsetH))
        self.addSubview(centerView, positioned: NSWindow.OrderingMode.below, relativeTo: topView);
        centerView.snp.makeConstraints { (make) in
            make.bottom.equalTo(self.snp.bottom);
            make.left.equalTo(leftView.snp.right);
            make.top.equalTo(topView.snp.bottom);
            make.right.equalTo(rightView1.snp.left);
        }
        //添加相关的监听事件
        gml_addEvents();
    }
    
    override func gml_addEvents() {
        NotificationCenter.default.addObserver(self, selector: #selector(onIDEPanelSideBeginDrag), name: IDEPanelSideBeginDrag, object: nil);
        NotificationCenter.default.addObserver(self, selector: #selector(onIDEPanelSideEndDrag), name: IDEPanelSideEndDrag, object: nil);
    }
    
    override func gml_resize(_ size: NSSize) {
        self.frame.size = size;
        let w = self.frame.size.width;
        let h = self.frame.size.height;
        let offsetH = h - topView.frame.size.height;
        topView.frame = NSRect(x: 0, y: offsetH, width: w, height: topView.frame.size.height);
        leftView.frame = NSRect(x: 0, y: 0, width: leftView.frame.size.width, height: offsetH);
        rightView2.frame = NSRect(x: w - rightView2.frame.size.width, y: 0, width: rightView2.frame.size.width, height: rightView2.frame.size.height)
        rightView1.frame = NSRect(x: w - rightView1.frame.size.width, y: rightView2.frame.maxY, width: rightView1.frame.size.width, height: offsetH - rightView2.frame.size.height)
        topView.updateConstraints();
        leftView.updateConstraints();
        rightView1.updateConstraints();
        rightView2.updateConstraints();
        centerView.updateConstraints();
    }
    
    @objc func onIDEPanelSideBeginDrag(_ notify:NSNotification){
        dragType = (notify.object as? String) ?? "";
        NSLog("1:\(dragType)")
    }
    
    @objc func onIDEPanelSideEndDrag(_ notify:NSNotification){
        dragType = "";
        NSLog("2:\(dragType)")
    }
    
    override func mouseDragged(with event: NSEvent) {
        if dragType == "topV"{
            //改变顶部工具栏的尺寸
            var tempH = topView.frame.size.height + event.deltaY;
            tempH = tempH > topView.maxHeight ? topView.maxHeight : tempH;
            tempH = tempH < topView.minHeight ? topView.minHeight : tempH;
            topView.frame.size.height = tempH;
            NotificationCenter.default.post(name: NSWindow.didResizeNotification, object: self.window);
        }else if dragType == "leftV"{
            //改变左侧工具栏的尺寸
            var tempW = leftView.frame.size.width + event.deltaX;
            tempW = tempW > leftView.maxWidth ? leftView.maxWidth : tempW;
            tempW = tempW < leftView.minWidth ? leftView.minWidth : tempW;
            leftView.frame.size.width = tempW;
            NotificationCenter.default.post(name: NSWindow.didResizeNotification, object: self.window);
        }else if dragType == "rightV"{
            //改变右侧工具栏的尺寸
            var tempW = rightView1.frame.size.width - event.deltaX;
            tempW = tempW > rightView1.maxWidth ? rightView1.maxWidth : tempW;
            tempW = tempW < rightView1.minWidth ? rightView1.minWidth : tempW;
            rightView1.frame.size.width = tempW;
            rightView2.frame.size.width = tempW;
            NotificationCenter.default.post(name: NSWindow.didResizeNotification, object: self.window);
        }else if dragType == "rightV_mid"{
            var tempH = rightView2.frame.size.height - event.deltaY;
            tempH = tempH < rightView2.minHeight ? rightView2.minHeight : tempH;
            let maxH = self.frame.size.height - topView.frame.size.height - rightView2.minHeight;
            tempH = tempH > maxH ? maxH : tempH;
            rightView2.frame.size.height = tempH;
            rightView1.frame.size.height = self.frame.size.height - topView.frame.size.height - rightView2.frame.size.height;
            NotificationCenter.default.post(name: NSWindow.didResizeNotification, object: self.window);
        }
    }
    
    
    override func mouseDown(with event: NSEvent) {
        
        let locolPoint = event.locationInWindow;
        var tempP = topView.frame.minY;
        if locolPoint.y > tempP - 5 && locolPoint.y < tempP + 5{
            //开始拖拽topView的边沿
            NotificationCenter.default.post(name: IDEPanelSideBeginDrag, object: "topV");
            return;
        }
        
        tempP = leftView.frame.maxX;
        if locolPoint.x > tempP - 5 && locolPoint.x < tempP + 5{
            //开始拖拽leftView的边沿
            NotificationCenter.default.post(name: IDEPanelSideBeginDrag, object: "leftV");
            return;
        }
        
        tempP = rightView1.frame.minX;
        if locolPoint.x > tempP - 5 && locolPoint.x < tempP + 5{
            //开始拖拽rightView的边沿
            NotificationCenter.default.post(name: IDEPanelSideBeginDrag, object: "rightV");
            return;
        }
        
        tempP = rightView2.frame.maxY;
        if locolPoint.y > tempP - 5 && locolPoint.y < tempP + 5{
            //开始拖拽topView的边沿
            NotificationCenter.default.post(name: IDEPanelSideBeginDrag, object: "rightV_mid");
            return;
        }
        
        super.mouseDown(with: event);
    }
    
    override func mouseUp(with event: NSEvent) {
        //停止了各个面板视图的边沿拖拽
        NotificationCenter.default.post(name: IDEPanelSideEndDrag, object: nil);
        super.mouseUp(with: event);
    }
}
