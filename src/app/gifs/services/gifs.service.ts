import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory: string[] = [];
  private apikey:string = 'EPJpFtDoXpfz6vvP3YSJoi00rU4FyMkA';
  private serviceUrl:string = 'https://api.giphy.com/v1/gifs';
  public gifList:Gif[] = [];

  constructor(private http:HttpClient) {
    this.loadLocalStorage();
  }

  get tagHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history',JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length ===0 ) return;
    this.searchTag(this._tagsHistory[0]);

  }

  public searchTag(tag:string):void{
    if(tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key',this.apikey)
      .set('limit','10')
      .set('q',tag)

    let url = this.serviceUrl+'/search';

    this.http.get<SearchResponse>(url,{params})
    .subscribe(resp => {
      this.gifList = resp.data;

    });

  }
}
