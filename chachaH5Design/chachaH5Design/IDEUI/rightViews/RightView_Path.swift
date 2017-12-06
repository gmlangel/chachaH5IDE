//
//  RightView_Path.swift
//  chachaH5Design
//
//  Created by guominglong on 2017/12/3.
//  Copyright © 2017年 SSdk. All rights reserved.
//

import Foundation


class RightView_Path: GMLView,NSOutlineViewDataSource,NSOutlineViewDelegate {
    fileprivate var lineHeight:CGFloat = 20;
    fileprivate var contentV:NSOutlineView!;
    fileprivate var scroll:NSScrollView!;
    fileprivate var pathData:PathData?;
    override func gml_initialUI() {
        super.gml_initialUI();
        
        scroll = NSScrollView(frame:NSZeroRect);
        scroll.contentView.drawsBackground = false;
        self.addSubview(scroll);
        scroll.snp.makeConstraints { (make) in
            make.top.equalTo(self);
            make.bottom.equalTo(self);
            make.left.equalTo(self);
            make.right.equalTo(self);
        }
        
        contentV = NSOutlineView(frame:NSZeroRect);
        contentV.backgroundColor = NSColor.clear;
        contentV.gridColor = NSColor.red;
        contentV.dataSource = self;
        contentV.delegate = self;
        contentV.enclosingScrollView?.backgroundColor = NSColor.clear;
        contentV.enclosingScrollView?.drawsBackground = false;
        scroll.documentView = contentV;
    }
    override func gml_fillUserInfo(_ userInfo: [AnyHashable : Any]?) {
        if let data = userInfo?["data"] as? PathData{
            pathData = data;
            contentV.reloadData();//刷新显示列表
        }
    }
    //MARK:DataSource---------------------
    /**
     返回给定项目包含的子项目的数量。
     */
    func outlineView(_ outlineView: NSOutlineView, numberOfChildrenOfItem item: Any?) -> Int{
        //gml=====>1
        if item == nil{
            if self.pathData != nil{
                return 1;
            }else{
                return 0;
            }
        }else{
            if let subPathData = item as? PathData,let subsubs = subPathData.childrenPathArr{
                return subsubs.count;
            }
            return 0;
        }
        
    }
    
    /**
     返回给定项目的指定索引处的子项目。
     给定父项的子项顺序访问。 为了使大纲视图的折叠状态在重新加载时保持一致，您必须始终返回指定子项和项目的相同对象。
     */
    func outlineView(_ outlineView: NSOutlineView, child index: Int, ofItem item: Any?) -> Any{
        //gml=====>2
        if self.pathData != nil{
            if item == nil && index == 0{
                return self.pathData!;
            }else if let pd = item as? PathData,let subs = pd.childrenPathArr,subs.count > index{
                return subs[index];
            }
            return "";
            
        }else{
            return "";
        }
        
    }
    
    
    /**
     返回一个布尔值，该值指示给定项目是否可展开。
     这个方法可能经常被调用，所以它必须是有效的。
     */
    func outlineView(_ outlineView: NSOutlineView, isItemExpandable item: Any) -> Bool{
        if let pd = item as? PathData,pd.fileType == .Dir{
            return true
        }
        return false;//gml=====>6
    }
    
    /**
     由outlineView调用返回与指定项关联的数据对象。
     该项目位于视图的指定tableColumn中。
     */
    func outlineView(_ outlineView: NSOutlineView, objectValueFor tableColumn: NSTableColumn?, byItem item: Any?) -> Any?{
        return nil;
    }
    
    /**
     为给定列中的给定项目设置数据对象。
     该项目位于视图的指定tableColumn中。
     */
    func outlineView(_ outlineView: NSOutlineView, setObjectValue object: Any?, for tableColumn: NSTableColumn?, byItem item: Any?){
        NSLog("3");
    }
    
    /**
     1.由outlineView调用以返回归档对象的项目。
     当大纲视图恢复保存的扩展项目时，将为每个扩展项目调用此方法，以将存档的对象转换为大纲视图项目。
     2.返回nil表示该项目不再存在，并且不会被重新展开。
     */
    func outlineView(_ outlineView: NSOutlineView, itemForPersistentObject object: Any) -> Any?{
        return nil;
    }
    
