//
//  CenterContainerView.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/1.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation
class CenterContainerView: GMLView {
    override func gml_initialUI() {
        let shad = NSShadow();
        shad.shadowBlurRadius = 20;
        shad.shadowColor = NSColor.black;
        self.shadow = shad;
    }
}
