import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  heroes : Hero[] = []

  constructor(private heroService: HeroService) {
    this.getHeroes();
  }

  ngOnInit(): void {
  }

  getHeroes(){
    this.heroService.getHeroes().subscribe(h => this.heroes = h.slice(1,5));
  }

}
