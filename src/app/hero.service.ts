import { Injectable } from '@angular/core';
import { from, fromEvent, interval, Observable, of } from 'rxjs';
import { concatAll, filter, first, map, mergeAll, take} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';
import { WeatherForecast } from './weather-forecast';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService : MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    return heroes;
  }

  getHero(id: Number): Observable<Hero> {
    const heroes = of(HEROES.find(x => x.id === id)!);
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return heroes;
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
      })), concatAll());
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
}
