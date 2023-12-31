import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide: boolean = true;  
  loginError:string = "";
  user!: User | any;


  loginForm = this.formBuilder.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    password: ['', [Validators.required]]
  })

  get password() { return this.loginForm.controls.password; }
  get dni() { return this.loginForm.controls.dni; }

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService){ }  

  login(){
    if(this.loginForm.valid){
      this.userService.getUsers().subscribe({
          next: (userData) => {    
            this.user = userData.find(u => u.dni === Number(this.dni.value));

            if(this.user) {
              if(this.user.contrasenia === this.password.value) {
                  localStorage.setItem("userId", JSON.stringify(this.user.id));
                  localStorage.setItem("userType", JSON.stringify(this.user.tipo));
                  this.user.tipo.includes("ADMIN") 
                      ? this.router.navigateByUrl("/admin-home")
                      : this.router.navigateByUrl("/user-home") 
                                   
                  this.loginForm.reset();
              } else {
                this.loginError = "Contraseña incorrecta";
              }
            } else {
              this.loginError = "Usuario no Registrado";
            }
          },
          error: (errorData) => {
            console.error(errorData);
          }
      })    
    }else {
        this.loginForm.markAllAsTouched();
    }
  }
}
