import { Injectable, ɵɵNgOnChangesFeature } from '@angular/core';
import { from, fromEvent, interval, Observable, of } from 'rxjs';
import { catchError, concatAll, filter, first, map, mergeAll, take, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';
import { WeatherForecast } from './weather-forecast';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private messageService : MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    //const heroes = of(HEROES);
    const heroes = this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<Hero[]>("fetching getHeroes", []))
    );
    return heroes;
  }

  getHero(id: Number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    const hero = this.http.get<Hero>(url).pipe(
      tap(_ => console.log('hero con id trovato')),
      catchError(this.handleError<Hero>("getHeroById"))
    );
    //const heroes = of(HEROES.find(x => x.id === id)!);
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    return hero;
  }

  getCose(): Observable<string> {
    const calcoloComplicato: Observable<string> = new Observable<string>((sub) => {
      let mario = "https://www.google.it";
      let saverio = "https://www.republica.it"
      sub.next(mario);
      sub.next(saverio);
    }).pipe(map((url) => new Observable<string>(s=>
      {
        s.next(url);
        s.complete();
      })), concatAll(), catchError(this.handleError<string>('getCose','')));
    return calcoloComplicato;
  }

  getInterval(): Observable<number>
  {
    const arr: number[] = [1000,2000,3000,4000];
    const result = interval(1000).pipe(map((x) => arr[x]), take(arr.length));
    //const result2 = interval(1000).pipe(map((y) => arr[y])).pipe(take(arr.length));
    return result;
  }

  getClick(): Observable<number>
  {
    const e = fromEvent(document, 'click');
    const highLevel = e.pipe(
      map(evt => interval(1000).pipe(take(10)))
    );
    const result = highLevel.pipe(mergeAll(2));
    return result;
  }

  getWeather(): Observable<WeatherForecast>
  {
    const w = from(this.fetchData().then(r => r.json()).then<WeatherForecast>(j => Object.assign(new WeatherForecast(), j)));
    return w;
  }

  fetchData() : Promise<Response>
  {
    return fetch('https://localhost:5001/WeatherForecast');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
    /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  updateHero(hero: Hero) : Observable<any> {
    const result = this.http.put<Hero>(this.heroesUrl, hero)
    .pipe(
      tap(_ => console.log('updateHero ' + hero.id)),
      catchError(this.handleError<Hero>("updateHero"))
    );
    return result;
  }

  addHero(heroName: Hero): Observable<Hero>{

    const result = this.http.post<Hero>(this.heroesUrl, heroName, this.httpOptions)
    .pipe(
      tap(_ => console.log('createdHero ' + heroName.name)),
      catchError(this.handleError<Hero>("addHero"))
    );
    return result;
  }


  deleteHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    const result = this.http.delete<Hero>(url)
    .pipe(
      tap(_ => console.log('deleteHero ' + id)),
      catchError(this.handleError<Hero>("addHero"))
    );
    return result;
  }

  searchHero(term: string): Observable<Hero[]>{
    if(!term.trim())
      return of([]);
    const url = `${this.heroesUrl}/?name=${term}`;
    const result = this.http.get<Hero[]>(url).pipe(
      tap(x => x.length > 0 ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>("searchHero", []))
      );
    return result;
  }

}
