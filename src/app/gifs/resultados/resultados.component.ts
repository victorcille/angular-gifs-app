import { Component, OnInit } from '@angular/core';

import { Gif } from '../interfaces/gifs.interface';

import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styles: [
  ]
})
export class ResultadosComponent implements OnInit {

  constructor(private _gifsService: GifsService) { }

  ngOnInit(): void {
  }

  get resultados(): Gif[]
  {
    return this._gifsService.resultados;
  }

}
