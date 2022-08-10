import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Card, Svariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
  elementsList: string[] = ['single', 'multiple', 'open'];
  element!: string;
  idsingle: number = 0;
  idmultipe: number =0;
  openid: boolean = false;
  questionType!: string;
  
  card!: Card;
  id!: number;

  constructor(
    private lsService: LocalstorageService, 
    private router: Router, private route: ActivatedRoute
    ) { }
  
  
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.card = this.lsService.getCardById(this.id);

    this.idsingle = this.findMax(this.card.single);
    this.idmultipe = this.findMax(this.card.multiple);
    
    if (this.card.multiple.length)
    {
      this.questionType = this.elementsList[1];
      this.element = this.elementsList[1];
    }
    if (this.card.single.length)
    {
      this.questionType = this.elementsList[0];
      this.element = this.elementsList[0];
    }
    if (this.card.open)
    {
      this.questionType = this.elementsList[2];
      this.element = this.elementsList[2];
    }

  }

  


  edit(){

    this.lsService.saveEdit(this.id, this.card);
    this.router.navigateByUrl('/manage');
  }

  undo(){
    this.card = this.lsService.getCardById(this.id);
  }

  add(){
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
    this.card.single.push(variant);
    this.idsingle++;
    if(this.card.single.length == 1){
      this.addSingle();
    }
  }

  addMultiple(){
    let variant: Svariant = ({value:'add answer'+this.idmultipe, id: this.idmultipe});
    this.card.multiple.push(variant);
    this.idmultipe++;
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

  findMax(list: Svariant[]){
    let id: number =0;
    for (let el of list){
      if (el.id > id){
        id = el.id;
      }
    }
    return id+1;
  }

}
