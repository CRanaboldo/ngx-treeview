import { Component, OnInit, Input } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from '../../lib';
import { treeviewdataService} from "../../lib/treeview-data.service";
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    providers: [
    ]
})
export class TestComponent implements OnInit {
   
    items: TreeviewItem[]=[];
    values: string[];
    @Input() selectedItems: string;
    @Input() config: TreeviewConfig;
   
    constructor(private service: treeviewdataService) {}

    async ngOnInit() {
      
        this.items = await this.service.getTree(this.config.treeToLoad, this.config.loadAll, this.selectedItems )
       
    };

    
}
