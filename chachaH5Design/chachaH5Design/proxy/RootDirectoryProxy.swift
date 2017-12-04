//  根路径文件夹操作委托
//  RootDirectoryProxy.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/4.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RootDirectoryProxy: GMLProxy {
    /**
     应用程序根操作路径
     */
    private(set) var rootDirectoryPath:String = "";
    
    /**
     日志存储路径
     */
    private(set) var logDirectoryPath:String = "";
    
    
    /**
     用户新建项目存储路径
     */
    private(set) var projectPath:String = "";
    static var instance:RootDirectoryProxy{
        get{
            struct RootDirectoryProxyStruct{
                static var _ins:RootDirectoryProxy = RootDirectoryProxy();
            }
            return RootDirectoryProxyStruct._ins;
        }
    }
    
    override init() {
        super.init();
        let arr = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true);
        if arr.count > 0{
            rootDirectoryPath = arr[0] + "/h5Design/";
            logDirectoryPath = rootDirectoryPath.appending("logs/");
            projectPath = rootDirectoryPath.appending("projects/");
            
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    /**
     检查并创建根路径文件夹及组织结构
     */
    func checkAndCreateRootDir() -> Bool{
        if rootDirectoryPath == ""{
            return false;
        }
        //创建文件夹根目录
        var b = makeDir(rootDirectoryPath);
        //创建日志目录
        if b {
            b = makeDir(logDirectoryPath);
        }
        //创建项目目录
        if b {
            b = makeDir(projectPath);
        }
        return b;
    }
    
    /**
     创建文件夹
     */
    fileprivate func makeDir(_ path:String) -> Bool{
        var tempB:ObjCBool = true;
        if FileManager.default.fileExists(atPath: path, isDirectory: &tempB) == false{
            //如果目录不存在则创建
            do{
                try FileManager.default.createDirectory(atPath: path, withIntermediateDirectories: true, attributes: nil);
                return true;
            }catch{
                return false;
            }
        }else{
            return true;
        }
    }
    
}
