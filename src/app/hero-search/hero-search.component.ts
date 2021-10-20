import { HeroService } from './../hero.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  searchTerms: string = "";
  //private searchTerms = new Subject<string>();
  constructor(private heroService: HeroService) {

  }

  ngOnInit(): void {
  }

}
