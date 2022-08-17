import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ICard, IVariant } from 'src/app/models/interfaces';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
})
export class QuestionEditComponent implements OnInit {
  elementsList: string[] = ['single', 'multiple', 'open'];
  element!: string; // chousen type
  singleId: number = 0;
  multipleId: number = 0;
  openId: boolean = false;
  questionType!: string;
  hideAdd: boolean = true; // add button avalability
  card!: ICard;
  id!: number;
  mode: string = 'edit';
  form: FormGroup = this.fb.group({
    question: 'Input your question',
    singles: this.fb.array([]),
    multiples: this.fb.array([]),
    open: this.fb.array([]),
  });

  constructor(
    private lsService: LocalstorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.router.url == '/create') {
      this.mode = 'create';
      this.card = {
        id: 0,
        type: '',
        question: 'Input your question',
        single: [],
        multiple: [],
        open: false,
        date: 0,
        answered: false,
        answerDate: undefined,
      };
    } else {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      this.card = this.lsService.getCardById(this.id);

      this.singleId = this.findMax(this.card.single);
      this.multipleId = this.findMax(this.card.multiple);

      this.questionType = this.card.type;
      this.element = this.card.type;
      this.fillForm();
    }
  }

  get singles() {
    return this.form.get('singles') as FormArray;
  }

  get multiples() {
    return this.form.get('multiples') as FormArray;
  }

  get open() {
    return this.form.get('open') as FormArray;
  }

  addOpenForm() {
    this.open.push(this.fb.control(''));
  }

  addSingleForm(single: IVariant) {
    this.singles.push(
      this.fb.group({
        text: [single.value, Validators.required],
        radio: { value: '', disabled: true },
      })
    );
  }

  addMultipleForm(multiple: IVariant) {
    this.multiples.push(
      this.fb.group({
        text: multiple.value,
        inp: { value: '', disabled: true },
      })
    );
  }

  fillForm() {
    this.form.patchValue({ question: this.card.question });
    if (this.card.type == 'open') {
      this.addOpenForm();
    }
    if (this.card.type == 'single') {
      this.hideAdd = false;
      this.card.single.forEach((single) => {
        this.addSingleForm(single);
      });
    }
    if (this.card.type == 'multiple') {
      this.hideAdd = false;
      this.card.multiple.forEach((multiple) => {
        this.addMultipleForm(multiple);
      });
    }
  }

  formToCard() {
    // put data from form to card before saving
    this.card.question = this.form.value.question;
    if (this.card.type == 'open') {
    }

    if (this.card.type == 'single') {
      let single: IVariant[] = [];
      this.form.value.singles.forEach((el: any, index: number) => {
        single.push({ value: el.text as string, id: index });
      });
      this.card.single = single;
    }

    if (this.card.type == 'multiple') {
      let multiple: IVariant[] = [];
      this.form.value.multiples.forEach((el: any, index: number) => {
        multiple.push({ value: el.text as string, id: index });
      });
      this.card.multiple = multiple;
    }
  }

  edit() {
    if (this.mode == 'create') {
      let cardid: number = this.lsService.getId();
      if (cardid == null) {
        cardid = 1;
      }

      let date: number = Date.now();
      this.card.id = cardid;
      this.card.type = this.element;
      this.card.date = date;
      this.formToCard();

      this.lsService.addCard(this.card);
      cardid++;
      this.lsService.setNewId(cardid);
      this.router.navigateByUrl('/manage');
    } else {
      this.card.type = this.element;
      this.formToCard();
      this.lsService.saveEdit(this.id, this.card);
      this.router.navigateByUrl('/manage');
    }
  }

  undo() {
    if (this.mode == 'create') {
      this.clear(); // function see below
    } else {
      this.clear();
      this.card = this.lsService.getCardById(this.id);
      this.fillForm();
    }
  }

  add() {
    if (this.element == 'single') {
      this.addSingle();
    }

    if (this.element == 'multiple') {
      this.addMultiple();
    }

    if (this.element == 'open') {
      this.addOpen();
    }
  }

  addSingle() {
    let variant: IVariant = {
      value: 'add answer' + this.singleId,
      id: this.singleId,
    };
    this.singleId++;
    this.addSingleForm(variant);

    if (this.card.single.length == 1) {
      this.addSingle();
    }
  }

  addMultiple() {
    let variant: IVariant = {
      value: 'add answer' + this.multipleId,
      id: this.multipleId,
    };
    this.multipleId++;
    this.addMultipleForm(variant);

    if (this.card.multiple.length == 1) {
      this.addMultiple();
    }
  }

  addOpen() {
    if (!this.card.open) {
      this.card.open = true;
      this.addOpenForm();
    }
  }

  findMax(list: IVariant[]) {
    //get max id + 1
    let id: number = 0;
    for (let el of list) {
      if (el.id > id) {
        id = el.id;
      }
    }
    return id + 1;
  }

  clear() {
    this.card.single = [];
    this.card.multiple = [];
    this.card.open = false;
    this.card.question = 'Input your question';
    this.singles.clear();
    this.multiples.clear();
    this.open.clear();
    this.multipleId = 0;
    this.singleId = 0;
  }

  onChange(e: any) {
    this.clear();

    if (e.value == 'open') {
      this.hideAdd = true;
    } else {
      this.hideAdd = false;
    }
    this.element = e.value;
    this.add();
  }
}
