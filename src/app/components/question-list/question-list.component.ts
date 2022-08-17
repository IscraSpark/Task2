import { Component, OnInit } from '@angular/core';


import { ICard, ICheckBoxData, IOpen, IRadioData, IValid, IVariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  checked: boolean = false;
  cards: ICard[] = this.lsServise.getCards();
  unanswered: ICard[] = []
  answered: ICard[] = []
  element: IVariant | undefined;
  valid: boolean = false;
  validatedCard!: number;
  abled = new Set<number>;
  radioData: IRadioData[] = [];
  box: ICheckBoxData[] = [];
  openAnswer: IOpen[] = [];

  constructor(private lsServise: LocalstorageService ) { }

  ngOnInit(): void {
    if (this.cards){
      this.unanswered = this.cards.filter((el) => !(el.answered));
      this.unanswered.reverse();
      this.answered = this.cards
      .filter((el) => el.answered)
      .sort((a, b)=> (a.answerDate as number) - (b.answerDate as number));
    }
  }

  undo(card: ICard){
    card.answered = false;
    card.multipleValue = undefined;
    card.openValue = undefined;
    card.singleValue = undefined;
    
    this.lsServise.saveEdit(card.id, card);
    let index: number = this.answered.findIndex(el => el.id == card.id);
    this.answered.splice(index, 1);
    this.unanswered.push(card);
    this.unanswered.sort((a, b) => b.date - a.date);
    this.checked = false;

    if(card.type == 'open') {
      this.abled.add(card.id);
    }
  }

  submit(card: ICard){
    card.answered = true;
    card.answerDate = Date.now();
    
    this.abled.delete(card.id);

    this.lsServise.saveEdit(card.id, card);
    let index: number = this.unanswered.findIndex(el => el.id == card.id);
    this.unanswered.splice(index, 1);
    this.answered.push(card);
    
    
  }
  
  disabled(id: number): boolean{
    if (this.abled.has(id)){
      return false;
    }
    return true;
  }

  onChanged(e: IValid){
    if (e.valid)
    {
      this.abled.add(e.card.id);
    } else {
      this.abled.delete(e.card.id);
    }
  }
}
