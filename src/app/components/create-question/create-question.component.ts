import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Card, Svariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';


@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  element!: string;
  question: string = 'Input your question';
  singles: Svariant[] = [];
  elements = new FormControl('');
  elementsList: string[] = ['single', 'multiple', 'open'];
  idsingle: number = 0;
  idmultipe: number =0;
  disableRadio: boolean = false;
  card!: Card;

  constructor(private lsService: LocalstorageService, private router: Router) { }

  ngOnInit(): void {
    this.card = {
      id: 0,
      type: '',
      question: this.question,
      single: [],
      multiple: [],
      open: false,
      date: 0,
      answered: false,
      answerDate: undefined,
    }
  }
  
  add(){
    this.disableRadio = true;
    if (this.element == 'single'){
      this.addSingle();
    }
    if(this.element == 'multiple')
    {
      this.addMultiple();
    }
    if(this.element == 'open')
    {
      this.addOpen();
    }
  }

  addSingle(){
    let variant: Svariant = ({value:'add answer'+this.idsingle, id: this.idsingle});
    this.idsingle++;
    this.card.single.push(variant);
    if(this.card.single.length == 1){
      this.addSingle();
    }
  }

  addMultiple(){
    let variant: Svariant = ({value:'add answer'+this.idmultipe, id: this.idmultipe});
    this.idmultipe++;
    this.card.multiple.push(variant);
    if(this.card.multiple.length == 1){
      this.addMultiple();
    }
  }

  addOpen(){
    if(!this.card.open)
    {
      this.card.open = true;
    }
  }

  create(){
    
    let cardid: number = this.lsService.getId()
    if (cardid == null){
      cardid = 1;
    }
    
    let date: number = Date.now();
    this.card.id = cardid;
    this.card.type = this.element;
    this.card.date = date;
    this.lsService.addCard(this.card);
    cardid++;
    this.lsService.setNewId(cardid);
    this.router.navigateByUrl('/manage');
  }
  
  clear(){
    this.card.single = [];
    this.card.multiple = [];
    this.card.open = false;
    this.card.question = 'Input your question';
  }
}
