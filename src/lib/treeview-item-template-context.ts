import { TreeviewItem } from './treeview-item';

import { TreeviewConfig } from './treeview-config';

export interface TreeviewItemTemplateContext {
    item: TreeviewItem;
    config: TreeviewConfig;
    onCollapseExpand: () => void;
    onCheckedChange: () => void;
}
