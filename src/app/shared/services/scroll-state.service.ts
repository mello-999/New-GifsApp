import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class scrollStateService {
   trendingScrollState = signal(0);
}











