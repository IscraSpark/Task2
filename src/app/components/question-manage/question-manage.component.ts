import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICard } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-manage',
  templateUrl: './question-manage.component.html',
  styleUrls: ['./question-manage.component.scss']
})
export class QuestionManageComponent implements OnInit {

  constructor(private lsServise: LocalstorageService, private router: Router) { }

  ngOnInit(): void {
  }

  cards: ICard[] = this.lsServise.getCards()

  delete(id: number){
    this.lsServise.deleteCard(id);
    this.cards = this.lsServise.getCards();
  }
  
  edit(id: number){
    this.router.navigateByUrl('/edit/'+id) ;
  }

}
