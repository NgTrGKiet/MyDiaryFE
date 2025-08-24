import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TaskComponent } from '../task.component';
import { HttpClientModule } from '@angular/common/http';
import { UserTask } from '../../models/UserTask';
import { DiaryService } from '../../service/diary.service';
import { DiaryDtos } from '../../models/DiaryDto/Diary';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TaskComponent, RouterOutlet],
  providers: [HttpClientModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  UserDiary: DiaryDtos[] = [];
  filteredTasks: DiaryDtos[] = [];

  searchTitle: string = '';
  searchStatus: string = '';
  searchPriority: string = '';

  constructor(private diaryService: DiaryService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadTasks();
  }

  applyFilter(): void {
    if (!this.searchTitle && !this.searchStatus && !this.searchPriority) {
      this.filteredTasks = this.UserDiary; // Nếu không có điều kiện tìm kiếm nào, hiển thị tất cả
    } else {
      this.filteredTasks = this.UserDiary.filter(diary => {
        const matchesTitle = this.searchTitle ? diary.diaryTitle.toLowerCase().includes(this.searchTitle.toLowerCase()) : true;
        const matchesStory = this.searchStatus ? diary.diaryStory === this.searchStatus : true;
        return matchesTitle && matchesStory;
      });
    }
  }

  loadTasks() {
    this.diaryService.getDiaries().subscribe((response) => {
      this.UserDiary = response.result.items;
      this.filteredTasks = response.result.items
    }, (error) => {
      window.alert('Error fetching tasks: ' + error);
    });
  }

  deleteTask(id: string): void {
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.diaryService.deleteDiary(id).subscribe((data) => {
        this.loadTasks()
      }, (error) => {
        window.alert('Error deleting task: ' + error);
      })
    }
  }
}
