import { Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './service/auth.guard';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    { path: 'register', component: RegisterComponent },
    {
        path: 'task', canActivate: [AuthGuard], component: TaskComponent, children: [
            { path: 'list', component: TaskListComponent },
            { path: 'new', component: TaskFormComponent },
            { path: ':id', component: TaskFormComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
