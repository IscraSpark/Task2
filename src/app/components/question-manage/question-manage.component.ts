import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICard } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-manage',
  templateUrl: './question-manage.component.html',
  styleUrls: ['./question-manage.component.scss'],
})
export class QuestionManageComponent implements OnInit {
  cards: ICard[] = this.lsServise.getCards();

  constructor(private lsServise: LocalstorageService, private router: Router) {}

  ngOnInit(): void {
    if (this.cards) {
      this.cards.reverse();
    }
  }

  delete(id: number) {
    this.lsServise.deleteCard(id);
    this.cards = this.lsServise.getCards();
    this.cards.reverse();
  }

  edit(id: number) {
    this.router.navigateByUrl('/edit/' + id);
  }
}
