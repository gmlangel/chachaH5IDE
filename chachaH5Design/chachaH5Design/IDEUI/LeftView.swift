//
//  LeftView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class LeftView: GMLView {
    open var maxWidth:CGFloat = 400;
    open var minWidth:CGFloat = 100;
    override func gml_initialUI() {
        self.bgColor = NSColor.white;
        let rightLine = NSView(frame: NSZeroRect);
        rightLine.bgColor = NSColor(cgColor:GMLSkinManager.instance.fengexianColor);
        self.addSubview(rightLine);
        rightLine.snp.makeConstraints { (make) in
            make.width.equalTo(1);
            make.height.equalTo(self.snp.height);
            make.bottom.equalTo(0);
            make.right.equalTo(self.snp.right);
        }
    }
}
