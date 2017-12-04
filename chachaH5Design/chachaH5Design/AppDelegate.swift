//
//  AppDelegate.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Cocoa
@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {



    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Insert code here to initialize your application
        //检测文件根 操作目录是否存在，如果不存在则新建。
        let b = RootDirectoryProxy.instance.checkAndCreateRootDir();
        if b == false{
            return;
        }
        //创建日志
        GMLLog.instance.start();
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }


}