    /**
     1.由outlineView调用以返回项目的存档对象。
     当大纲视图保存扩展项目时，将为每个扩展项目调用此方法，以将大纲视图项目转换为归档对象。
     2.返回nil表示该项目的状态不会被保留。
     */
    func outlineView(_ outlineView: NSOutlineView, persistentObjectForItem item: Any?) -> Any?{
        return nil;
    }
    
    /**
     1.由大纲视图调用以通知数据源描述符已更改，并且可能需要使用数据。
     数据源通常会对数据进行排序和重新加载，并相应地调整选择。 如果您需要知道当前的排序描述符，而数据源本身不管理它们，则可以通过发送sortDescriptors消息来获取outlineView的当前排序描述符。
     2.排序支持,这表示需要进行分类。 通常情况下，数据源将对数据进行排序，重新加载和调整选择。
     */
    func outlineView(_ outlineView: NSOutlineView, sortDescriptorsDidChange oldDescriptors: [NSSortDescriptor]){
        NSLog("ddd");
    }
    
    /**
     1.实现此方法以使表成为支持拖动多个项目的NSDraggingSource。
     如果实现此方法，则不调用outlineView（_：writeItems：to :)。
     2.拖动源支持 - 拖放多图像是必需的。 实现此方法允许表是一个支持多项拖动的NSDraggingSource。 返回实现NSPasteboardWriting的自定义对象（或简单地使用NSPasteboardItem）。 返回零以防止特定项目被拖动。 如果实现此方法，那么outlineView：writeItems：toPasteboard：将不会被调用。
     */
    func outlineView(_ outlineView: NSOutlineView, pasteboardWriterForItem item: Any) -> NSPasteboardWriting?{
        if let pd = item as? PathData,pd.fileType == .File{
            return pd.fullPath as NSPasteboardWriting?
        }
        return nil;
    }
    
    /**
     1.实现此方法知道给定的拖动会话何时即将开始并可能修改拖动会话。
     draggedItems数组直接匹配用于开始拖动会话的粘贴板编写器数组与NSView方法beginDraggingSession（使用：event：source :)。 因此，顺序是确定性的，在枚举NSDraggingInfo协议的粘贴板类时，可以在outlineView（_：acceptDrop：item：childIndex :)中使用
     2.拖动源支持 - 可选。 知道什么时候拖动会话即将开始，并且可能修改拖动会话。 “draggedItems”是我们拖动的项目数组，不包括由于outlineView：pasteboardWriterForItem：返回nil而未拖动的项目。 该数组将直接将用于开始拖动会话的粘贴板编写器数组与[NSView beginDraggingSessionWithItems：event：source]匹配。 因此，顺序是确定性的，可以用在-outlineView：acceptDrop：item：childIndex：枚举NSDraggingInfo的粘贴板类时。
     */
    func outlineView(_ outlineView: NSOutlineView, draggingSession session: NSDraggingSession, willBeginAt screenPoint: NSPoint, forItems draggedItems: [Any]){
        NSLog("4")
    }
    
    /**
     1.实现此方法知道给定的拖动会话何时结束。
     您可以实现此可选的委托方法，以了解拖动源操作何时在特定位置（例如垃圾桶（通过检查删除操作））结束。
     2.拖动源支持 - 可选。 实现这个方法知道什么时候拖动会话已经结束。 这个委托方法可以用来知道什么时候拖动源操作在特定位置结束，比如垃圾（通过检查NSDragOperationDelete的操作）。
     */
    func outlineView(_ outlineView: NSOutlineView, draggingSession session: NSDraggingSession, endedAt screenPoint: NSPoint, operation: NSDragOperation){
        NSLog("5")
       
    }

