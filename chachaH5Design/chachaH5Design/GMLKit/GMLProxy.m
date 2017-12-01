//
//  GMLProxy.m
//  MyTalk
//
//  Created by guominglong on 16/5/10.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLProxy.h"
@implementation GMLProxy

-(GMLCoreDispatcher * __nullable)gml_delegate{
    if(_gmlDis == nil)
    {
        _gmlDis = [[GMLCoreDispatcher alloc] init];
    }
    return  _gmlDis;
    

}

-(void)gml_destroy{
    if([self gml_delegate]){
        //移除所有的监听
        [[self gml_delegate] removeAllEventListener];
    }
    _gmlDis = nil;
}

-(void)execFun:(SEL __nonnull)exeSel arg:(id __nullable)_arg{
    if([self respondsToSelector:exeSel] == true)
    {
        if(_arg == nil)
        {
            [self performSelector:exeSel];
        }else{
            [self performSelector:exeSel withObject:_arg];
        }
        
    }else{
        NSLog(@"函数%@不存在",NSStringFromSelector(exeSel));
    }
}

-(id __nullable)execHasCallbackFun:(NSString * __nonnull)funcName arg:(id __nullable)_arg{
    return nil;
}
@end
