//  字体皮肤定义
//  FontEnum.swift
//  chacha
//
//  Created by guominglong on 2017/9/22.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class FontEnum {
    /**
     系统字体 14号 (程序内的通用字体)
     */
    static let commonFont:NSFont = NSFont.systemFont(ofSize: 14);
    
    /**
     按钮文本字体 12号 (程序内的按钮文本的字体)
     */
    static let btnTextFont:NSFont = NSFont.systemFont(ofSize: 12);
    
    /**
     欢迎页面的title字体 40号
     */
    static let huanyingTextFont:NSFont = NSFont.systemFont(ofSize: 40);
    
    /**
     标题文本字体 12号
     */
    static let titleFont:NSFont = NSFont.systemFont(ofSize: 12);
    
    /**
     错误提示字体 12号
     */
    static let errorTipFont:NSFont = NSFont.systemFont(ofSize: 12);
}
