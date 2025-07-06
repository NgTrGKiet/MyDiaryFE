import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../models/User';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HomeComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      UserName: new FormControl(null, Validators.required),
      Password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      Name: new FormControl(null, Validators.required),
    })
  }

  onSubmit(): void {
    console.log(this.registerForm.value);
    const user: User = {
      UserName: this.registerForm.get('UserName')?.value,
      Password: this.registerForm.get('Password')?.value,
      Name: this.registerForm.get('Name')?.value
    }
    this.authService.Register(user).subscribe((data) => {
      this.router.navigate(['']);
    },
      error => {
        window.alert('Login failed: ' + error);
      })
  }
}
