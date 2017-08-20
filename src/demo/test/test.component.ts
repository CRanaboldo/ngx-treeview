import { Component, OnInit, Input } from '@angular/core';
import { TreeviewItem, TreeviewConfig, TreeviewData } from '../../lib';
@Component({
    selector: 'ngx-test',
    templateUrl: './test.component.html',
    providers: [
    ]
})
export class TestComponent implements OnInit {
   
    items: TreeviewItem[]=[];
    values: string[];
    @Input() initialSelItems: string = '';
    @Input() initialSelText: string;
    @Input() config: TreeviewConfig;
   
    constructor(private service: TreeviewData) {}

    async ngOnInit() {
      
        this.items = await this.service.getTree(this.config.url,this.config.treeToLoad, this.config.loadAll, this.initialSelItems )
       
    };

    
}
