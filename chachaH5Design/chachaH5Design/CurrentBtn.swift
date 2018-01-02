//
//  CurrentBtn.swift
//  51talkAC
//
//  Created by guominglong on 16/7/4.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
enum CurrentBtnColorState:Int {
    case strokeBorder = 0
    case fillColor = 1
}
class CurrentBtnArgs:NSObject {
    
    var tbFont:NSFont?;//文本字体
    var colorStates:[CurrentBtnColorState]?;//颜色填充状态
    var tbColorArr:[NSColor]?;//文本颜色数组
    var bgColorArr:[NSColor]!;//背景颜色数组
    var bgUnEnabledColorArr:[NSColor]!;//不可用状态下的背景颜色数组
    var align:NSTextAlignment! = NSTextAlignment.center;//文本框对齐方式
    var tbXOffset:CGFloat = 0;//文本框水平方向的偏移像素
    var tbYOffset:CGFloat = 0;//文本框垂直方向的偏移像素
    var angleRadio:CGFloat = 5;//圆角半径
    var isBordered:Bool = false // 是否需要边框
    var isChangeBorderColor: Bool = false // 是否需要边框颜色
    var isIgnoreBtn:Bool = false // 只操作tb
    var borderNormalColor: NSColor = .black
    var borderMouseEnterColor: NSColor = .orange
}


class CurrentBtn:NSButton{
    
    fileprivate var type:Int!;
    fileprivate var isDowned:Bool = false;
    fileprivate var hitTextArea:NSView.TrackingRectTag?;
    fileprivate var tb:NSTextField!;
    var isgEnabled:Bool = true;
    open var downAction:Selector?;
    open var upAction:Selector?;
    //open var dragAction:Selector?;
    var isSelected:Bool = false;
    var cba:CurrentBtnArgs!;
    open var mouseEnterAction:Selector?;
    open var mouseExitedAction:Selector?;
    
    func destroy(){
        downAction = nil;
        upAction = nil;
        //dragAction = nil;
        mouseEnterAction = nil;
        mouseExitedAction = nil;
    }
    
    init(frame frameRect: NSRect,cba:CurrentBtnArgs) {
        super.init(frame: frameRect);
        
//        self.backgroundColor = .red
        type = 0;
        self.cba = cba
        let ps = cba.tbFont == nil ? 20 : (cba.tbFont?.pointSize)! + 6;
        tb = NSTextField(frame: NSRect(origin: CGPoint(x: 0+cba.tbXOffset,y: (self.bounds.size.height - ps) * 0.5 - cba.tbYOffset) , size: CGSize(width: self.bounds.size.width - cba.tbXOffset, height: ps)))
        tb.font = cba.tbFont
        
        if(cba.tbColorArr != nil)
        {
            tb.textColor = cba.tbColorArr![type];
        }
        tb.backgroundColor = NSColor.clear;
        tb.isSelectable = false;
        tb.isEditable = false;
        tb.stringValue = ""
        tb.isBordered = cba.isBordered
        tb.alignment = cba.align
//        tb.backgroundColor = .red
        addSubview(tb)
        self.setNeedsDisplay();
        self.stringValue = "设备检测";
        hitTextArea = self.addTrackingRect(self.bounds, owner: self, userData: nil, assumeInside: false);
    }
    
