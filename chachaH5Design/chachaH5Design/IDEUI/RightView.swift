//
//  RightView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class RightView: GMLView {
    open var maxWidth:CGFloat = 300;
    open var minWidth:CGFloat = 200;
    override func gml_initialUI() {
        self.bgColor = NSColor(cgColor:GMLSkinManager.instance.mainForegroundColor);
        let leftLine = NSView(frame: NSZeroRect);
        leftLine.bgColor = NSColor(cgColor:GMLSkinManager.instance.fengexianColor);
        self.addSubview(leftLine);
        leftLine.snp.makeConstraints { (make) in
            make.width.equalTo(1);
            make.height.equalTo(self.snp.height);
            make.bottom.equalTo(0);
            make.left.equalTo(self.snp.left);
        }
    }
}
