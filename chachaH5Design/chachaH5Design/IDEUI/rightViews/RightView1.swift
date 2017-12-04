//  右上面板
//  RightView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RightView1: GMLView {

    open var maxWidth:CGFloat = 400;
    open var minWidth:CGFloat = 200;
    open var minHeight:CGFloat = 50;
    
    /**
     当前正在显示的面板
     */
    var currentShowPanel:GMLView?;
    var attributePanel:GMLView!;
    var pathPanel:GMLView!;
    /**
     路径数据源
     */
    var pathDataSource:PathData?;
    override func gml_initialUI() {
        self.bgColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        self.layer?.borderWidth = 0.5;
        self.layer?.borderColor = GMLSkinManager.instance.fengexianColor
        
        //属性按钮
        let btn_shuxing = getBtn();
        btn_shuxing.frame.size.width = 50;
        btn_shuxing.title = "属性";
        btn_shuxing.action = #selector(showAttribute);
        btn_shuxing.target = self;
        self.addSubview(btn_shuxing);
        btn_shuxing.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_shuxing.frame.size.width);
            make.height.equalTo(btn_shuxing.frame.size.height);
            make.left.equalTo(self.snp.left).offset(5);
        }
        
        //路径按钮
        let btn_path = getBtn();
        btn_path.frame.size.width = 90
        btn_path.title = "文件结构";
        btn_path.action = #selector(showWenjianjiegou);
        btn_path.target = self;
        self.addSubview(btn_path);
        btn_path.snp.makeConstraints { (make) in
            make.top.equalTo(self.snp.top).offset(5);
            make.width.equalTo(btn_path.frame.size.width);
            make.height.equalTo(btn_path.frame.size.height);
            make.left.equalTo(btn_shuxing.snp.right).offset(5);
        }
        
        //初始化属性面板
        attributePanel = RightView_Attribute(frame: NSZeroRect);
        self.addSubview(attributePanel)
        currentShowPanel = attributePanel;
        attributePanel.snp.makeConstraints { (make) in
            make.top.equalTo(btn_path.snp.bottom).offset(5);
            make.left.equalTo(self);
            make.right.equalTo(self);
            make.bottom.equalTo(self);
        }
        
        //初始化路径面板
        pathPanel = RightView_Path(frame: NSZeroRect);
        self.addSubview(pathPanel)
        pathPanel.isHidden = true;
        pathPanel.snp.makeConstraints { (make) in
            make.top.equalTo(btn_path.snp.bottom).offset(5);
            make.left.equalTo(self);
            make.right.equalTo(self);
            make.bottom.equalTo(self);
        }
    }
    
    fileprivate func getBtn() -> NSButton{
        let btn = NSButton(frame: NSRect(x: 0, y: 0, width: 20, height: 20));
        return btn;
    }
    
    /**
     显示属性面板
     */
    func showAttribute(_ sender:Any){
        if currentShowPanel != attributePanel{
            currentShowPanel?.isHidden = true;
            currentShowPanel = attributePanel;
            currentShowPanel?.isHidden = false;
        }
    }
    
    /**
     显示文件结构
     */
    func showWenjianjiegou(_ sender:Any){
        if currentShowPanel != pathPanel{
            currentShowPanel?.isHidden = true;
            currentShowPanel = pathPanel;
            currentShowPanel?.isHidden = false;
            //读取文件夹结构
            DispatchQueue.global().async {
                let data = PathData();
                data.fullPath = GlobelInfo.instance.currentProjectPath
                data.fileType = .Dir;
                data.isSelected = true;
                if let nameArr = FileManager.default.componentsToDisplay(forPath: GlobelInfo.instance.currentProjectPath){
                    data.fileName = nameArr[nameArr.count - 1];
                }
                data.childrenPathArr = self.makeProjectPathDataSource(data.fullPath,data);
                self.pathDataSource = data;
                if self.pathDataSource != nil{
                    //填充给pathPanel
                    DispatchQueue.main.async {
                        self.pathPanel.gml_fillUserInfo(["data":self.pathDataSource!]);
                    }
                }
            }
            
        }
    }
    fileprivate var isDic:ObjCBool = true;
    //读取项目文件夹结构
    func makeProjectPathDataSource(_ path:String,_ parentNode:PathData? = nil) -> [PathData]?{
        
        if FileManager.default.fileExists(atPath: path, isDirectory: &isDic){
            if isDic.boolValue == false{
                return nil;//不是文件夹，则return空
            }
            do{
                var tempPaths = try FileManager.default.contentsOfDirectory(atPath: path)
                var arr = [PathData]();//FileManager.default.componentsToDisplay(forPath: path);
                let j = tempPaths.count;
                for i:Int in 0 ..< j{
                    if tempPaths[i] == ".DS_Store"{
                        continue;
                    }
                    let pd = PathData();
                    pd.fullPath = path + "/" + tempPaths[i];
                    pd.fileName = tempPaths[i];
                    FileManager.default.fileExists(atPath: pd.fullPath, isDirectory: &isDic)
                    pd.fileType = isDic.boolValue ? .Dir : .File;
                    pd.parentPathData = parentNode;//设置父级
                    pd.childrenPathArr = makeProjectPathDataSource(pd.fullPath,pd);
                    arr.append(pd);
                }
                return arr;
            }catch{
                return nil;
            }
        }else{
            return nil;
        }
        
    }
}

/**
 路径信息实体
 */
class PathData: NSObject {
    var fileType:PathDataFileType = .File;
    var fullPath:String = "";//文件完整路径
    var fileName:String = "";//文件名 + 扩展名
    var isSelected:Bool = false;//是否默认被选中
    var isZhanKai:Bool = true;//是否默认展开
    weak var parentPathData:PathData?;//父级路径数据
    var childrenPathArr:[PathData]?;//子路径数据数组
}

enum PathDataFileType:Int{
    case Dir = 0;//文件夹
    case File = 1;//文件
}
