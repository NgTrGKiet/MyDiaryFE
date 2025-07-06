import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskComponent } from '../task.component';
import { TaskService } from '../../service/task.service';
import { APIResponse } from '../../models/APIResponse';
import { UserTask } from '../../models/UserTask';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, TaskComponent, ToastrModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  taskForm: FormGroup = new FormGroup({});
  isEditMode: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private taskService: TaskService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    })

    let id = this.route.snapshot.params['id'];
    if (id) {
      id = +id;
      this.isEditMode = true;
      this.taskService.getTask(id).subscribe((response: APIResponse) => {
        if (response) {
          console.log(response);
          this.taskForm.patchValue(response.result)
        }
      })
    }
  }

  private handleTaskOperation(task: UserTask, id: number): void {
    const operation = this.isEditMode
      ? this.taskService.updateTask(id, task)
      : this.taskService.createTask(task);

    operation.subscribe(
      () => {
        const message = this.isEditMode ? 'Task updated successfully' : 'Task created successfully';
        console.log(message);
        this.router.navigate(['/task/list']);
      },
      error => {
        const errorMessage = this.isEditMode ? 'Error updating task' : 'Error creating task';
        window.alert(`${errorMessage}: ${error}`);
      }
    );
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if (window.confirm("Are you sure you want to proceed?")) {
        let UserTask: UserTask = this.taskForm.value;
        let id = this.route.snapshot.params['id'];
        if (id) {
          UserTask.id = id;
        }
        this.handleTaskOperation(UserTask, id)
      }
    }
  }
}
