import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  // Si no le pongo la exclamación ! me marca un error diciéndome que es posible que ese elemento 'txtBuscar' podría no existir, podría ser null.
  // Como nosotros estamos seguros de que la caja de texto del html siempre va a estar ahí, siempre va a existir,
  // le ponemos el ! (non-null assertion operator) para decirle a typescript que confíe en nosotros y que ese elemento siempre va a tener algo.
  //Ccon esto nos aseguramos que el objeto no es nulo
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  constructor(private _gifsService: GifsService) { }

  ngOnInit(): void {
  }

  buscar()
  {
    const valor = this.txtBuscar.nativeElement.value;

    // Controlamos que si no escribimos nada, no se guarde en el historial de búsquedas
    if (valor.trim().length === 0) {
      return;
    }
    
    this._gifsService.buscarGifs(valor);
    
    this.txtBuscar.nativeElement.value = '';
  }

}
