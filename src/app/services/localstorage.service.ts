import { Injectable } from '@angular/core';

import { ICard } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getId(): number{
    return JSON.parse(localStorage.getItem('id') as string)
  }

  setNewId(id: number){
    localStorage.setItem('id', JSON.stringify(id))
  }

  addCard(card: ICard){
    if(!JSON.parse(localStorage.getItem('cards') as string)){
      localStorage.setItem('cards', JSON.stringify([card]));
    } else {
      let cardList = JSON.parse(localStorage.getItem('cards') as string);
      cardList.push(card);
      localStorage.setItem('cards', JSON.stringify(cardList));
    }
  }

  getCards(){
    return JSON.parse(localStorage.getItem('cards') as string)
  }

  deleteCard(id: number){
    let cards: ICard [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
  }

  getCardById(id: number): ICard{
    let cards: ICard [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    return cards[index];
  }

  saveEdit(id: number, card: ICard){
    let cards: ICard [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    cards[index] = card;
    localStorage.setItem('cards', JSON.stringify(cards));
  }

}