    override func setFrameSize(_ newSize: NSSize) {
        
        super.setFrameSize(newSize);
        if hitTextArea != nil{
            self.removeTrackingRect(hitTextArea!);
            hitTextArea = nil;
        }
        hitTextArea = self.addTrackingRect(self.bounds, owner: self, userData: nil, assumeInside: false);
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func draw(_ dirtyRect: NSRect) {
        
        // 绘制颜色
        if(isEnabled == true)
        {
            cba.bgColorArr[type].set();
        }else{
            
            if cba.isIgnoreBtn == false
            {
                cba.bgUnEnabledColorArr[type].set()
            }else
            {
                NSColor.clear.set()
            }
            
        }
        
        let bez:NSBezierPath
        if(cba.angleRadio == 0)
        {
            bez = NSBezierPath(rect: self.bounds)
        }else{
            bez = NSBezierPath(roundedRect: self.bounds, xRadius: cba.angleRadio, yRadius: cba.angleRadio)
        }
        bez.lineWidth = 0
        bez.addClip()
        if(cba.colorStates != nil)
        {
            if(cba.colorStates![type] == CurrentBtnColorState.fillColor)
            {
                // 直接填充
                bez.fill()
            }else{
                if cba.isIgnoreBtn == false
                {
                    // 描边
                    NSColor.clear.setFill()
                    bez.fill()
                    bez.lineWidth = 2
                    bez.stroke()
                }
               
            }
        }else{
            // 直接填充
            bez.fill()
        }
        
    }

    override func mouseDown(with theEvent: NSEvent) {
        
        type = 2
        if(isEnabled == true)
        {
            if(cba.tbColorArr != nil)
            {
                tb.textColor = cba.tbColorArr![type];
                if cba.isChangeBorderColor == true
                {
                    tb.layer?.borderColor = cba.borderNormalColor.cgColor
                }
                
            }
        }else{
            tb.textColor = NSColor.black;
        }
        isDowned = true;
        if let tar = self.target,downAction != nil{
            if tar.responds(to: downAction){
                tar.performSelector(inBackground: downAction!, with: self);
            }
        }
        self.setNeedsDisplay();
    }

    override func mouseUp(with theEvent: NSEvent) {
        
        if(isSelected == false)
        {
            type = 0
            if(isEnabled == true)
            {
                if(cba.tbColorArr != nil)
                {
                    tb.textColor = cba.tbColorArr![type];
                    if cba.isChangeBorderColor == true
                    {
                        tb.backgroundColor = .clear
                        tb.layer?.borderWidth = 1
                        tb.layer?.borderColor = cba.borderNormalColor.cgColor
                    }
                }
            }else{
                
                if cba.isChangeBorderColor == true
                {
                  tb.backgroundColor = cba.bgUnEnabledColorArr[type]
                  tb.layer?.borderColor = cba.bgUnEnabledColorArr[type].cgColor

                }
                tb.textColor = NSColor.black;
                
            }
            
                self.setNeedsDisplay()
        }
        
        if let tar = self.target,upAction != nil{
            if tar.responds(to: upAction){
                tar.performSelector(inBackground: upAction!, with: self);
            }
        }
        
        if isDowned && isEnabled == true{
            self.performClick(self);
        }
        
        isDowned = false;
    }
    
    override func mouseEntered(with theEvent: NSEvent) {
        
        if isDowned == false && isSelected == false
        {
            type = 1
            if(isEnabled == true)
            {
                if(cba.tbColorArr != nil)
                {
                    tb.textColor = cba.tbColorArr![type];
                    if cba.isChangeBorderColor == true{
                    
                        tb.layer?.borderColor = cba.borderMouseEnterColor.cgColor
                    }
                }
            }else{
                tb.textColor = NSColor.black;
                
            }
            self.setNeedsDisplay()
        }
        
            if isEnabled == true
            {
                if let tar = self.target,mouseEnterAction != nil{
                    if tar.responds(to: mouseEnterAction){
                        tar.performSelector(inBackground: mouseEnterAction!, with: self);
                    }
                }
            }
            
        
    }

    override func mouseExited(with theEvent: NSEvent) {
        if(isSelected == false)
        {
            type = 0;
            if(isEnabled == true)
            {
                if(cba.tbColorArr != nil)
                {
                    tb.textColor = cba.tbColorArr![type];
                    if cba.isChangeBorderColor == true{
                        tb.layer?.borderColor = cba.borderNormalColor.cgColor
                    }
                }
            }else{
                tb.textColor = NSColor.black;
            }
            self.setNeedsDisplay();
        }
        isDowned = false;
        if let tar = self.target,mouseExitedAction != nil{
            if tar.responds(to: mouseExitedAction){
                tar.performSelector(inBackground: mouseExitedAction!, with: self);
            }
        }
    }
    
    /**
     设置是否可用
     */
    func setGEnable(_ b:Bool)
    {
        isEnabled = b
        if cba.isIgnoreBtn == true && b == true
        {
            cba.isBordered = true
        }
        mouseUp(with: NSEvent())
    }
    
    /**
     设置文本
     */
    override var stringValue:String{
        get{
            return tb.stringValue
        }
        set{
            tb.stringValue = newValue
            super.stringValue = ""
        }
    }
}