    /**
     1.返回一个布尔值，指示是否允许拖动操作。
     在确定拖动应该开始之后，但在拖动开始之前，由outlineView调用。
     要拒绝拖动，请返回false。 要开始拖动，请返回true并将拖动数据放置到纸板（数据，所有者等）上。 一旦该调用返回true，拖动图像和其他拖动相关的信息将被设置并由大纲视图提供
     2.拖动源支持 - 可选单一图像拖动。 该方法在确定拖动应该开始之后，但在拖动开始之前被调用。 要拒绝拖延，请退回NO。 要开始拖动，返回YES并将拖动数据放到粘贴板（数据，所有者等等）上。 一旦该呼叫返回YES，拖动图像和其他与拖动有关的信息将被设置并由大纲视图提供。 items数组是将要参与拖动的项目的列表。
     */
    func outlineView(_ outlineView: NSOutlineView, writeItems items: [Any], to pasteboard: NSPasteboard) -> Bool{
        return false;
    }
    
    
    /**
     1.实现此方法，使表能够在拖动视图时更新拖动项目。
     实现这种方法是多图拖动所必需的。 一个典型的实现调用传入的拖动信息对象的enumerateDraggingItems（options：for：classes：searchOptions：using :)方法，并根据内容将拖动项目的imageComponentsProvider属性设置为适当的图像。 对于基于NSView的表格视图，可以使用NSTableCellView方法draggingImageComponents。
     2.拖动目标支持 - 拖放多个图像时需要。 实现此方法以允许表在项目被拖到视图上时更新拖动项目。 通常这将涉及调用[draggingInfo enumerateDraggingItemsWithOptions：forView：classes：searchOptions：usingBlock：]并将draggingItem的imageComponentsProvider设置为基于内容的正确图像。 对于基于View的TableView，可以使用NSTableCellView的-draggingImageComponents和-draggingImageFrame。
     */
    func outlineView(_ outlineView: NSOutlineView, updateDraggingItemsForDrag draggingInfo: NSDraggingInfo){
    NSLog("5")
    }
    
    /**
     1.由大纲视图使用来确定有效的放置目标。
     基于鼠标位置，大纲视图将建议一个建议的放置位置。 如果需要，数据源可以通过调用setDropItem（_：dropChildIndex :)并返回除NSDragOperationNone以外的内容来“调整”下降。 您可能会选择重定向，出于各种原因（例如，为了在插入排序位置时获得更好的视觉反馈）。
     这个方法的实现是可选的。
     2.拖动目标支持 - NSOutlineView使用此方法确定有效的放置目标。 基于鼠标的位置，大纲视图将建议一个提议的孩子“索引”，以便作为“项目”的孩子发生下降。 此方法必须返回一个值，指示数据源将执行哪个NSDragOperation。 如果需要，数据源可以通过调用setDropItem：dropChildIndex：并返回非NSDragOperationNone的内容来“重新定位”一个drop。 人们可以选择因各种原因而重新定位（例如，当插入排序位置时为了获得更好的视觉反馈）。 在Leopard链接的应用程序中，仅当拖动位置更改或拖动操作更改（即：按下修改键）时才会调用此方法。 在Leopard之前，不管属性如何变化，都会在计时器中不断调用。
     */
    func outlineView(_ outlineView: NSOutlineView, validateDrop info: NSDraggingInfo, proposedItem item: Any?, proposedChildIndex index: Int) -> NSDragOperation{
        return NSDragOperation.move;
    }
    
    /**
     1.返回一个布尔值，指示放置操作是否成功。
     数据源应该在拖拽的粘贴板中实现这个方法。 您可以使用draggingPasteboard（）方法从信息中获取放置操作的数据。
     返回值表示拖放操作对系统的成功或失败。
     2.拖动目标支持 - 当鼠标悬停在大纲视图上时，将调用此方法，该大纲视图先前决定允许通过validateDrop方法拖放。 数据源此时应该包含来自拖动纸板的数据。 'index'是将数据作为'item'的子元素插入的位置，是之前在validateDrop：方法中设置的值。
     */
    func outlineView(_ outlineView: NSOutlineView, acceptDrop info: NSDraggingInfo, item: Any?, childIndex index: Int) -> Bool{
        return true;
    }
    
