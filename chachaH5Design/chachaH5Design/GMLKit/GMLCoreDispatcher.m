//
//  GMLCoreDispatcher.m
//  MyTalk
//
//  Created by guominglong on 16/5/9.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLCoreDispatcher.h"
#import "GMLEvent.h"
static GMLCoreDispatcher * ins = nil;

@implementation GMLCoreDispatcher


- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

-(void)addEventListener:(NSString *)eventName execFunc:(void (^)(GMLEvent *))_execFunc
{
    if(eventDic == nil)
    {
        eventDic = [[NSMutableDictionary alloc] init];
    }
    [eventDic setObject:_execFunc forKey:eventName];
}

-(void)removeEventListener:(NSString *)eventName{
    if([self hasEventListener:eventName] == YES)
    {
        [eventDic removeObjectForKey:eventName];
    }
    
    if([eventDic count] == 0)
    {
        eventDic = nil;
    }
}

-(void)removeAllEventListener
{
    if(eventDic != nil)
    {
        [eventDic removeAllObjects];
        eventDic = nil;
    }
}

-(BOOL)hasEventListener:(NSString *)eventName{
    if(eventDic == nil)
    {
        return NO;
    }else{
        return [eventDic.allKeys containsObject:eventName];
    }
}

-(void)dispatchEvent:(GMLEvent *)e{
    if(eventDic == nil)
    {
        return;
    }
    
    
    for (NSString* key in eventDic.allKeys) {
        if([key isEqualToString:e.eventType])
        {
            //执行代码块
            ((void (^)(GMLEvent *))[eventDic valueForKey:key])(e);
            break;
        }
    }
}
@end
