import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gifs.interfaces';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

// {
//   'Goku': [gig1,gif2,gif3],
//   'Saitama': [gig1,gif2,gif3],
//   'Dragon ball': [gig1,gif2,gif3],

// }

// Record<string, Gif[]>





@Injectable({providedIn: 'root'})
  export class GifService {
    private http = inject(HttpClient)


  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));



     constructor(){
        this.loadTrendingGifs();
      }


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
      console.log( gifs );
   });

  }

    searchGifs(query: string) {
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
}











