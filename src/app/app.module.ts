import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { QuestionManageComponent } from './components/question-manage/question-manage.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialExampleModule } from 'src/material.module';
import { NavComponent } from './components/nav/nav.component';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

@NgModule({
  declarations: [
    AppComponent,
    CreateQuestionComponent,
    QuestionManageComponent,
    QuestionEditComponent,
    QuestionListComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'warn' },
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
