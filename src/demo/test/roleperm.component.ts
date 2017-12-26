import { Component, OnInit, Input } from '@angular/core';
import { TreeviewItem, TreeviewConfig, TreeviewData } from '../../lib';
@Component({
    selector: 'ngx-role',
    templateUrl: './RolePerm.component.html',
    providers: [
    ]
})
export class RolePermComponent implements OnInit {
   
    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        singleSelect: false,
        singleExpand: false,
        selectBranch: false,
        selectParents: true,
        maxHeight: 800,
        loadAll: false,
        treeToLoad: 'F9FCBDC6-D437-E511-B85E-C860006E1E2F',
        url: 'http://localhost:56783/api/DDSLists/RolePermissions'
    });

    // treeToLoad: 'F9FCBDC6-D437-E511-B85E-C860006E1E2F',
    //  url: 'http://localhost:56783/api/DDSLists/Tree' 
    
    // url: 'http://localhost:56783/api/DDSLists/RolePermissions'
    
    
    items: TreeviewItem[]=[];
    values: string;
    //NB if empty use '[]'
    @Input() initialSelItems: string = '[]';
   //["603d7fc9-affb-4721-8a0e-3ada728d905e","2a360a8a-56e7-49b2-944f-4be98b31a9da","6514d851-b500-400a-9726-3835afed652e"]
    constructor(private service: TreeviewData) {}

    async ngOnInit() {
      
        this.items = await this.service.getTree(this.config.url,this.config.treeToLoad, this.config.loadAll, this.initialSelItems )
       
    };

    
}
