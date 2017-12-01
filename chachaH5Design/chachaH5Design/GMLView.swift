//  自定义视图的基础类
//  GMLView.swift
//  51talkAC
//
//  Created by guominglong on 16/6/23.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation
class GMLView: NSView,GMLViewProtocal {
    fileprivate var gdelega:GMLCoreDispatcher?
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        self.gml_initialUI();
        self.gml_resetState();
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder);
    }
    
    func gml_initialUI() {}
    func gml_fillUserInfo(_ userInfo: [AnyHashable: Any]?) {}
    func gml_resetState() {}
    func gml_addEvents() {}
    func gml_destroy() {
        self.gml_removeEvents();
        self.gdelega = nil;
    }
    func gml_removeEvents() {}
    func gml_resize(_ size: NSSize) {}
    override func gml_delegate() -> GMLCoreDispatcher? {
        if(gdelega == nil)
        {
            gdelega = GMLCoreDispatcher();
        }
        return gdelega;
    }
    
    deinit{
        NotificationCenter.default.removeObserver(self);
        Swift.print("======>" + self.className + "被释放");
    }
    
    override func viewDidMoveToWindow() {
        if(window == nil)
        {
            //当从窗口中被移除时，释放掉自身
            self.gml_destroy();
        }
    }
}
