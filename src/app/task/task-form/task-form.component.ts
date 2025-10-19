import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskComponent } from '../task.component';
import { DiaryService } from '../../service/diary.service';
import { APIResponse } from '../../models/APIResponse';
import { UserTask } from '../../models/UserTask';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CreateDiaryDtos } from '../../models/DiaryDto/CreateDiary';
import { UpdateDiaryDtos } from '../../models/DiaryDto/UpdateDiary';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, TaskComponent, ToastrModule, MatFormFieldModule, MatButtonModule, MatNativeDateModule, MatDatepickerModule, MatInputModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  diaryForm: FormGroup = new FormGroup({});
  isEditMode: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private diaryService: DiaryService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.diaryForm = new FormGroup({
      diaryTitle: new FormControl(null),
      diaryStory: new FormControl(null),
      createdTime: new FormControl({ value: null, disabled: this.isEditMode }),
    })

    let id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.diaryService.getDiary(id).subscribe((response: APIResponse) => {
        if (response) {
          const diary = response.result;

          if (diary.createdTime) {
            const [day, month, year] = diary.createdTime.split('-').map(Number);
            diary.createdTime = new Date(year, month - 1, day);
          }

          this.diaryForm.patchValue(diary)

          this.diaryForm.get('createdTime')?.disable();
        }
      })
    }
  }

  public onSubmit() {
    if (this.diaryForm.valid) {
      if (window.confirm("Are you sure you want to proceed?")) {
        let diary = this.diaryForm.value;
        let id = this.route.snapshot.params['id'];
        if (id) {
          let updateDiary: UpdateDiaryDtos = {
            diaryId: id,
            diaryTitle: diary.diaryTitle,
            diaryStory: diary.diaryStory
          }
          this.handleUpdateDiaryOperation(updateDiary);
        } else {
          let createDiary: CreateDiaryDtos = {
            diaryStory: diary.diaryStory,
            diaryTitle: diary.diaryTitle,
            createdTime: diary.createdTime
          }
          this.handleCreateDiaryOperation(createDiary);
        }
      }
    }
  }

  private handleUpdateDiaryOperation(diary: UpdateDiaryDtos): void {
    console.log(diary);
    this.diaryService.updateDiary(diary).subscribe(
      () => {
        const message = this.isEditMode ? 'Task updated successfully' : 'Task created successfully';
        console.log(message);
        this.router.navigate(['/diary/list']);
      },
      error => {
        const errorMessage = this.isEditMode ? 'Error updating task' : 'Error creating task';
        window.alert(`${errorMessage}: ${error}`);
      }
    );
  }

  private handleCreateDiaryOperation(diary: CreateDiaryDtos): void {
    console.log(diary)

    this.diaryService.createDiary(diary).subscribe(
      () => {
        const message = this.isEditMode ? 'Task updated successfully' : 'Task created successfully';
        console.log(message);
        this.router.navigate(['/diary/list']);
      },
      error => {
        const errorMessage = this.isEditMode ? 'Error updating task' : 'Error creating task';
        window.alert(`${errorMessage}: ${error}`);
      }
    );
  }
}
