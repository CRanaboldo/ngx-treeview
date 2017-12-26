import { Injectable } from '@angular/core';
import { Http, HttpModule, Response } from '@angular/http';
import { TreeviewItem } from './treeview-item';
import * as _ from 'lodash';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'

type pNode = {
    parentName: string;
    parent: TreeviewItem;
}

export interface selVals {
    key: string;
    values: any[];
    used: boolean[];
}

@Injectable()
export class TreeviewData {
    public selV: selVals[] = [];
    constructor(private http: Http) { 

    }

    public async getTree(BASE_URL: string, tree: string, loadAll: boolean, initialSelItems: string) {
        //load selected values into array object
        if (initialSelItems!='' && this.selV.length== 0  ){
            // input JSON to object 
            var j: any = _.attempt(JSON.parse.bind(null, initialSelItems));
            if (!_.isError(j)) {
                if (j.length == 1 && Array.isArray(j)) {
                    
                    this.selV.push({key:'',values: j[0], used: _.fill(Array(j[0].length),false)});
                } else {                    
                    j.forEach(e => {
                        // What type of object - eitehr simple array of values or paraent child
                        let Jx = _.values(e);
                        let Jf; 
                        for (var i = 1; i < Jx.length; i++) { 
                            Jf = _.concat(Jf, Jx[i]) 
                        }
                        Jf=(Jf[0]==undefined)? _.slice(Jf,1): Jf
                        this.selV.push({key:Jx[0].toString(), values: Jf, used: _.fill(Array(Jf.length),false)});
                    });
                }
            }
        }

        let items: TreeviewItem[] = [];
        

        let ret = await this.fetch(BASE_URL, tree, loadAll)

        //put data int tree
        ret.json().forEach(element => { items.push(new TreeviewItem(element)) });

        
        this.applyValues(items, { parentName: 'root', parent: null });
        return items;
    }
    fetch(BASE_URL: string, tree: string, loadAll: boolean) {
        const queryStr = `Pid=` + tree + '&All=' + loadAll.toString()
        return this.http.get(`${BASE_URL}/?${queryStr}`).toPromise(); // Promise used as data has to be resent for component to build 
    }

    applyValues(k: TreeviewItem[],  p: pNode): void {

        k.forEach(l => {
            l.checked = false
            l.parentName = p.parentName; // adds in details of parent to each item
            l.parent = p.parent;
            this.selV.forEach(e => {
                
                // apply values
                if (e.key == '') { // simple array
                    _.forEach(e.values, function(value, key) { if (l.value === value) { 
                        l.checked = true; 
                        e.used[key]= true }});
                } else { //parent child
                    if (l.value == e.key) { l.checked = true;  } else {
                        if (!_.isNil(l.childOf)) { // child of set on server, if nil ignore as wont have key
                            _.forEach(e.values, function(value, key) { 
                                if (l.value === value && l.childOf === e.key) { 
                                    l.checked = true; 
                                    e.used[key]= true } });
                            
                        }
                    }
                }
            });
            // and iterate children
            if (l.children) {
                const Px = <pNode>({
                    parentName: l.text,
                    parent: l
                });
                this.applyValues(l.children, Px)

            }
        });
    }

}

