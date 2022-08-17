import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import {
  validateCheckBox,
  validateRadioButton,
} from 'src/app/models/custom-validators';
import { ICard, IValid, IVariant } from 'src/app/models/interfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card: ICard = {
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
  @Output() onChanged = new EventEmitter<IValid>();
  
  form: FormGroup = this.fb.group({
    question: [this.card.question],
    singles: this.fb.array([], validateRadioButton),
    multiples: this.fb.array([], validateCheckBox),
    open: this.fb.array([]),
  });

  mode: string = 'list';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    if (this.router.url == '/manage') {
      this.mode = 'manage';
    }

    if (this.card) {
      // filling form

      this.form.patchValue({ question: this.card.question });
      if (this.card.type == 'open') {
        this.addOpen();
      }

      if (this.card.type == 'single') {
        this.card.single.forEach((single, index) => {
          this.addSingle(single, index);
        });
      }

      if (this.card.type == 'multiple') {
        this.card.multiple.forEach((multiple, index) => {
          this.addMultiple(multiple, index);
        });
      }

      this.form.valueChanges.subscribe((value) => {
        if (this.card.type == 'open') {
          this.card.openValue = value.open[0]; // get information from open form, can be only 1 input in open question
        }

        if (this.card.type == 'single') {
          // get checked radio
          if (this.card.singleValue || this.card.singleValue == 0) {
            value.singles[this.card.singleValue].radio = false; // uncheck previos button
          }
          value.singles.forEach((el: any, index: number) => {
            if (el.radio) {
              this.card.singleValue = index;
            }
          });
        }

        if (this.card.type == 'multiple') {
          // get data from checkbox
          let list: number[] = [];
          value.multiples.forEach((el: any, index: number) => {
            if (el.inp) {
              list.push(index);
            }
          });

          if (list.length) {
            this.card.multipleValue = list;
          } else {
          }
        }

        this.onChanged.emit({ valid: this.form.valid, card: this.card });
      });
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

  addOpen() {
    if (this.mode == 'manage') {
      this.open.push(this.fb.control({ value: '', disabled: true }));
    }

    if (this.mode == 'list') {
      if (this.card.answered) {
        let text: string = this.card.openValue as string;
        this.open.push(this.fb.control({ value: text, disabled: true }));
      } else {
        this.open.push(
          this.fb.control('', [Validators.required, Validators.maxLength(255)])
        );
      }
    }
  }

  addSingle(single: IVariant, index: number) {
    if (this.mode == 'manage') {
      this.singles.push(
        this.fb.group({
          text: single.value,
          radio: { value: '', disabled: true },
        })
      );
    }

    if (this.mode == 'list') {
      if (this.card.answered) {
        let value: boolean = false;
        if (this.card.singleValue == index) {
          value = true;
        }
        this.singles.push(
          this.fb.group({
            text: single.value,
            radio: { value: value, disabled: true },
          })
        );
      } else {
        this.singles.push(
          this.fb.group({
            text: single.value,
            radio: [false],
          })
        );
      }
    }
  }

  addMultiple(multiple: IVariant, index: number) {
    if (this.mode == 'manage') {
      this.multiples.push(
        this.fb.group({
          text: multiple.value,
          inp: { value: '', disabled: true },
        })
      );
    }

    if (this.mode == 'list') {
      if (this.card.answered) {
        let value: boolean = false;
        if (this.card.multipleValue?.indexOf(index) != -1) {
          value = true;
        }
        this.multiples.push(
          this.fb.group({
            text: multiple.value,
            inp: { value: value, disabled: true },
          })
        );
      } else {
        this.multiples.push(
          this.fb.group({
            text: multiple.value,
            inp: [false],
          })
        );
      }
    }
  }
}
