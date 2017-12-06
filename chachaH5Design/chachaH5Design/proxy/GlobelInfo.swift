//
//  GlobelInfo.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/4.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class GlobelInfo: GMLProxy {
    static var instance:GlobelInfo{
        get{
            struct GlobelInfoStruc{
                static var _ins = GlobelInfo();
            }
            return GlobelInfoStruc._ins;
        }
    }
    
    open var currentProjectPath:String = "";
    
    /**
     当前操作的路径对象
     */
    open var currentPD:PathData?;
    override init() {
        super.init();
        currentProjectPath = RootDirectoryProxy.instance.projectPath;
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
