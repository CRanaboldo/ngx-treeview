import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, TemplateRef, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewI18n } from './treeview-i18n';
import { TreeviewItem } from './treeview-item';
import { TreeviewConfig } from './treeview-config';
import { TreeviewEventParser } from './treeview-event-parser';
import { TreeviewHeaderTemplateContext } from './treeview-header-template-context';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';
import { TreeviewParserComponent } from './treeview-parser-component';
import { TreeviewData} from "./treeview-data";
import { TreeviewHelper } from "./treeview-helper"
import { TreeItem } from 'ngx-treeview';

class FilterTreeviewItem extends TreeviewItem {
    private readonly refItem: TreeviewItem;
    constructor(item: TreeviewItem) {
        super({
            text: item.text,
            value: item.value,
            disabled: item.disabled,
            checked: item.checked,
            collapsed: item.collapsed,
            children: item.children,
            checkable: item.checkable,
            childOf: item.childOf
        });
        this.refItem = item;
    }

    updateRefChecked() {
        this.children.forEach(child => {
            if (child instanceof FilterTreeviewItem) {
                child.updateRefChecked();
            }
        });

        let refChecked = this.checked;
        for (let i = 0; i < this.refItem.children.length; i++) {
            const refChild = this.refItem.children[i];
            if (!refChild.checked) {
                refChecked = false;
                break;
            }
        }
        this.refItem.checked = refChecked;
    }
}

