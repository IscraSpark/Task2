import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ICard, IVariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';




@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
  elementsList: string[] = ['single', 'multiple', 'open'];
  element!: string;
  singleId: number = 0;
  multipleId: number = 0;
  openId: boolean = false;
  questionType!: string;
  
  card!: ICard;
  id!: number;

  constructor(
    private lsService: LocalstorageService, 
    private router: Router, private route: ActivatedRoute
    ) { }
  
  
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.card = this.lsService.getCardById(this.id);

    this.singleId = this.findMax(this.card.single);
    this.multipleId = this.findMax(this.card.multiple);
    
    this.questionType = this.card.type;
    this.element = this.card.type;

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
    if(this.element == 'multiple'){
      this.addMultiple();
    }
    if(this.element == 'open'){
      this.addOpen();
    }
  }

  addSingle(){
    let variant: IVariant = ({value:'add answer'+this.singleId, id: this.singleId});
    this.card.single.push(variant);
    this.singleId++;
    if(this.card.single.length == 1){
      this.addSingle();
    }
  }

  addMultiple(){
    let variant: IVariant = ({value:'add answer'+this.multipleId, id: this.multipleId});
    this.card.multiple.push(variant);
    this.multipleId++;
    if(this.card.multiple.length == 1){
      this.addMultiple();
    }
  }

  addOpen(){
    if(!this.card.open){
      this.card.open = true;
    }
  }

  findMax(list: IVariant[]){
    let id: number =0;
    for (let el of list){
      if (el.id > id){
        id = el.id;
      }
    }
    return id+1;
  }

}
