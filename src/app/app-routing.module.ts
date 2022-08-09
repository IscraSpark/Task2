import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionManageComponent } from './components/question-manage/question-manage.component';

const routes: Routes = [
  {path: '', redirectTo: '/manage', pathMatch: 'full'},
  {path: 'manage', component: QuestionManageComponent},
  {path: 'edit/:id', component: QuestionEditComponent},
  {path: 'create', component: CreateQuestionComponent},
  {path: 'list', component: QuestionListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
