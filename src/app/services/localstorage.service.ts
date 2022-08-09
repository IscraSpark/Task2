import { Injectable } from '@angular/core';

import { Card } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  //private cardForEdit!: number;

  getId(): number{
    return JSON.parse(localStorage.getItem('id') as string)
  }

  setNewId(id: number){
    localStorage.setItem('id', JSON.stringify(id))
  }

  addCard(card: Card){
    if(!JSON.parse(localStorage.getItem('cards') as string))
    {
      localStorage.setItem('cards', JSON.stringify([card]))
    } else {
      let cardList = JSON.parse(localStorage.getItem('cards') as string)
      cardList.push(card)
      localStorage.setItem('cards', JSON.stringify(cardList))
    }
  }

  getCards(){
    return JSON.parse(localStorage.getItem('cards') as string)
  }

  deleteCard(id: number){
    let cards: Card [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    cards.splice(index, 1)
    localStorage.setItem('cards', JSON.stringify(cards))
  }

  // setForEdit(id:number){
  //   this.cardForEdit = id
  // }

  // getCardForEdit(): number{
  //   return this.cardForEdit
  // }

  getCardById(id: number): Card{
    let cards: Card [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    return cards[index]
  }

  saveEdit(id: number, card: Card){
    let cards: Card [] = this.getCards();
    let index: number = cards.findIndex(card => card.id == id);
    cards[index] = card;
    localStorage.setItem('cards', JSON.stringify(cards));
  }

}
