import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TaskComponent } from '../task.component';
import { HttpClientModule } from '@angular/common/http';
import { UserTask } from '../../models/UserTask';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TaskComponent, RouterOutlet],
  providers: [HttpClientModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  UserTask: UserTask[] = [];
  filteredTasks: UserTask[] = [];

  searchTitle: string = '';
  searchStatus: string = '';
  searchPriority: string = '';

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadTasks();
  }

  applyFilter(): void {
    if (!this.searchTitle && !this.searchStatus && !this.searchPriority) {
      this.filteredTasks = this.UserTask; // Nếu không có điều kiện tìm kiếm nào, hiển thị tất cả
    } else {
      this.filteredTasks = this.UserTask.filter(task => {
        const matchesTitle = this.searchTitle ? task.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true;
        const matchesStatus = this.searchStatus ? task.status === this.searchStatus : true;
        const matchesPriority = this.searchPriority ? task.priority === this.searchPriority : true;
        return matchesTitle && matchesStatus && matchesPriority;
      });
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((response) => {
      this.UserTask = response.result;
      this.filteredTasks = response.result
    }, (error) => {
      window.alert('Error fetching tasks: ' + error);
    });
  }

  deleteTask(id: number): void {
    if (window.confirm('Are you sure you want to delete this task?')) {
      id = +id;
      this.taskService.deleteTask(id).subscribe((data) => {
        console.log('Delete request got processed');
        this.loadTasks()
      }, (error) => {
        window.alert('Error deleting task: ' + error);
      })
    }
  }
}
