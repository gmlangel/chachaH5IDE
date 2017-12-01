//
//  GMLExtensions.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
import AppKit
extension NSView{
    open var bgColor:NSColor?{
        set{
            self.wantsLayer = true;
            if let col = newValue?.cgColor{
                self.layer?.backgroundColor = col;
            }
            
        }
        get{
            if let col = self.layer?.backgroundColor{
                return NSColor(cgColor: col);
            }else{
                return nil;
            }
        }
    }
    
}
