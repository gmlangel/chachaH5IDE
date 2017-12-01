//
//  GMLProxyFactory.m
//  MyTalk
//
//  Created by guominglong on 16/5/12.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLProxyFactory.h"
#import "GMLProxy.h"
//id __nullable gmlProxyByClass(Class __nullable _cla){
//    if(_cla == nil)
//    {
//        return  nil;
//    }else{
//        return [[_cla alloc] init];
//    }
//}

@implementation GMLProxyFactory

+(GMLProxyFactory *)instance{
    static GMLProxyFactory *sharedSingleton = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken,^(void) {
        sharedSingleton = [[GMLProxyFactory alloc] init];
    });
    return sharedSingleton;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _manager = [[NSMutableDictionary alloc] init];
    }
    return self;
}

-(void)add_GMLProxy:(Class)gpro key:(NSString *)_key{
    //如果要存储的类型是GMLProxy类型或GMLProxy的子类，则进行存储
    if ([gpro isSubclassOfClass:[GMLProxy self]]) {
        [_manager setObject:gpro forKey:_key];
    }else{
        NSLog(@"GMLProxyFactory:  _key:%@ 不是GMLProxy或其子类型",_key);
        @throw [[NSException alloc] initWithName:@"GMLProxyError_ClassError" reason:@"绑定的类型不是GMLProxy或其子类型" userInfo:nil];
    }
}

-(Class __nullable)proxyClassForKey:(NSString * __nonnull)_key{
    
    return [_manager objectForKey:_key];
}

-(GMLProxy * __nullable)proxyForKey:(NSString * __nonnull)_key{
    Class _cla = [self proxyClassForKey:_key];
    if(_cla == nil)
    {
        NSLog(@"GMLProxyFactory:被反射的类型为空");
        return nil;
    }else if(![_cla isSubclassOfClass:[GMLProxy self]]){
        NSLog(@"GMLProxyFactory:被反射的类型不是GMLProxy或其子类");
        return nil;
    }else
    {
        return [[_cla alloc] init];
    }
}

-(NSArray<NSString *> * __nonnull)currentProxyKeys{
    return [_manager allKeys];
}

-(BOOL)hasProxyByKey:(NSString * __nonnull)_key{
    return [[_manager allKeys] containsObject:_key];
}

@end
