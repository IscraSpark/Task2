import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Card, CheckBoxData, Open, RadioData, Svariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  checked: boolean = false;
  cards: Card[] = this.lsServise.getCards()
  unanswered: Card[] = this.cards.filter((el) => !(el.answered))
  answered: Card[] = this.cards.filter((el) => el.answered).sort((a, b)=> (a.answerDate as number) - (b.answerDate as number))
  element: Svariant | undefined;
  valid: boolean = false;
  validatedCard!: number;
  radioData: RadioData[] = [];
  box: CheckBoxData[] = [];
  openAnswer: Open[] = [];
  form: FormGroup = new FormGroup({
  open: new FormControl('', [Validators.required]),
  radio: new FormControl('', [Validators.required]),
  });


  constructor(private lsServise: LocalstorageService) { }

  ngOnInit(): void {
  }
  

  undo(card: Card){
    card.answered = false;
    card.multipleValue = undefined;
    card.openValue = undefined;
    card.singleValue = undefined;
    console.log(card);
    
    this.lsServise.saveEdit(card.id, card);
    let index: number = this.answered.findIndex(el => el.id == card.id);
    this.answered.splice(index, 1);
    this.unanswered.push(card);
    this.unanswered.sort((a, b) => a.date - b.date);
    this.checked = false;
  }

  submit(card: Card){
    card.answered = true;
    card.answerDate = Date.now();
    let radio = this.radioData.find(el => el.cardid = card.id);

    card.singleValue = radio?.radio.id;
    let checkbox = this.box.find(el => el.cardid == card.id);
    let boxid: number[] = [];
    checkbox?.box.forEach(el => boxid.push(el.id));
    card.multipleValue = boxid;

    card.openValue = this.openAnswer.find(el => el.cardid == card.id)?.value;
    
    let ind =  this.box.findIndex(el => el.cardid == card.id);
    this.box.splice(ind, 1);
    ind = this.radioData.findIndex(el => el.cardid = card.id);
    this.radioData.splice(ind, 1);
    ind = this.openAnswer.findIndex(el => el.cardid == card.id);
    this.openAnswer.splice(ind, 1);
    
    this.lsServise.saveEdit(card.id, card);
    let index: number = this.unanswered.findIndex(el => el.id == card.id)
    this.unanswered.splice(index, 1);
    this.answered.push(card);
    
    
  }

  validate(card: Card): void{
    this.valid = false;
    if (!this.form.controls['open'].value && card.open)
    {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }
    if (!this.radioData.find(el => el.cardid == card.id) && card.single.length)
    {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }
    if (!this.box.find(el => el.cardid == card.id) && card.multiple.length)
    {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }
    this.submit(card);
  }

  onChange(e: any, id: number){
     if (this.radioData.find(el => el.cardid == id))
     {
      this.radioData.find(el =>{
        if(el.cardid == id)
        {
          el.radio = e.source.value;
        }
      })
     } else {
      this.radioData.push({ cardid: id, radio: e.source.value});
     }  
  }

  onChangeMultiple(e: any, id: number, variant: Svariant){
    
    if (!e.source._checked)
    { 
      let index = this.box.findIndex(el =>{
        if(el.cardid == id)
        {
          if(el.box.findIndex(val => val.id == variant.id))
          {
            return el.cardid;
          }
        }
        return false;
      })

      let secind = this.box[index].box.findIndex(el => el.id == variant.id);
      this.box[index].box.splice(secind, 1);

      if(!this.box[index].box.length)
      {
        this.box.splice(index, 1)
      }
    } else {
      if(this.box.find(el => el.cardid == id))
      {
        let index = this.box.findIndex(el => el.cardid == id)
        this.box[index].box.push(variant)
      } else {
        this.box.push({cardid: id, box: [variant]})
      }
    }
    
  }

  openChange(e: any, id: number){
    if (this.openAnswer.find(el => el.cardid == id))
     {
      let index = this.openAnswer.findIndex(el => el.cardid == id)
      this.openAnswer[index].value = e.target.value;
      
     } else {
      this.openAnswer.push({cardid: id, value: e.target.value})
     }
  }

  isChecked(card: Card, element: Svariant): boolean{
    if (card.multipleValue?.find(el => el === element.id) || card.multipleValue?.find(el => el === element.id) == 0)
    {
      return true;
    } else {
      return false;
    }
  }

  singleCheck(card: Card, element: Svariant): boolean{
    if(card.singleValue === element.id)
    {
      return true;
    } else {
      return false;
    }
  }

}
