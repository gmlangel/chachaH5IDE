//  主视图控制器
//  MainViewController.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class MainViewController: NSViewController {
    
    override func viewDidLoad() {
        
        
        //self.view.backgroundColor = NSColor.
        self.view.bgColor = NSColor(cgColor: GMLSkinManager.instance.mainBackgroundColor);
        NotificationCenter.default.addObserver(self, selector: #selector(onwindowResize), name: NSNotification.Name.NSWindowDidResize, object: nil)
    }
    
    func onwindowResize(_ notify:NSNotification)
    {
        if let win = notify.object as? NSWindow{
            (self.view as! GMLView).gml_resize(win.frame.size);
        }
    }
    
    override func viewDidAppear() {
        if let win = self.view.window,let screen = NSScreen.main(){
            win.setFrame(screen.visibleFrame, display: true);
        }
    }
    
}
