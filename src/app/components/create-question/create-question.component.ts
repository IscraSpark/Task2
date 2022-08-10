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
  svariants: Svariant[] = [];
  mvariants: Svariant[] = [];
  elements = new FormControl('');
  elementsList: string[] = ['single', 'multiple', 'open'];
  idsingle: number = 0;
  idmultipe: number =0;
  openid: boolean = false;
  disableRadio: boolean = false;
  constructor(private lsService: LocalstorageService, private router: Router) { }

  ngOnInit(): void {
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
    this.svariants.push(variant);
    this.idsingle++;
    if(this.svariants.length == 1){
      this.addSingle();
    }
  }

  addMultiple(){
    let variant: Svariant = ({value:'add answer'+this.idmultipe, id: this.idmultipe});
    this.mvariants.push(variant);
    this.idmultipe++;
    if(this.mvariants.length == 1){
      this.addMultiple();
    }
  }

  addOpen(){
    if(!this.openid)
    {
      this.openid = true;
    }
  }

  create(){
    
    let cardid: number = this.lsService.getId()
    if (cardid == null){
      cardid = 1;
    }
    
    let date: number = Date.now();
    let card: Card = {
      id: cardid,
      type: this.element,
      question: this.question,
      single: this.svariants,
      multiple: this.mvariants,
      open: this.openid,
      date: date,
      answered: false,
      answerDate: undefined,
    }
    this.lsService.addCard(card);
    cardid++;
    this.lsService.setNewId(cardid);
    this.router.navigateByUrl('/manage');
  }
  
  clear(){
    this.svariants = [];
    this.mvariants = [];
    this.question = 'Input your question';
    this.openid = false;
  }
}
