import { Observable, Observer, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];
  osservato?: string;
  selectedHero?: Hero;

  obs?: Subscription;

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit() {
    this.getHeroes();
    //this.getCose();
  }

  /*
  onSelect(hero: Hero){
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
    if(this.obs)
      this.obs!.unsubscribe();
  }
*/

  getHeroes(){
    const myObserver : Observer<Hero[]> = {
      next: (x: Hero[]) => {this.heroes = x; console.log('Observer getHeroes got a next value: ' + x.length);},
      error: (err: Error) => console.error('Observer getHeroes got an error: ' + err),
      complete: () => console.log('Observer getHeroes got a complete notification'),
    };
    this.heroService.getHeroes().subscribe(myObserver);
  }

  getCose()
  {
      this.obs = this.heroService.getInterval()
      .subscribe((roba) =>
      {
        this.osservato = roba.toString();
      });
  }

  add(heroName: string){
    if(!heroName)
      return
    heroName = heroName.trim();
    this.heroService.addHero({name: heroName} as Hero).subscribe(
      (h) => this.heroes.push(h)
    );
  }

  delete(hero: Hero){
    this.heroService.deleteHero(hero.id).subscribe(
      (h) => this.heroes = this.heroes.filter(h => h.id !== hero.id)
    );
  }

}
