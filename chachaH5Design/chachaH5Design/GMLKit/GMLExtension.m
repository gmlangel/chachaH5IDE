//
//  GMLExtension.m
//  51talkAC
//
//  Created by guominglong on 16/6/21.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLExtension.h"
#import "GMLCoreDispatcher.h"
#import "GMLEvent.h"
@implementation NSResponder (GMLKitExtension)

-(GMLCoreDispatcher * __nullable)gml_delegate{
    return nil;
}

-(void)addEventListener:(NSString * __nonnull)eventName execFunc:(void(^ __nullable)(GMLEvent * __nonnull e))_execFunc{
    if([self gml_delegate])
    {
        [[self gml_delegate] addEventListener:eventName execFunc:_execFunc];
    }
}

-(void)removeEventListener:(NSString * __nonnull)eventName{
    if ([self gml_delegate]) {
        [[self gml_delegate] removeEventListener:eventName];
    }
}

-(void)removeAllEventListener{
    if([self gml_delegate])
    {
        [[self gml_delegate] removeAllEventListener];
    }
}

-(void)dispatchEvent:(GMLEvent * __nonnull)e{
    if([self gml_delegate])
    {
        [[self gml_delegate] dispatchEvent:e];
    }
}



@end



///* 注意：要先导入ObjectC运行时头文件，以便调用runtime中的方法*/
//#import <objc/runtime.h>
//
//@implementation NSObject (PropertyListing)
//
///* 获取对象的所有属性，不包括属性值 */
//- (NSArray *)getAllProperties
//{
//    u_int count;
//    objc_property_t *properties  =class_copyPropertyList([self class], &count);
//    NSMutableArray *propertiesArray = [NSMutableArray arrayWithCapacity:count];
//    for (int i = 0; i<count; i++)
//    {
//        const char* propertyName =property_getName(properties[i]);
//        [propertiesArray addObject: [NSString stringWithUTF8String: propertyName]];
//    }
//    free(properties);
//    return propertiesArray;
//}
//
///* 获取对象的所有属性 以及属性值 */
//- (NSDictionary *)properties_aps
//{
//    NSMutableDictionary *props = [NSMutableDictionary dictionary];
//    unsigned int outCount, i;
//    objc_property_t *properties = class_copyPropertyList([self class], &outCount);
//    for (i = 0; i<outCount; i++)
//    {
//        objc_property_t property = properties[i];
//        const char* char_f =property_getName(property);
//        NSString *propertyName = [NSString stringWithUTF8String:char_f];
//        NSLog(@"[pro]===========>%@",propertyName);
//        id propertyValue = [self valueForKey:(NSString *)propertyName];
//        if (propertyValue) [props setObject:propertyValue forKey:propertyName];
//    }
//    free(properties);
//    return props;
//}
//
///* 获取对象的所有方法 */
//-(void)printMothList
//{
//    unsigned int mothCout_f =0;
//    Method* mothList_f = class_copyMethodList([self class],&mothCout_f);
//    for(int i=0;i<mothCout_f;i++)
//    {
//        Method temp_f = mothList_f[i];
//        IMP imp_f = method_getImplementation(temp_f);
//        SEL name_f = method_getName(temp_f);
//        const char* name_s =sel_getName(method_getName(temp_f));
//        int arguments = method_getNumberOfArguments(temp_f);
//        const char* encoding =method_getTypeEncoding(temp_f);
//        NSLog(@"方法名：%@,参数个数：%d,编码方式：%@",[NSString stringWithUTF8String:name_s],
//              arguments,[NSString stringWithUTF8String:encoding]);
//    }
//    free(mothList_f);
//}
//
//@end
