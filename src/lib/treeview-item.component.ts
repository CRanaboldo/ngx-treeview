import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from './treeview-item';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';
import { TreeviewConfig } from './treeview-config';
@Component({
    selector: 'ngx-treeview-item',
    templateUrl: './treeview-item.component.html',
    styleUrls: ['./treeview-item.component.scss']
})
export class TreeviewItemComponent {
    @Input() template: TemplateRef<TreeviewItemTemplateContext>;
    @Input() item: TreeviewItem;
    @Input() config: TreeviewConfig;
    @Output() checkedChange = new EventEmitter<boolean>();
    @Output() checkedItem = new EventEmitter<TreeviewItem>();
    @Output() expandedItem = new EventEmitter<TreeviewItem>();
    onCollapseExpand = () => {
        this.item.collapsed = !this.item.collapsed;
        if (!this.item.collapsed) this.expandedItem.emit(this.item);
    }

    

    onCheckedChange = () => {
        
        const checked = this.item.checked;
        if (!_.isNil(this.item.children) && !this.config.singleSelect) {
            this.item.children.forEach(child => child.setCheckedRecursive(checked));
        
                } 
            if (this.config.singleSelect && this.item.checked && !_.isNil(this.item.children)) this.item.checked=false;
            
            this.checkedChange.emit(this.item.checked);
            this.checkedItem.emit(this.item);
            

    }
// these are for recurrsion to higher levels in deep trees
    onCheckedItem(Item:TreeviewItem){
       
        this.checkedItem.emit(Item)
        
    }

    onExpandedItem(Item:TreeviewItem){
       
        this.expandedItem.emit(Item)
        
    }
    onChildCheckedChange(child: TreeviewItem, checked: boolean) {
        if (this.item.checked !== checked) {
            let itemChecked = true;
            for (let i = 0; i < this.item.children.length; i++) {
                if (!this.item.children[i].checked) {
                    itemChecked = false;
                    break;
                }
            }

            this.item.checked = itemChecked;
        }

        this.checkedChange.emit(checked);
    }
}