    /**
     1.返回接收者承诺创建的文件的文件名数组。
     有关文件承诺拖动的更多信息，请参阅有关NSDraggingSource协议和namesOfPromisedFilesDropped（atDestination :)的文档。
     2.拖动目标支持 - 通过将NSFilesPromisePboardType添加到outlineView：writeItems：toPasteboard：中的粘贴板，NSOutlineView数据源对象可以支持文件承诺的拖动。 NSOutlineView实现了-namesOfPromisedFilesDroppedAtDestination：返回这个数据源方法的结果。 此方法应该为创建的文件返回一个文件名数组（仅文件名，而不是完整路径）。 该URL代表放置位置。 有关文件承诺拖动的更多信息，请参阅有关NSDraggingSource协议和-namesOfPromisedFilesDroppedAtDestination：的文档。
     */
    func outlineView(_ outlineView: NSOutlineView, namesOfPromisedFilesDroppedAtDestination dropDestination: URL, forDraggedItems items: [Any]) -> [String]{
        return ["aaa","bbb","ccc"];
    }
    
    
    //MARK:Delegate---------------------
    /**
     实现返回用于显示指定的项目和列的视图。
     如果您希望在大纲视图中使用NSView对象而不是NSCell对象，则此方法是必需的。单元格和视图不能在同一个大纲视图中混合使用。
     建议此方法的实现首先调用NSTableView方法make（withIdentifier：owner :)分别传递tableColumn参数的标识符和self作为所有者，以尝试重用不再可见的视图。该方法返回的视图的框架并不重要，并由大纲视图自动设置。
     在返回结果之前，应该正确设置视图的属性。
     当使用Cocoa绑定时，如果在设计时至少有一个标识符与表视图关联，则此方法是可选的。如果未实现此方法，则大纲视图会自动使用tableColumn参数的标识符和大纲视图的委托作为参数调用make（withIdentifier：owner :)，以试图重用先前的视图或自动解除与表视图关联的原型。
     返回视图的autoresizingMask会自动设置为viewHeightSizable，以便在行高更改时正确调整大小。
     */
    func outlineView(_ outlineView: NSOutlineView, viewFor tableColumn: NSTableColumn?, item: Any) -> NSView?{
        //gml=====>8
        if let pd = item as? PathData{
            let v = NSView(frame:NSRect(x: 0, y: 0, width: 100, height: 100));//outlineView.make(withIdentifier: tableColumn!.identifier, owner: self)
            let tb = NSTextField(frame:NSRect(x: 0, y: 0, width: 100, height: lineHeight));
            tb.stringValue = pd.fileName;
            tb.isBordered = false;
            tb.backgroundColor = NSColor.clear;
            tb.textColor = NSColor.black;
            tb.font = NSFont.systemFont(ofSize: 12);
            tb.alignment = .left
            v.addSubview(tb);
            tb.snp.makeConstraints({ (make) in
                make.height.equalTo(lineHeight);
                make.width.equalTo(v);
                make.left.equalTo(v);
                make.top.equalTo(v);
            })
            return v;
        }else{
            return nil;
        }
        
    }
    
    /**
     实现此方法为特定项目返回自定义NSTableRowView。
     此方法（如果已实现）仅针对基于NSView的大纲视图进行调用。
     */
    func outlineView(_ outlineView: NSOutlineView, rowViewForItem item: Any) -> NSTableRowView?{
        //gml=====>5
        if let pd = item as? PathData{
            let v = NSTableRowView(frame: NSZeroRect);
            v.bgColor = NSColor.green;
//            v.backgroundColor = NSColor.green;
//            v.selectionHighlightStyle = .none;
//            v.isEmphasized = true;
            return v;
        }else{
            return nil;
        }
        
    }
    
