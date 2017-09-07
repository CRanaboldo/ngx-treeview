import { Component, EventEmitter, Input, Output, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { TreeviewItem } from './treeview-item';
import { TreeviewConfig } from './treeview-config';
import { TreeviewComponent } from './treeview.component';
import { DropdownDirective } from './dropdown.directive';
import { TreeviewHeaderTemplateContext } from './treeview-header-template-context';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';

@Component({
    selector: 'ngx-dropdown-treeview',
    templateUrl: './dropdown-treeview.component.html',
    styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent {
    @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
    @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
    @Input() items: TreeviewItem[];
    @Input() config: TreeviewConfig;
    @Input() initialSelItems: string;
    @Input() initialSelText: string;

    @Output() selectedChange = new EventEmitter<any[]>(true);
    @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
    @ViewChild(DropdownDirective) dropdownDirective: DropdownDirective;
    public selText: string = '';

    constructor(
        private defaultConfig: TreeviewConfig
    ) {
        this.config = this.defaultConfig;
    }

    

    onSelectedChange(values: any[]) {
       
        if (this.treeviewComponent.allItem.checked) {
            this.selText =  'All' 
        } else {
            
            switch (this.treeviewComponent.checkedItems.length) {
                case 0:
                    this.selText =  'Select'
                    break;
                case 1:
                    this.selText = this.treeviewComponent.checkedItems[0].text;
                    break;
                default:
                    this.selText = `${this.treeviewComponent.checkedItems.length} options selected`
                }
            }
        if (this.treeviewComponent.config.singleSelect  && values.length> 0 ) this.dropdownDirective.close();
        
        this.selectedChange.emit(values);
    }
}
