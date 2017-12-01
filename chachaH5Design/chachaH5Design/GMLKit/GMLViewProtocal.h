//
//  GMLViewProtocal.h
//  GMLKit针对View视图的设计规范(协议)
//
//  Created by guominglong on 16/5/10.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol GMLViewProtocal <NSObject>

/**
 初始化页面所需的所有UI控件
 */
-(void)gml_initialUI;

/**
 将界面还原为初始状态
 */
-(void)gml_resetState;

/**
 填充数据
 @param userInfo 用户自定义数据
 */
-(void)gml_fillUserInfo:(NSDictionary * __nullable)userInfo;


/**
 添加事件
 */
-(void)gml_addEvents;


/**
 移除所有事件,尽量不要在这个函数中调用removeAllEventListener，因为有一些监听是类的外部添加的。避免错删
 */
-(void)gml_removeEvents;

/**
 屏幕自适应
 */
-(void)gml_resize:(NSSize)size;

/**
 清空所有与自己有关的引用，等待ARC。
 必须做的事  
 @param 1.调用gml_removeEvents
 @param 2.调用removeAllEventlistener
 @param 3.制空已知的delegate为nil
 @param 4.移除所有子视图
 */
-(void)gml_destroy;


@end
