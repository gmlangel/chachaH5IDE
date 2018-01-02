//  H5生成器
//  H5Maker.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/27.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class H5Maker: GMLProxy {
    /**
     key 类型声明命令
     */
    static let classDefine:String = "classDefine"
    
    /**
     key 函数声明命令
     */
    static let methodDefine:String = "methodDefine"
    
    /**
     在初始化后，紧跟着要调用的操作
     */
    static let initExec:String = "initExec"
    
    /**
     对象的唯一标识
     */
    static let id:String = "id";
    
    /**
     子显示对象
     */
    static let children:String = "children";
    
    static var instance:H5Maker{
        get{
            struct H5MakerStruct{
                static let _ins:H5Maker = H5Maker();
            }
            return H5MakerStruct._ins;
        }
    }
    
    
    override init() {
        super.init();
        //测试用， 读取h5预编译文件，将之编译成最终的H5文件
        let templetePath = RootDirectoryProxy.instance.h5PreBuildingPath + "AppDelegate.templete";
        if let templeteStr = loadFileToString(templetePath){
            //模板加载成功后，加载预编译文件
            let h5prePath = RootDirectoryProxy.instance.h5PreBuildingPath + "main.h5pre";
            if let h5preDic = loadFileToJsonDic(h5prePath){
                //预编译文件加载成功后，开始编译H5
                let result = jiexiAndFilltoTemplete(templeteStr,h5preDic);
                //将文件存储到H5 release最终文件夹内
                let savePath = RootDirectoryProxy.instance.h5ReleasePath + "AppDelegate.js";
                do{
                    try result.write(toFile: savePath, atomically: true, encoding: String.Encoding.utf8);
                }catch{
                    
                }
                
            }
        }
        
        
    }
    
    func loadFileToJsonDic(_ filePath:String) -> NSDictionary?{
        var result:NSDictionary? = nil;
        if FileManager.default.fileExists(atPath: filePath){
            do{
                let str = try String(contentsOfFile: filePath, encoding: String.Encoding.utf8);
                if let data = str.data(using: String.Encoding.utf8){
                    if let obj = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.mutableLeaves) as? NSDictionary{
                        result = obj;
                    }
                }
            }catch{
                
            }
            
        }
        return result;
    }
    
    func loadFileToString(_ filePath:String) -> String?{
        var result:String? = nil;
        if FileManager.default.fileExists(atPath: filePath){
            do{
                result = try String(contentsOfFile: filePath, encoding: String.Encoding.utf8);
                
            }catch{
                
            }
            
        }
        return result;
    }
    
    
    /**
     解析与编译文件，并将其拼接到模板的指定位置, return最终的H5内容字符串
     */
    func jiexiAndFilltoTemplete(_ templeteStr:String,_ preObj:NSDictionary) -> String{
        
        var result = templeteStr;
        let keys = preObj.allKeys as! [String];
        for key in keys{
            switch key{
            case H5Maker.id:break;
            case H5Maker.classDefine:
                let classDic = preObj.value(forKey: key) as! NSDictionary;
                break;
                case H5Maker.
            }
        }
        return result;
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
