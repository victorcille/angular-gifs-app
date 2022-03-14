import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  // Gracias a esto ya no es necesario definir los servicios en el aparatdo 'providers' de los module.ts
  // Ya todos los servicios son accesibles de manera global en cualquier parte de la aplicación
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey     : string = '3NKr5X33Ad6bYCrNalpuJYrxlBYher24';

  // Como el getter de este parámetro lo vamos a llamar 'historial' y en typescript los getter se usan igual que los parámetros,
  // para diferenciar el método del parámetro, este último lo vamos a llamar igual pero con el '_' delante
  private _historial: string[] = [];
  public resultados : Gif[]    = [];


  // Vamos a usar un módulo de Angular que ya viene preparado para hacer peticiones http y poder consumir API's => HttpClientModule.
  // Lo importaremos en el app.module.ts para que sea usable de manera global
  // Inyectamos el HttpClient para poder hacer las peticiones http al API
  constructor(private _http: HttpClient) {

    // Cargamos en nuestro array el historial guardado en el localStorage (si hay). Si no, devolvemos un array vacío.
    // Si no sabemos qué significa el ! mirar en google 'non-null assertion operator' 
    // (mirar que también lo utilizamos en el busqueda.component.ts)
    this._historial =  JSON.parse(localStorage.getItem('historial')!) || [];

    // Hacemos lo mismo con los resultados
    this.resultados =  JSON.parse(localStorage.getItem('resultados')!) || [];
  }



  // Rompemos el array (con los puntos suspensivos) y lo volvemos a montar (con los corchetes [])
  // esto lo hacemos por asegurarnos de que no va a haber problemas (como tuvimos que hacer en el curso de Firebase, acuérdate)
  get historial(): string[]
  {
    return [...this._historial];
  }

  buscarGifs(query: string): void
  {
    // Pasamos todo a minúsculas para poder hacer luego las validaciones de los strings. 
    // Así lo almacenaremos en el array, aunque luego en la plantilla usaremos el pipe 'titlecase' que pondrá la primera letra de la palabra
    // en mayúscula (ver sidebar.component.html) 
    query = query.trim().toLowerCase();

    // Comprobamos si el elemento buscado ya se encuentra insertado en el array (para evitar duplicidades). Si no lo está, lo añadimos
    if (!this._historial.includes(query)) {
      
      // El unshift() hace lo mismo que el push() pero en vez de insertarlo al final, lo hace al principio
      this._historial.unshift(query);

      // Restringimos que sólo se devuelvan los 10 primeros elementos del array
      this._historial = this._historial.splice(0, 10);

      // Guardamos en el localStorage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    // LLAMADAS A LA API giphy:

    // Definimos los parámetros que necesita el endpoint (ver documentación del sitio)
    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);

    // Los params que vamos a enviar son los que hemos definido arriba. 
    // Normalmente los json son {propiedad: valor} (ejemplo => {params: params}), pero desde el ECMAScript 6, si el nombre de la propiedad
    // y el nombre de la variable que se le pasa con el valor es el mismo se puede reducir a {valor} (ejemplo => {params})
    this._http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params } )
    .subscribe(response => {
      this.resultados = response.data;

      // Guardamos en el localStorage
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    });


    // Ejemplo de cómo hacer una llamada a un API con javascript nativo:
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=3NKr5X33Ad6bYCrNalpuJYrxlBYher24&q=goku&limit=5').then(response => {
    //   response.json().then(data => {
    //     console.log(data);
    //   });
    // });


    // Otra forma que podríamos usar es declarar esta función como 'async' => async buscarGifs(query: string) {}, y hacer lo siguiente:
    // const response = await fetch('https://api.giphy.com/v1/gifs/search?api_key=3NKr5X33Ad6bYCrNalpuJYrxlBYher24&q=goku&limit=5');
    // const data = await response.json();
    // console.log(data);
  }
}
