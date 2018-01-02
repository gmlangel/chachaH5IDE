//
//  BaseWindow.swift
//  chacha
//
//  Created by guominglong on 2017/9/14.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import AppKit
class BaseWindow:NSWindow,NSWindowDelegate{
    let minWidth = 1000;//window最小宽度尺寸
    let minHeight = 640;//window最小高度尺寸
    override init(contentRect: NSRect, styleMask style: NSWindow.StyleMask, backing bufferingType: NSWindow.BackingStoreType, defer flag: Bool) {
        super.init(contentRect: contentRect, styleMask: style, backing: bufferingType, defer: flag);
        self.delegate = self;
        self.minSize = NSSize(width: minWidth, height: minHeight);
        self.titlebarAppearsTransparent = true;
        self.styleMask = NSWindow.StyleMask(rawValue: NSWindow.StyleMask.closable.rawValue | NSWindow.StyleMask.fullSizeContentView.rawValue | NSWindow.StyleMask.miniaturizable.rawValue | NSWindow.StyleMask.resizable.rawValue | NSWindow.StyleMask.titled.rawValue);
        self.hasShadow = true;
        self.titleVisibility = .hidden;
    }
    
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        NSApplication.shared.terminate(nil);
        return true;
    }
}