@Component({
    selector: 'ngx-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnChanges, TreeviewParserComponent, OnInit {
    @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
    @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
    @Input() items: TreeviewItem[];
    @Input() config: TreeviewConfig;
    @Input() initialSelItems: string= '';
    @Input() initialSelText: string= '';

    @Output() selectedChange = new EventEmitter<string>();
    headerTemplateContext: TreeviewHeaderTemplateContext;
    allItem: TreeviewItem;
    filterText = '';
    filterItems: TreeviewItem[];
    checkedItems: TreeviewItem[] = [];
    checkedItm: TreeviewItem;
    
    constructor(
        public i18n: TreeviewI18n,
        private defaultConfig: TreeviewConfig,
        private eventParser: TreeviewEventParser,
        private tvdataSvc: TreeviewData
    ) {
        this.config = this.defaultConfig;
        this.allItem = new TreeviewItem({ text: 'All', value: undefined, checked: false });
        this.createHeaderTemplateContext();
    }

    ngOnInit(){}

    get hasFilterItems(): boolean {
        return !_.isNil(this.filterItems) && this.filterItems.length > 0;
    }

    get maxHeight(): string {
        return `${this.config.maxHeight}`;
    }

    ngOnChanges(changes: SimpleChanges) {
        const itemsSimpleChange = changes['items'];
        if (!_.isNil(itemsSimpleChange)) {
            if (!_.isNil(this.items)) {
                this.updateFilterItems();
                this.updateCollapsedAll();
                this.raiseSelectedChange();
            }
        }
        this.createHeaderTemplateContext();
    }

    onAllCollapseExpand() {
        this.allItem.collapsed = !this.allItem.collapsed;
        this.filterItems.forEach(item => item.setCollapsedRecursive(this.allItem.collapsed));
    }

    onFilterTextChange(text: string) {
        this.filterText = text;
        this.updateFilterItems();
    }

    onAllCheckedChange(checked: boolean) {
        this.filterItems.forEach(item => {
            item.setCheckedRecursive(checked);
            if (item instanceof FilterTreeviewItem) {
                item.updateRefChecked();
            }
        });

        this.raiseSelectedChange();
    }
    
    onCheckedItemChng(event){
        this.checkedItm = event
        this.raiseSelectedChange();
       
    }

    async onExpandedItem(event) {
        let expandedItem: TreeviewItem = event
        if (this.config.singleExpand) {
        for (let i=0;  i< this.filterItems.length; i++)
            {
                if (this.filterItems[i]!==expandedItem) this.filterItems[i].collapsed= true;
            }
        }
        if (expandedItem.hasChildren && _.isNil(expandedItem.children)) {
            expandedItem.children = await this.tvdataSvc.getTree(this.config.url,expandedItem.value,false,this.initialSelItems)
            if (!expandedItem.checkable) expandedItem.checked = false // I am unclear why adding the collection causes checked to be set true 
            this.raiseSelectedChange();
         }
    }
    onItemCheckedChange(item: TreeviewItem, checked: boolean) {
       
        if (this.allItem.checked !== checked) {
            let allItemChecked = true;
            for (let i = 0; i < this.filterItems.length; i++) {
                if (!this.filterItems[i].checked) {
                    allItemChecked = false;
                    break;
                }
            }

            if (this.allItem.checked !== allItemChecked) {
                this.allItem.checked = allItemChecked;
            }
        }
        if (item instanceof FilterTreeviewItem) {
            item.updateRefChecked();
        }
       

        
    }

    raiseSelectedChange() {
        let currentlyChecked: TreeviewItem[];
        currentlyChecked = this.getCheckedItems();
        if (this.checkedItm!==undefined){
            if (this.config.singleSelect && this.checkedItm.checked && currentlyChecked.length> 1) {
                for (let i = currentlyChecked.length-1; i>-1; i--) {
                    if (currentlyChecked[i]!==this.checkedItm) {
                        currentlyChecked[i].checked = false
                    }
                }

            } 
            
        }
        this.checkedItems = currentlyChecked;
       

        var values = this.eventParser.getSelectedChange(this);
        //add back in unloaded elements previously selected
        if(this.tvdataSvc.selV.length==1 && this.tvdataSvc.selV[0].key == '' ){
            var ids = this.tvdataSvc.selV[0].values
            if (_.without(this.tvdataSvc.selV[0].used,true).length> 0 ){
                _.forOwn(this.tvdataSvc.selV[0].used,function(value,key){
                    if (!value) {values[0].push(ids[key])};
                })
            }
        } 

        this.selectedChange.emit(JSON.stringify(values));
       
    }

    private createHeaderTemplateContext() {
        if (this.config.singleSelect) this.config.hasAllCheckBox=false;
        this.headerTemplateContext = {
            config: this.config,
            item: this.allItem,
            onCheckedChange: (checked) => this.onAllCheckedChange(checked),
            onCollapseExpand: () => this.onAllCollapseExpand(),
            onFilterTextChange: (text) => this.onFilterTextChange(text)
        };
    }

    private getCheckedItems(): TreeviewItem[] {
        let checkedItems: TreeviewItem[] = [];
        if (!_.isNil(this.items)) {
            for (let i = 0; i < this.items.length; i++) {
                checkedItems = _.concat(checkedItems, this.items[i].getCheckedItems());
            }
        }

        return checkedItems;
    }

    private updateFilterItems() {
        if (this.filterText !== '') {
            const filterItems: TreeviewItem[] = [];
            const filterText = this.filterText.toLowerCase();
            this.items.forEach(item => {
                const newItem = this.filterItem(item, filterText);
                if (!_.isNil(newItem)) {
                    filterItems.push(newItem);
                }
            });
            this.filterItems = filterItems;
        } else {
            this.filterItems = this.items;
        }

        this.updateCheckedAll();
    }

    private filterItem(item: TreeviewItem, filterText: string): TreeviewItem {
        const isMatch = _.includes(item.text.toLowerCase(), filterText);
        if (isMatch) {
            return item;
        } else {
            if (!_.isNil(item.children)) {
                const children: TreeviewItem[] = [];
                item.children.forEach(child => {
                    const newChild = this.filterItem(child, filterText);
                    if (!_.isNil(newChild)) {
                        children.push(newChild);
                    }
                });
                if (children.length > 0) {
                    const newItem = new FilterTreeviewItem(item);
                    newItem.collapsed = false;
                    newItem.children = children;
                    return newItem;
                }
            }
        }

        return undefined;
    }

    private updateCheckedAll() {
        let hasItemUnchecked = (this.filterItems.length==0)? true: false;
        for (let i = 0; i < this.filterItems.length; i++) {
            if (!this.filterItems[i].checked) {
                hasItemUnchecked = true;
                break;
            }
        }

        if (this.allItem.checked === hasItemUnchecked) {
            this.allItem.checked = !hasItemUnchecked;
        }
    }

    private updateCollapsedAll() {
        let hasItemExpanded = false;
        for (let i = 0; i < this.filterItems.length; i++) {
            if (!this.filterItems[i].collapsed) {
                hasItemExpanded = true;
                break;
            }
        }
        this.allItem.collapsed = !hasItemExpanded;
    }

    
}
