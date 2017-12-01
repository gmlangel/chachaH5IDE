//
//  TopView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class TopView: GMLView {
    open var maxHeight:CGFloat = 200;
    open var minHeight:CGFloat = 100;
    override func gml_initialUI() {
        self.bgColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        let bottomLine = NSView(frame: NSZeroRect);
        bottomLine.bgColor = NSColor(cgColor:GMLSkinManager.instance.fengexianColor);
        self.addSubview(bottomLine);
        bottomLine.snp.makeConstraints { (make) in
            make.width.equalTo(self.snp.width);
            make.height.equalTo(1);
            make.bottom.equalTo(self.snp.bottom);
            make.left.equalTo(0);
        }
    }
}
