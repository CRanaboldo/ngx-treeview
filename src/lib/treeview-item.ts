import * as _ from 'lodash';

export interface TreeItem {
    text: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    children?: TreeItem[];
    hasChildren?: boolean;
    checkable?: boolean;
    parentName?: string;
    parent?: TreeviewItem;
    childOf?: string;
}


export class TreeviewItem {
    private internalDisabled = false;
    private internalChecked = false;
    private internalCollapsed = false;
    private internalChildren: TreeviewItem[];
    text: string;
    value: any;
    hasChildren: boolean;
    checkable?: boolean;
    parentName?: string;
    parent?: TreeviewItem;
    childOf: string;

    constructor(item: TreeItem, autoCorrectChecked = false) {
        if (_.isNil(item)) {
            throw new Error('Item must be defined');
        }
        if (_.isString(item.text)) {
            this.text = item.text;
        } else {
            throw new Error('A text of item must be string object');
        }
        this.value = item.value;
        if (_.isBoolean(item.checked)) {
            this.checked = item.checked;
        }
        if (_.isBoolean(item.collapsed)) {
            this.collapsed = item.collapsed;
        }
        if (_.isBoolean(item.disabled)) {
            this.disabled = item.disabled;
        }
        if (_.isBoolean(item.hasChildren)) {
            this.hasChildren = item.hasChildren;
        }
        if (_.isBoolean(item.checkable)) {
            this.checkable = item.checkable;
        }
        if (_.isBoolean(item.checkable)) {
            this.checkable = item.checkable;
        }
        if (_.isString(item.parentName)) {
            this.parentName = item.parentName;
        }
        if (!_.isNull(item.parent)) {
            this.parent = item.parent;
        }
        if (_.isString(item.childOf)) {
            this.childOf = item.childOf;
        }


        if (this.disabled === true && this.checked === false) {
            throw new Error('A disabled item must be checked');
        }
        if (!_.isNil(item.children)) {
            this.children = item.children.map(child => {
                if (this.disabled === true) {
                    child.disabled = true;
                }

                return new TreeviewItem(child);
            });
        }

        if (autoCorrectChecked) {
            this.correctChecked();
        }
    }


    get checked(): boolean {
        return this.internalChecked;
    }

    set checked(value: boolean) {
        if (!this.internalDisabled) {
            if (this.internalChecked !== value) {
                this.internalChecked = value;
            }
        }
    }

    

    setCheckedRecursive(value: boolean) {
        if (!this.internalDisabled) {
            this.internalChecked = value;
            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.setCheckedRecursive(value));
            }
        }
    }

    setCheckedParent() {
        if (!this.internalDisabled) {
            this.childOf = this.getParent(this);
        }
    }

    get disabled(): boolean {
        return this.internalDisabled;
    }

    set disabled(value: boolean) {
        if (this.internalDisabled !== value) {
            this.internalDisabled = value;
            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.disabled = value);
            }
        }
    }

    get collapsed(): boolean {
        return this.internalCollapsed;
    }

    set collapsed(value: boolean) {
        if (this.internalCollapsed !== value) {
            this.internalCollapsed = value;
        }
    }

    setCollapsedRecursive(value: boolean) {
        this.internalCollapsed = value;
        if (!_.isNil(this.internalChildren)) {
            this.internalChildren.forEach(child => child.setCollapsedRecursive(value));
        }
    }

    get children(): TreeviewItem[] {
        return this.internalChildren;
    }



    set children(value: TreeviewItem[]) {
        if (this.internalChildren !== value) {
            if (!_.isNil(value) && value.length === 0) {
                throw new Error('Children must be not an empty array');
            }
            this.internalChildren = value;
            if (!_.isNil(this.internalChildren)) {
                let checked = true;
                this.internalChildren.forEach(child => {
                    if (child.checked === false) {
                        checked = false;
                    }
                });
                this.internalChecked = checked;
            }
        }
    }


    getCheckedItems(): TreeviewItem[] {
        let checkedItems: TreeviewItem[] = [];
        if (this.internalChecked) checkedItems.push(this);

        if (!(_.isNil(this.internalChildren))) {
            const childCount = this.internalChildren.length;
            for (let i = 0; i < childCount; i++) {

                checkedItems = _.concat(checkedItems, this.internalChildren[i].getCheckedItems());
            }
        }

        return checkedItems;
    }

    correctChecked() {
        this.internalChecked = this.getCorrectChecked();
    }

    private getCorrectChecked(): boolean {
        let checked = this.checked;
        if (!_.isNil(this.internalChildren)) {
            checked = true;
            const childCount = this.internalChildren.length;
            for (let i = 0; i < childCount; i++) {
                const child = this.internalChildren[i];
                child.internalChecked = child.getCorrectChecked();
                if (!child.internalChecked) {
                    checked = false;
                    break;
                }
            }
        }

        return checked;
    }

    private getParent(item: TreeItem): string {
        let v: string = "";
        if (!_.isNull(item.parent)) {
            if (item.parent.checkable) {
                item.parent.checked = true;
                return item.parent.value;
            } else {
                v = this.getParent(item.parent);
            }
        }
        return v;


    }



}