    /**
     1.实现了知道何时将新的行视图添加到表中。
     此委托方法适用于基于NSView的大纲视图。 此时，您可以选择添加额外的视图或修改rowView上的任何属性。
     2.当成功的添加了一个row
     */
    func outlineView(_ outlineView: NSOutlineView, didAdd rowView: NSTableRowView, forRow row: Int){
        //gml=====>9
        if rowView.subviews.count > 0{
            let subV = rowView.subviews[0];
            subV.snp.removeConstraints();
            subV.snp.makeConstraints({ (make) in
                make.left.equalTo(subV.frame.origin.x);
                make.right.equalTo(rowView);
                make.bottom.equalTo(rowView).offset(-subV.frame.origin.y);
                make.height.equalTo(subV.frame.size.height);
            })
        }
    }
    
    /**
     1.当成功了移除了一个row
     */
    func outlineView(_ outlineView: NSOutlineView, didRemove rowView: NSTableRowView, forRow row: Int){
    NSLog("5")
    }
    
    /**
     通知委托人将显示由列和项目指定的单元格。
     委托可以实现这个方法来修改单元格，为tableColumn和item中的单元格提供进一步的设置。 在这个方法里面绘图是不安全的 - 你只应该为单元格设置状态。
     */
    func outlineView(_ outlineView: NSOutlineView, willDisplayCell cell: Any, for tableColumn: NSTableColumn?, item: Any){
        NSLog("aa");
    }
    

    
    /**
     是否允许编辑某个单元项
     */
    func outlineView(_ outlineView: NSOutlineView, shouldEdit tableColumn: NSTableColumn?, item: Any) -> Bool{
        return true;
    }
    
    /**
     做编辑时的正则验证，允许正确格式的数据编辑，禁止不正确数据格式编辑
     */
    func selectionShouldChange(in outlineView: NSOutlineView) -> Bool{
        return false;
    }
    
    /**
     1.返回一个布尔值，该值指示大纲视图是否应选择给定的项目。
     你实现这个方法来禁止选择特定的项目。
     为了获得更好的性能和更好的纹理控制，请使用outlineView（_：dataCellFor：item :)。
     2.如果选择“项目”则返回“是”，否则返回“否”。 为了获得更好的性能和更好的控制，建议您使用outlineView：selectionIndexesForProposedSelection :.
     */
    func outlineView(_ outlineView: NSOutlineView, shouldSelectItem item: Any) -> Bool{
        return true;
    }
    
//    /**
//     1.当用户用键盘或鼠标改变选择时，返回一组新索引。 如果实现，将调用此方法而不是outlineView：shouldSelectItem :. 这种方法可以被多次调用，一个新的索引添加到现有的选择，以确定当用户使用键盘或鼠标扩展选择时是否可以选择特定的索引。 请注意，“proposedSelectionIndexes”将包含整个新建议的选择，您可以返回现有的选择以避免更改选择。
//     */
//    func outlineView(_ outlineView: NSOutlineView, selectionIndexesForProposedSelection proposedSelectionIndexes: IndexSet) -> IndexSet{
//        
//    }
    
    /**
     返回一个布尔值，该值指示大纲视图是否应选择给定的表列。
     委托可以实现这个方法来禁止选择特定的列。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldSelect tableColumn: NSTableColumn?) -> Bool{
        return true;
    }
    
    /**
     点击标题时触发
     */
    func outlineView(_ outlineView: NSOutlineView, mouseDownInHeaderOf tableColumn: NSTableColumn){
        NSLog("5")
    }
    
    /**
     点击某个内容列时触发
     */
    func outlineView(_ outlineView: NSOutlineView, didClick tableColumn: NSTableColumn){
        NSLog("5")
    }
    
    /**
     拖拽某个列时触发
     */
    func outlineView(_ outlineView: NSOutlineView, didDrag tableColumn: NSTableColumn){
    NSLog("5")
    }
    
    /**
     1.鼠标停留在某列时的tips提示
     2.当用户暂停单元格时，从该方法返回的值将显示在工具提示中。 “点”代表视图坐标中的当前鼠标位置。 如果您不想在该位置提供工具提示，请返回零或空字符串。 在进入时，“矩形”表示提示的提议活动区域。 默认情况下，rect计算为[cell drawingRectForBounds：cellFrame]。 要控制默认的活动区域，您可以修改'rect'参数。
     */
    func outlineView(_ outlineView: NSOutlineView, toolTipFor cell: NSCell, rect: NSRectPointer, tableColumn: NSTableColumn?, item: Any, mouseLocation: NSPoint) -> String{
        return "";
    }
    
