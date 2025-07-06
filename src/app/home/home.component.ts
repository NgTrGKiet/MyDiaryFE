import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TaskComponent } from '../task/task.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, TaskComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  loginForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      UserName: new FormControl(null, Validators.required),
      Password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    const user: User = {
      UserName: this.loginForm.get('UserName')?.value,
      Password: this.loginForm.get('Password')?.value,
    }
    this.authService.Login(user).subscribe((data) => {
      this.router.navigate(['/task']);
    },
      error => {
        window.alert('Login failed: ' + error);
      })
  }
}
