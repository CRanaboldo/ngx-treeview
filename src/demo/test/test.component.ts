import { Component, OnInit, Input } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from '../../lib';
import { TreeviewData} from "../../lib/treeview-data";
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
   
    constructor(private service: TreeviewData) {}

    async ngOnInit() {
      
        this.items = await this.service.getTree(this.config.url,this.config.treeToLoad, this.config.loadAll, this.selectedItems )
       
    };

    
}