    /**
     返回包含项目的行的高度。
     此方法返回的值不应包含单元格间距，并且必须大于0。
     实现此方法以支持具有不同行高的大纲视图。
     对于特别大的表格，你应该确保这个方法是有效的。 NSOutlineView可以缓存这个方法返回的值，所以如果你想改变一个行的高度，请确保通过调用noteHeightOfRows（withIndexesChanged :)来使行高度无效。 NSOutlineView自动使其reloadData（）和noteNumberOfRowsChanged（）中的整个行高度缓存失效。
     如果在此方法的实现中调用view（atColumn：row：makeIfNecessary :)或rowView（atRow：makeIfNecessary :)，则会引发异常。
     重要
     为避免意外递归导致挂起的可能性，请不要调用几何计算方法，例如bounds，rect（ofColumn :)，或者在实现此方法的过程中调用tile（）的任何NSTableView方法
     */
    func outlineView(_ outlineView: NSOutlineView, heightOfRowByItem item: Any) -> CGFloat{
        return lineHeight;//gml=====>4
    }
    
    /**
     返回用于给定列和项目的类型选择的字符串。
     如果要控制用于类型选择的字符串，请实现此方法。 您可能希望根据显示的内容更改要搜索的内容，或者直接返回nil来指定不应搜索给定的行和/或列。 默认情况下，搜索所有包含文本的单元格
     */
    func outlineView(_ outlineView: NSOutlineView, typeSelectStringFor tableColumn: NSTableColumn?, item: Any) -> String?{
        return nil;
    }
    
//    /**
//     从startItem到endItem的范围内返回与searchString匹配的第一个项目
//     如果要控制类型选择的工作方式，请实现此方法。 您应该包含startItem作为可能的匹配，但不包含endItem。
//     为了支持类型选择，没有必要实现这个方法。
//     */
//    func outlineView(_ outlineView: NSOutlineView, nextTypeSelectMatchFromItem startItem: Any, toItem endItem: Any, for searchString: String) -> Any?{
//    
//    }
    
    /**
     返回一个布尔值，该值指示类型选择是否应针对给定事件和搜索字符串进行。
     一般来说，这个方法将从keyDown（with :)中调用，事件将是一个关键事件。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldTypeSelectFor event: NSEvent, withCurrentSearch searchString: String?) -> Bool{
        return true;
    }
    
    /**
     调用以允许委托控制特定列和项目的单元格扩展。
     当鼠标悬停在指定的单元格上并且单元格内容无法在单元格内完全显示时，可能会发生单元格展开。 如果此方法返回true，则全部单元格内容将显示在特殊的浮动工具尖端视图中，否则内容将被截断。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldShowCellExpansionFor tableColumn: NSTableColumn?, item: Any) -> Bool{
        return false;
    }
    
    /**
     返回一个布尔值，指示是否应该跟踪给定的单元格。
     通常情况下，只能选择或选择的单元格可以被跟踪。 如果实施这种方法，可以跟踪不可选或不可选的单元格（反之亦然）。 例如，这可以让你在表格中有一个按钮单元，它不会改变选择，但仍然可以被点击和跟踪。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldTrackCell cell: NSCell, for tableColumn: NSTableColumn?, item: Any) -> Bool{
        return true;
    }
    
    /**
     返回给定项目的给定列中使用的单元格。
     您可以为表格列和项目的任何特定组合或者将用于整行（全宽单元格）的单元格返回不同的数据单元格。 如果tableColumn非零，你应该返回一个单元格。 通常，您应该默认从[tableColumn dataCellForRow：row]返回结果。
     当每一行（由项目标识）正在绘制时，首先调用此方法，并为tableColumn指定一个零值。 此时，您可以返回一个用于绘制整行的单元格，就像一个组。 如果您返回nil表列的单元格，则必须准备好您的其他相应数据源和委托方法的实现，以针对tableColumn调用nil值。 如果不返回nil表列的单元格，则像平常一样，在大纲视图中为每列调用一次该方法。
     */
    func outlineView(_ outlineView: NSOutlineView, dataCellFor tableColumn: NSTableColumn?, item: Any) -> NSCell?{
        if let cell = tableColumn?.dataCell(forRow: 0) as? NSCell{
            return cell;
        }
        return nil;
    }
    
