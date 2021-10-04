import { Observer } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];
  selectedHero?: Hero;

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit() {
    this.getHeroes();
  }

  onSelect(hero: Hero){
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(){
    const myObserver : Observer<Hero[]> = {
      next: (x: Hero[]) => {this.heroes = x; console.log('Observer getHeroes got a next value: ' + x.length);},
      error: (err: Error) => console.error('Observer getHeroes got an error: ' + err),
      complete: () => console.log('Observer getHeroes got a complete notification'),
    };
    this.heroService.getHeroes().subscribe(myObserver);
  }

}
