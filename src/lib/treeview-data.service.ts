import { Injectable } from '@angular/core';
import { Http, HttpModule, Response } from '@angular/http';
import { TreeviewItem} from '../lib';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map'

@Injectable()
export class TreeviewData  {
   
    
    constructor(private http: Http) {}

    public async getTree(BASE_URL: string, tree: string, loadAll: boolean, selectedItems: string) {
        let items: TreeviewItem[]= [];
        let ret = await this.fetch(BASE_URL, tree,loadAll)
           ret.json().forEach(element => {
            items.push(new TreeviewItem(element))
        });

        let  selItems: string[] = selectedItems.split(',');
        this.applyValues(items,selItems);
        return items;   
    }
    fetch(BASE_URL: string, tree: string, loadAll: boolean){
        const queryStr = `Pid=`+tree+'&All='+loadAll.toString()
        return  this.http.get(`${BASE_URL}/?${queryStr}`).toPromise(); // Promise used as data has to be resent for component to build 
    }
    
    applyValues(k:TreeviewItem[], j:string[]): void{
        k.forEach(l => {
            l.checked= false
            j.some(m=>{if (l.value===m){l.checked=true; return true}});
            if(l.children) this.applyValues(l.children,j)
        });
    }

}

