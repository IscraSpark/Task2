import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICard, ICheckBoxData, IOpen, IRadioData, IVariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  checked: boolean = false;
  cards: ICard[] = this.lsServise.getCards();
  unanswered: ICard[] = this.cards.filter((el) => !(el.answered));
  answered: ICard[] = this.cards
    .filter((el) => el.answered)
    .sort((a, b)=> (a.answerDate as number) - (b.answerDate as number));
  element: IVariant | undefined;
  valid: boolean = false;
  validatedCard!: number;
  abled = new Set<number>;
  radioData: IRadioData[] = [];
  box: ICheckBoxData[] = [];
  openAnswer: IOpen[] = [];
  form: FormGroup = new FormGroup({
  open: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  radio: new FormControl('', [Validators.required]),
  });


  constructor(private lsServise: LocalstorageService) { }

  ngOnInit(): void {
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
    this.unanswered.sort((a, b) => a.date - b.date);
    this.checked = false;

    if(card.type == 'open') {
      this.abled.add(card.id);
    }
  }

  submit(card: ICard){
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
    this.abled.delete(card.id);

    this.lsServise.saveEdit(card.id, card);
    let index: number = this.unanswered.findIndex(el => el.id == card.id);
    this.unanswered.splice(index, 1);
    this.answered.push(card);
    
    
  }

  validate(card: ICard): void{
    this.valid = false;
    if (!this.form.controls['open'].value && card.open) {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }

    if (!this.radioData.find(el => el.cardid == card.id) && card.single.length) {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }

    if (!this.box.find(el => el.cardid == card.id) && card.multiple.length) {
      this.valid = true;
      this.validatedCard = card.id;
      return;
    }
    this.submit(card);
  }

  onChange(e: any, card: ICard){
    let id: number = card.id;
    
     if (this.radioData.find(el => el.cardid == id)) {
      this.radioData.find(el =>{
        if(el.cardid == id) {
          el.radio = e.source.value;
        }
      });
     } else {
      this.radioData.push({ cardid: id, radio: e.source.value});
     }  
     this.abled.add(id);
  }

  onChangeMultiple(e: any, card: ICard, variant: IVariant){
    let id: number = card.id;
    
    if (!e.source._checked){ 
      let index: number= this.box.findIndex(el =>{
        
        if(el.cardid == id){
          if(el.box.findIndex(val => val.id == variant.id) || el.box.findIndex(val => val.id == variant.id) == 0){
            return el;            
          }

        }
        return false;
      })

      let secind = this.box[index].box.findIndex(el => el.id == variant.id);
      this.box[index].box.splice(secind, 1);
      
      if(!this.box[index].box.length){
        this.box.splice(index, 1);
        this.abled.delete(id);
      }
    } else {
      if(this.box.find(el => el.cardid == id)){
        let index = this.box.findIndex(el => el.cardid == id);
        this.box[index].box.push(variant);
      } else {
        this.box.push({cardid: id, box: [variant]});
      }
      this.abled.add(id);
    }
    
  }

  openChange(e: any, card: ICard){
    let id: number = card.id;
    this.abled.add(id);
    if (this.openAnswer.find(el => el.cardid == id)){
      let index = this.openAnswer.findIndex(el => el.cardid == id)
      this.openAnswer[index].value = e.target.value;
      
      if (this.openAnswer[index].value = ' '){
        this.abled.delete(id);
      }
     } else {
      this.openAnswer.push({cardid: id, value: e.target.value});
     }
  }

  isChecked(card: ICard, element: IVariant): boolean{
    if (card.multipleValue?.find(el => el === element.id) || card.multipleValue?.find(el => el === element.id) == 0){
      return true;
    } else {
      return false;
    }
  }

  singleCheck(card: ICard, element: IVariant): boolean{
    if(card.singleValue === element.id){
      return true;
    } else {
      return false;
    }
  }

  disabled(id: number): boolean{
    if (this.abled.has(id)){
      return false;
    }
    return true;
  }
}
