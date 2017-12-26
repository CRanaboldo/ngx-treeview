import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewParserComponent } from './treeview-parser-component';
import { TreeviewItem } from './treeview-item';

@Injectable()
export abstract class TreeviewEventParser {
    abstract getSelectedChange(component: TreeviewParserComponent): any[];
}

@Injectable()
export class DefaultTreeviewEventParser extends TreeviewEventParser {
   
    getSelectedChange(component: TreeviewParserComponent): any[] {
        // handels all shapes of tree
        const checkedItems = component.checkedItems;
        var out:any = new Array();
        if (!_.isNil(checkedItems)) {
            var selItems:string[]= [];
            for(var i = 0; i < checkedItems.length; i++){
                var obj = checkedItems[i]
                if (!_.isNull(obj.parent)) {
                if (obj.parent.parent== null){
                        var child ={}
                        if (child[obj.parentName]==undefined) child[obj.parentName]= obj.value
                        
                        for(var j = 0; j < checkedItems.length; j++){
                            var o = checkedItems[j]
                            if (o.childOf==obj.value){
                                if (child[o.parentName] ==undefined ) child[o.parentName] = this.getAll(checkedItems,obj.value, o.parent.value)
                            }
                        }
                        out.push(child)
                    }
                } else {selItems.push(obj.value)}
            }
            if (_.isEmpty(out)) {out.push(selItems)}
        }
        
        return out;
    }

    
    private getAll(checkedItems:TreeviewItem[], idx: string, p: string): any[] {
        let r=[];
        for(var j = 0; j < checkedItems.length; j++){
            var o = checkedItems[j]
            if (o.childOf==idx && o.parent.value==p) r.push(o.value)
        }
        return r;
    }

}





export interface DownlineTreeviewItem {
    item: TreeviewItem;
    parent: DownlineTreeviewItem;
}

@Injectable()
export class DownlineTreeviewEventParser extends TreeviewEventParser {
    getSelectedChange(component: TreeviewParserComponent): any[] {
        const items = component.items;
        if (!_.isNil(items)) {
            let result: DownlineTreeviewItem[] = [];
            items.forEach(item => {
                const links = this.getLinks(item, null);
                if (!_.isNil(links)) {
                    result = result.concat(links);
                }
            });

            return result;
        }

        return [];
    }

    private getLinks(item: TreeviewItem, parent: DownlineTreeviewItem): DownlineTreeviewItem[] {
        if (!_.isNil(item.children)) {
            const link = {
                item: item,
                parent: parent
            };
            let result: DownlineTreeviewItem[] = [];
            item.children.forEach(child => {
                const links = this.getLinks(child, link);
                if (!_.isNil(links)) {
                    result = result.concat(links);
                }
            });

            return result;
        }

        if (item.checked) {
            return [{
                item: item,
                parent: parent
            }];
        }

        return null;
    }
}

@Injectable()
export class OrderDownlineTreeviewEventParser extends TreeviewEventParser {
    private currentDownlines: DownlineTreeviewItem[] = [];
    private parser = new DownlineTreeviewEventParser();

    getSelectedChange(component: TreeviewParserComponent): any[] {
        const newDownlines: DownlineTreeviewItem[] = this.parser.getSelectedChange(component);
        if (this.currentDownlines.length === 0) {
            this.currentDownlines = newDownlines;
        } else {
            const intersectDownlines: DownlineTreeviewItem[] = [];
            this.currentDownlines.forEach(downline => {
                let foundIndex = -1;
                const length = newDownlines.length;
                for (let i = 0; i < length; i++) {
                    if (downline.item.value === newDownlines[i].item.value) {
                        foundIndex = i;
                        break;
                    }
                }

                if (foundIndex !== -1) {
                    intersectDownlines.push(newDownlines[foundIndex]);
                    newDownlines.splice(foundIndex, 1);
                }
            });

            this.currentDownlines = intersectDownlines.concat(newDownlines);
        }

        return this.currentDownlines;
    }
}
