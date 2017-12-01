//  GMLKit用于管理委托（生成，执行某事件）的工厂。  controller与model层的粘合剂。
//  GMLProxyFactory.h
//  MyTalk
//
//  Created by guominglong on 16/5/12.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import <Foundation/Foundation.h>
@class GMLProxy;
@interface GMLProxyFactory : NSObject
{
    /**
     存储所有委托以及字符串key的对照表
     */
    NSMutableDictionary * _manager;
}

/**
 单例
 */
+(GMLProxyFactory * __nonnull)instance;

/**
 绑定一个处理事件的委托
 */
-(void)add_GMLProxy:(Class __nonnull)gpro key:(NSString * __nonnull)_key;


/**
 获取一个用于处理事件的委托的类型
 */
-(Class __nullable)proxyClassForKey:(NSString * __nonnull)_key;

/**
 获取一个用于处理事件的委托的实例
 */
-(GMLProxy * __nullable)proxyForKey:(NSString * __nonnull)_key;

/**
 判断是否存在某委托
 */
-(BOOL)hasProxyByKey:(NSString * __nonnull)_key;
@end


