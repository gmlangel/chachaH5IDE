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
    
    /**
     H5预编译文件的存储路径
     */
    private(set) var h5PreBuildingPath:String = "";
    
    /**
     H5 release文件的存储路径
     */
    private(set) var h5ReleasePath:String = "";
    
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
            h5PreBuildingPath = rootDirectoryPath.appending("h5Pre/");
            h5ReleasePath = rootDirectoryPath.appending("h5release/");
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
        //创建h5预编译目录
        if b {
            b = makeDir(h5PreBuildingPath);
        }
        //创建h5release目录
        if b {
            b = makeDir(h5ReleasePath);
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
