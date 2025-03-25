import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gifs.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';


const GIF_KEY = 'gifs';


const loadFromLocalStorage = () => {
   const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'; //Record<string, gifs[]>
   const gifs = JSON.parse(gifsFromLocalStorage);

   return gifs;

}



// {
//   'Goku': [gig1,gif2,gif3],
//   'Saitama': [gig1,gif2,gif3],
//   'Dragon ball': [gig1,gif2,gif3],

// }

// Record<string, Gif[]>





@Injectable({providedIn: 'root'})
  export class GifService {
    private http = inject(HttpClient)


  trendingGifs = signal<Gif[]>([]); //[gif,gif,gif,gif,gif,gif,]
  trendingGifsLoading = signal(true);



  // [ [gif,gif,gif,],[gif,gif,gif,],[gif,gif,gif,],[gif,gif,gif,] ]
  tredingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for ( let i = 0; i < this.trendingGifs().length; i +=3 ) {
      groups.push( this.trendingGifs().slice(i, i + 3) );
    }



    return groups; //[ [g1,g2,g3],[g4,g5]]
  })


  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));



     constructor(){
        this.loadTrendingGifs();
      }


   saveGifsToLocalStorage = effect(() => {
       const historyString = JSON.stringify(this.searchHistory());
       localStorage.setItem(GIF_KEY, historyString);
   });



    loadTrendingGifs() {
     this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
      params: {
        api_key: environment.giphyapikey,
        limit: 20,

    }
   })
   .subscribe ( (resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);

   });

  }

    searchGifs(query: string): Observable<Gif[]> {
      return this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`,{
        params: {
          api_key: environment.giphyapikey,
          limit: 20,
          q: query,
        },
       })
       .pipe(
        map(({ data }) => data),
        map(( items ) => GifMapper.mapGiphyItemsToGifArray(items)),

          // TODO Histortial
          tap( items => {
             this.searchHistory.update( history => ({
               ...history,
               [query.toLowerCase()]: items,
             }));
          })
        );

    //  .subscribe ( (resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);

    //    console.log ({search: gifs })
    //  });

  }

getHistoryGifs( query: string):Gif[] {
  return this.searchHistory()[query] ?? [];


}


}









