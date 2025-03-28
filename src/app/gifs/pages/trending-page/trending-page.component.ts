import {  AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';

import { GifService } from '../../services/gifs.service';
import { scrollStateService } from 'src/app/shared/services/scroll-state.service';



@Component({
  selector: 'app-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(scrollStateService)


  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')


  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef() ?.nativeElement;
    if( !scrollDiv )return;


    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();

  }


  onScroll( event: Event ) {
    const scrollDiv = this.scrollDivRef() ?.nativeElement;
    if( !scrollDiv )return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    // console.log({scrolltotal: scrollTop + clientHeight, scrollHeight });

    const isAtBoton = scrollTop + clientHeight + 300  >= scrollHeight;
    this.scrollStateService.trendingScrollState.set(scrollTop);



    if( isAtBoton ) {
        this.gifService.loadTrendingGifs();
   }
  }

}









