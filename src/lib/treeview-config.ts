import { Injectable } from '@angular/core';

@Injectable()
export class TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = false;
    hasCollapseExpand = false;
    loadAll = true;
    singleSelect = true; // only single item can be selcted
    singleExpand = true; // only one branch open at a time
    selectBranch = false; // all items selected in branch if true
    selectParents = false; // select the patent nodes
    maxHeight = 500;
    treeToLoad = "";
    url = "";

    get hasDivider(): boolean {
        return this.hasFilter || this.hasAllCheckBox || this.hasCollapseExpand;
    }

    public static create(fields?: {
        hasAllCheckBox?: boolean,
        hasFilter?: boolean,
        hasCollapseExpand?: boolean,
        loadAll?: boolean,
        singleSelect?:boolean,
        singleExpand?: boolean,
        selectBranch?: boolean,
        selectParents: boolean,
        maxHeight?: number,
        treeToLoad?: string,
        url: string
    }): TreeviewConfig {
        const config = new TreeviewConfig();
        Object.assign(config, fields);
        return config;
    }
}
