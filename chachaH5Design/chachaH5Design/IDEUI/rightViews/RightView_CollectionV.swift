//  组件，模板面板
//  RightView_CollectionV.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/3.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation

class RightView_CollectionV: GMLView {
    fileprivate var scrollContainerScroll:NSScrollView!;
    
    fileprivate var container:NSView!;
    
    fileprivate var itemWidth:CGFloat = 60;
    fileprivate var itemHeight:CGFloat = 60;
    override func gml_initialUI() {
        self.bgColor = NSColor.white;
        scrollContainerScroll = NSScrollView(frame: NSZeroRect);
        scrollContainerScroll.hasVerticalScroller = true;
        scrollContainerScroll.autohidesScrollers = false;
        self.addSubview(scrollContainerScroll);
        scrollContainerScroll.contentView.drawsBackground = false;
        scrollContainerScroll.snp.makeConstraints { (make) in
            make.top.equalTo(self);
            make.left.equalTo(self);
            make.bottom.equalTo(self);
            make.right.equalTo(self);
        }
        container = NSView(frame: NSRect(x: 0, y: 0, width: 100, height: 100));
        scrollContainerScroll.documentView = container;
    }
    override func setFrameSize(_ newSize: NSSize) {
        super.setFrameSize(newSize)
        resizeScroll();
    }
    
    override func gml_fillUserInfo(_ userInfo: [AnyHashable : Any]?) {
        //测试代码
        let j = 30;
        for i:Int in 0 ..< j{
            container.addSubview(CollectionItem(frame:NSZeroRect));
        }
        resizeScroll();
    }
    //重新计算滚动条
    func resizeScroll(){
        
        let j = container.subviews.count;
        let w = self.frame.size.width;
        let h = self.frame.size.height;
        var colNum:Int = Int(w / itemWidth);//每行的单元个数
        let colWidth = w / CGFloat(colNum);
        var lineNum = j % colNum > 0 ? (j / colNum) + 1 : (j / colNum);
        let containerHeight = CGFloat(lineNum) * itemHeight;
        //重新计算容器的尺寸
        container.frame.size = NSSize(width:w,height:containerHeight);
        //判断是否需要滚动
        if container.frame.size.height < scrollContainerScroll.frame.size.height{
            self.addSubview(container);
            container.frame.origin.y = h - container.frame.size.height;
        }else{
            container.frame.origin.y = 0;
            scrollContainerScroll.documentView = container;
            scrollContainerScroll.scroll(scrollContainerScroll.contentView, to: NSPoint(x: 0, y: container.frame.size.height - scrollContainerScroll.frame.size.height))
            //NSLog("\(NSPoint(x: 0, y: container.frame.size.height - scrollContainerScroll.frame.size.height))")
        }
        //轮流更改每一个item的尺寸和位置
        let arr = container.subviews;
        for i:Int in 0 ..< j{
            arr[i].frame = NSRect(x: CGFloat(i % colNum) * colWidth, y: containerHeight - CGFloat(Int(i / colNum) + 1) * itemHeight, width: colWidth, height: itemHeight);
        }
    }
}

class CollectionItem:NSImageView{
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect);
        let v = NSView(frame: NSZeroRect);
        v.bgColor = NSColor(red: CGFloat(arc4random() % 255) / 255.0, green: CGFloat(arc4random() % 255) / 255.0, blue: CGFloat(arc4random() % 255) / 255.0, alpha: 1)
        self.addSubview(v);
        v.snp.makeConstraints { (make) in
            make.width.equalTo(40);
            make.height.equalTo(40);
            make.centerX.equalTo(self.snp.centerX);
            make.centerY.equalTo(self.snp.centerY);
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

//class RightView_CollectionV: NSCollectionView,NSCollectionViewDelegate,NSCollectionViewDataSource {
//    func collectionView(_ collectionView: NSCollectionView, numberOfItemsInSection section: Int) -> Int {
//        return 30;
//    }
//    func collectionView(_ collectionView: NSCollectionView, itemForRepresentedObjectAt indexPath: IndexPath) -> NSCollectionViewItem {
//        
//        let v = MyCollectionV(nibName: nil, bundle: nil)!;
//        v.view.frame = NSRect(x:indexPath[0] * 60 ,y:indexPath[1] * 60,width:60,height:60)
//        v.view.bgColor = NSColor.green;
//        NSLog("\(v.view.frame)")
//        return v;
//    }
//    
//    override init(frame frameRect: NSRect) {
//         super.init(frame: frameRect)
//        self.register(MyCollectionV.self, forItemWithIdentifier: "myItem");
//        let myLayout = NSCollectionViewFlowLayout();
//        myLayout.itemSize = NSSize(width: 60, height: 60);
//        self.collectionViewLayout = myLayout;
//        self.dataSource = self;
//        
//    }
//    
//    
//    required init?(coder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//    
//}
//
//class MyCollectionV:NSCollectionViewItem{
//    
//    override init?(nibName nibNameOrNil: String?, bundle nibBundleOrNil: Bundle?) {
//        super.init(nibName: nibNameOrNil, bundle: nibBundleOrNil)
//        self.view = NSView(frame: NSRect(x: 0, y: 0, width: 40, height: 40));
//    }
//    
//    required init?(coder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//    override func viewDidLoad() {
//        super.viewDidLoad();
//    }
//    
//    override func viewWillAppear() {
//        super.viewWillAppear();
//        self.view.bgColor = NSColor.green;
//    }
//}
