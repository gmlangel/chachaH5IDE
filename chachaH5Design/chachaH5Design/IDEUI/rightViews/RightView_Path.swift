//
//  RightView_Path.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/3.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RightView_Path: GMLView {
    fileprivate var scroll:NSScrollView!;
    fileprivate var containerV:NSView!;
    fileprivate var rowItemHeight:CGFloat = 20;//每一个子菜单项的高度
    override func gml_initialUI() {
        containerV = NSView(frame: NSZeroRect);
        
        scroll = NSScrollView(frame: NSZeroRect);
        scroll.contentView.drawsBackground = false;
        self.addSubview(scroll);
        scroll.autohidesScrollers = true;
        scroll.hasVerticalScroller = true;
        scroll.hasHorizontalScroller = true;
        scroll.snp.makeConstraints { (make) in
            make.top.equalTo(self);
            make.left.equalTo(self);
            make.right.equalTo(self);
            make.bottom.equalTo(self);
        }
    }
    
    override func gml_fillUserInfo(_ userInfo: [AnyHashable : Any]?) {
        if let data = userInfo?["data"] as? PathData{
            //移除旧的
            let arr = containerV.subviews;
            for v in arr{
                v.removeFromSuperview();
            }
            
            //添加新的
            let offset = forEachAdd(data,self.frame.size.width,0);
            containerV.frame = NSRect(x: 0, y: 0, width: self.frame.size.width, height: -offset);
            let arr2 = containerV.subviews;
            for v in arr2{
                v.frame.origin.y -= offset;
            }
            self.addSubview(containerV);
            
            resizeScroll();//重新计算滚动条
        }
    }
    
    override func setFrameSize(_ newSize: NSSize) {
        super.setFrameSize(newSize);
        resizeScroll();//重新计算滚动条
    }
    
    //重新计算滚动条
    fileprivate func resizeScroll(){
        if containerV.frame.size.height > self.frame.size.height{
            //显示滚动条
            containerV.frame.origin.y = 0;这个值，切换回来后，有问题
            scroll.documentView = containerV;
            scroll.scroll(scroll.contentView, to: NSPoint(x:0,y:containerV.frame.size.height - scroll.frame.size.height));
        }else{
            self.addSubview(containerV);
            containerV.frame.origin.y = self.frame.size.height - containerV.frame.size.height;
        }
    }
    
    fileprivate func forEachAdd(_ data:PathData,_ w:CGFloat,_ xOffset:CGFloat = 0,_ yOffset:CGFloat = 0) -> CGFloat{
        var tYOffset = yOffset
        //填充树形菜单
        let rootItem = makeRowItem(data,w,xOffset,tYOffset);
        containerV.addSubview(rootItem);
        tYOffset -= rowItemHeight;
        if data.isZhanKai{
            //如果该项是展开的，则循环遍历其子item
            if let arr = data.childrenPathArr , arr.count > 0{
                let j = arr.count;
                for i:Int in 1 ... j{
                    tYOffset = forEachAdd(arr[j - i],w - 15,xOffset + 15,tYOffset);
                }
            }
        }
        return tYOffset;
    }
    
    func makeRowItem(_ data:PathData,_ w:CGFloat,_ xOffset:CGFloat,_ yOffset:CGFloat) -> PathItemView{
        let v = PathItemView(frame:NSRect(x: xOffset, y: yOffset - rowItemHeight, width: w, height: rowItemHeight));
        v.titleTb.stringValue = data.fileName;
        v.img.bgColor = data.fileType == .Dir ? NSColor.blue : NSColor.red;
        v.data = data;
        return v;
    }
    
    
}

class PathItemView:NSView{
    /**
     显示的名称
     */
    var titleTb:NSTextField!;
    /**
     显示的图片
     */
    var img:NSImageView!;
    
    /**
     数据源
     */
    weak var data:PathData?;
    
    
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        img = NSImageView(frame:NSZeroRect);
        self.addSubview(img);
        img.snp.makeConstraints { (make) in
            make.height.equalTo(self);
            make.width.equalTo(self.frame.size.height);
            make.top.equalTo(0);
            make.left.equalTo(0);
        }
        
        titleTb = NSTextField(frame: NSRect(x: 0, y: 0, width: 150, height: 18));
        titleTb.font = NSFont.systemFont(ofSize: 12)
        titleTb.isSelectable = false;
        titleTb.isEditable = false;
        titleTb.isBordered = false;
        titleTb.backgroundColor = NSColor.clear;
        titleTb.textColor = GMLSkinManager.instance.currentFontColor
        titleTb.alignment = .left;
        titleTb.lineBreakMode = .byTruncatingTail;
        self.addSubview(titleTb);
        titleTb.snp.makeConstraints { (make) in
            make.height.equalTo(18);
            make.left.equalTo(img.snp.right).offset(5);
            make.right.equalTo(self).offset(-5);
            make.centerY.equalTo(self.snp.centerY);
        }
        
        
    }
    
    override func mouseDown(with event: NSEvent) {
        super.mouseDown(with: event);
        if data != nil && data!.isSelected == false{
            data!.isSelected = true
            NotificationCenter.default.post(name: PathItemSelected, object: data!);
        }
        data!.isZhanKai = !data!.isZhanKai;
        NotificationCenter.default.post(name: PathItemZhanKaiStateChange, object: data!);
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}




//class ProjectItem:NSTable{
//    override init(frame frameRect: NSRect) {
//        super.init(frame:frameRect);
//        self.bgColor = NSColor.red;
//    }
//    
//    required init?(coder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//}
