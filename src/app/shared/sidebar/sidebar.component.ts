import { Component, OnInit } from '@angular/core';

import { GifsService } from 'src/app/gifs/services/gifs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  constructor(private _gifsService: GifsService) { }

  ngOnInit(): void {
  }

  get historial(): string[]
  {
    return this._gifsService.historial;
  }

  buscar(query: string): void
  {
    this._gifsService.buscarGifs(query);
  }
}
