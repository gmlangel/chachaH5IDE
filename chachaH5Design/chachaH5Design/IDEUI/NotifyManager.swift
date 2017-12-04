//
//  NotifyManager.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation

//设计器的面板边沿被拖拽
let IDEPanelSideBeginDrag:NSNotification.Name = NSNotification.Name(rawValue:"IDEPanelSideBeginDrag");
//设计器的面板边沿拖拽停止
let IDEPanelSideEndDrag:NSNotification.Name = NSNotification.Name(rawValue:"IDEPanelSideEndDrag");

//树形路径菜单中的某一项被选中
let PathItemSelected:NSNotification.Name = NSNotification.Name(rawValue:"PathItemSelected");

//树形路径菜单中的某一项展开折叠状态变更
let PathItemZhanKaiStateChange:NSNotification.Name = NSNotification.Name(rawValue:"PathItemZhanKaiStateChange");
