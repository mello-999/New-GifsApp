import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';






interface MenuOption {
  icon: string;
  label: string;
  route: string;
  sublabel: string;
}


@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {

  menuOptions:MenuOption[] = [
  {
    icon: 'fa-solid fa-chart-line',
    label: 'trending',
    sublabel: 'Gifs populares',
    route: '/dashboard/trending',
  },

  {
    icon: 'fa-solid fa-magnifying-glass',
    label: 'Buscador',
    sublabel: 'Buscar gifs ',
    route: '/dashboard/search',
  },

      


  ];





}