    /**
     返回一个布尔值，指示给定的行是否应以“组行”样式绘制。
     如果该行中的单元格是NSTextFieldCell的一个实例，并且只包含一个字符串值，那么将自动为该单元格应用“组行”样式属性。
     */
    func outlineView(_ outlineView: NSOutlineView, isGroupItem item: Any) -> Bool{
        return true;//gml=====>3
    }
    
    /**
     返回一个布尔值，该值指示大纲视图是否应展开给定的项目。
     代表可以实现这个方法来禁止扩展特定项目。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldExpandItem item: Any) -> Bool{
        if let pd = item as? PathData,pd.fileType == .Dir{
            return true;
        }
        return false;
    }
    
    /**
     Returns a Boolean value that indicates whether the outline view should collapse a given item.
     The delegate can implement this method to disallow collapsing of specific items. For example, if the first row of your outline view should not be collapsed, your delegate method could contain this line of code:
     return [outlineView rowForItem:item]!=0;
     */
    func outlineView(_ outlineView: NSOutlineView, shouldCollapseItem item: Any) -> Bool{
        return true;
    }
    
    /**
     通知委托人大纲视图即将显示用于绘制展开符号的单元格。
     通知委托人outlineView即将显示单元格 - 可扩展单元格（具有扩展符号的单元格） - 由tableColumn和item指定的列和项目。 委托可以修改单元格来改变其显示属性。
     outlineView即将显示不可展开的单元格时，不会调用此方法
     */
    func outlineView(_ outlineView: NSOutlineView, willDisplayOutlineCell cell: Any, for tableColumn: NSTableColumn?, item: Any){
        NSLog("ddd");
    }
    
//    /**
//     被调用来允许代理提供自定义的大小调整行为当一个列的调整大小分隔符被双击。
//     默认情况下，NSOutlineView迭代表中的每一行，通过prepareCell（atColumn：row :)访问单元格，并请求cellSize找到适当的最大宽度来使用。
//     为了获得准确的结果和性能，建议在使用大型表格时实施此方法。 默认情况下，大表使用蒙特卡罗模拟，而不是迭代每一行。
//     */
//    func outlineView(_ outlineView: NSOutlineView, sizeToFitWidthOfColumn column: Int) -> CGFloat{
//    
//    }
    
    /**
     发送给委托以允许或禁止指定的列被拖动到新的位置。
     最初由用户拖动列时，首先使用newColumnIndex值-1调用委托。 返回false将不允许该列被重新排序。 返回true将允许重新排序，并且在列到达新位置时再次调用该委托。
     实际的NSTableColumn实例可以从tableColumns数组中检索。
     如果此方法未实现，则所有列都被视为可重新订购。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldReorderColumn columnIndex: Int, toColumn newColumnIndex: Int) -> Bool{
        return true;
    }
    
    /**
     返回指定项目是否应显示轮廓单元格（显示三角形）。
     返回false导致frameOfOutlineCell（atRow :)返回NSZeroRect，隐藏单元格。 另外，该行不能通过键盘快捷方式折叠。
     这种方法仅适用于可展开的行。
     */
    func outlineView(_ outlineView: NSOutlineView, shouldShowOutlineCellForItem item: Any) -> Bool{
        if let pd = item as? PathData,pd.fileType == .Dir{
            return true;
        }
        return false;//gml=====>7
    }
}



//class ProjectItem:NSTable{
//    override init(frame frameRect: NSRect) {
//        super.init(frame:frameRect);
//        self.bgColor = NSColor.red;
//    }
//    
//    required init?(coder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//}
