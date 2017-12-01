//
//  GMLEvent.m
//  MyTalk
//
//  Created by guominglong on 16/5/9.
//  Copyright © 2016年 guominglong. All rights reserved.
//

#import "GMLEvent.h"

@implementation GMLEvent

-(NSString *)eventType{
    return _eventType;
}

-(id __nullable)data{
    return _data;
}

-(NSResponder * __nullable)target{
    return _target;
}

-(instancetype)initWithEventType:(NSString *)_et target:(NSResponder * __nullable)_tg data:(id __nullable)_da
{
    self = [super init];
    if(self){
        _eventType = _et;
        _target = _tg;
        _data = _da;
    }
    return self;
}


@end

@implementation GMLProgressEvent

-(CGFloat)loadedBytes{
    return _loadedBytes;
}

-(CGFloat)totalBytes{
    return _totalBytes;
}

-(instancetype)initWithBytesState:(NSString *)_eventType loadedBytes:(CGFloat)_lb totalBytes:(CGFloat)_tb{

    self = [super initWithEventType:_eventType target:nil data:nil];
    if(self)
    {
        _loadedBytes = _lb;
        _totalBytes = _tb;
    }
    return self;
}

@end







