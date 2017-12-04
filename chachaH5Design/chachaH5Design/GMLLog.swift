//
//  GMLLog.swift
//  51talkAC
//
//  Created by guominglong on 16/10/17.
//  Copyright © 2016年 guominglong. All rights reserved.
//

import Foundation


class GMLLog: NSObject {
    
    var localSavePath:String!; // 本地存储地址
    fileprivate var dateFormat:DateFormatter!;
    fileprivate var fs:FileHandle?;
    fileprivate var mylock:NSRecursiveLock!;
    fileprivate var contentFormat:String!
    
    static var instance:GMLLog{
        get{
            struct GMLLogStruc{
                static var _ins:GMLLog = GMLLog();
            }
            return GMLLogStruc._ins;
        }
    }
    
    override init() {
        
        dateFormat = DateFormatter();
        dateFormat.dateFormat = "yyyy-MM-dd HH:mm:ss";
        // 设置为东八区时间
        dateFormat.timeZone = NSTimeZone.init(forSecondsFromGMT: 8*60*60) as TimeZone!
        mylock = NSRecursiveLock();
        contentFormat = "[%@]%@\n";
        super.init();
    }
    
    /**
     记录日志
     */
    func log(_ content:String)
    {
        if self.fs == nil{
            return;
        }
        
        let timeStr = dateFormat.string(from: Date());
        let waitWriteStr = String(format: contentFormat, timeStr,content);
        DispatchQueue.global().async {
            self.mylock.lock();
            
            self.fs?.seekToEndOfFile();
            self.fs?.write(waitWriteStr.data(using: String.Encoding.utf8)!);
            
            self.mylock.unlock();
        }
    }
    
    /**
     开始记录日志
     */
    func start(){
        
        if fs != nil{
            fs!.closeFile()
        }
        
        localSavePath = RootDirectoryProxy.instance.logDirectoryPath + String(format: "/H5Design-%d.Log",Int(Date().timeIntervalSince1970));
        var b = true;
        if FileManager.default.fileExists(atPath: localSavePath) == false{
            b = FileManager.default.createFile(atPath: localSavePath, contents: "".data(using: String.Encoding.utf8), attributes: nil);
        }
        
        if b == true{
            fs = FileHandle(forUpdatingAtPath: localSavePath);
            fs!.synchronizeFile();
        }
    }
    
    /**
     停止记录日志  打开注释会有崩溃风险，在app关闭时 fs有可能正在其他线程锁定，造成无法继续writeData
     */
//    func stop(waitWriteStr:String){
//        let timeStr = dateFormat.stringFromDate(GlobelTimer.instance.serverTime);
//        let result = String(format: contentFormat, timeStr,waitWriteStr);
//        if fs != nil{
//            fs?.seekToEndOfFile();
//            fs?.writeData(result.dataUsingEncoding(NSUTF8StringEncoding)!);
//            fs?.closeFile();
//            fs = nil;
//        }
//    }
    
//    /**
//     向字节流中写入一个时间戳
//     */
//    private func writeTimeToData()
//    {
//        var ti = NSDate().timeIntervalSince1970;
//        nd.appendBytes(&ti, length: 8);
//    }
    
//    private func writeStrToData(value:AnyObject? = nil)
//    {
//        var tempLen = 0;
//        var str = "";
//        if(value != nil)
//        {
//            str = value as! String;
//        }
//        let tempDate = str.dataUsingEncoding(NSUTF8StringEncoding)!;
//        tempLen = tempDate.length;
//        self.nd.appendBytes(&tempLen, length: 2);//写字符串的长度
//        self.nd.appendData(tempDate);//写字符串内容
//    }
    

}

extension String {
    // 对象方法
    func getFileSize() -> UInt64  {
        var size: UInt64 = 0
        let fileManager = FileManager.default
        var isDir: ObjCBool = false
        let isExists = fileManager.fileExists(atPath: self, isDirectory: &isDir)
        // 判断文件存在
        if isExists {
            // 是否为文件夹
            if isDir.boolValue {
                // 迭代器 存放文件夹下的所有文件名
                let enumerator = fileManager.enumerator(atPath: self)
                for subPath in enumerator! {
                    // 获得全路径
                    let fullPath = self.appending("/\(subPath)")
                    do {
                        let attr = try fileManager.attributesOfItem(atPath: fullPath)
                        size += attr[FileAttributeKey.size] as! UInt64
                    } catch  {
                        //print("error :\(error)")
                    }
                }
            } else {    // 单文件
                do {
                    let attr = try fileManager.attributesOfItem(atPath: self)
                    size += attr[FileAttributeKey.size] as! UInt64
                    
                } catch  {
                    //print("error :\(error)")
                }
            }
        }
        return size
    }
}
