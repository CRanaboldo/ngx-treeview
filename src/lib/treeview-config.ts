import { Injectable } from '@angular/core';

@Injectable()
export class TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = false;
    hasCollapseExpand = false;
    loadAll = true;
    singleSelect = true;
    singleExpand = true;
    maxHeight = 500;
    treeToLoad = "";

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
        maxHeight?: number,
        treeToLoad?: string
    }): TreeviewConfig {
        const config = new TreeviewConfig();
        Object.assign(config, fields);
        return config;
    }
}
