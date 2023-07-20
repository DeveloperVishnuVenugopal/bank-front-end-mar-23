import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  islogined: boolean = false
  // loginForm
  loginForm = this.fb.group({

    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })

  constructor(private fb: FormBuilder, private toaster: ToasterService, private api: ApiService, private loginRouter: Router) { }

  login() {

    if (this.loginForm.valid) {
      // user input
      let acno = this.loginForm.value.acno

      let pswd = this.loginForm.value.pswd

      // api service call
      this.api.login(acno, pswd).subscribe({
        next: (result: any) => {
          console.log(result);
          const {loginUser,token} = result
          // store username in local storage
          localStorage.setItem("loginUsername",loginUser.username)
          localStorage.setItem("loginAcno",loginUser.acno)
          localStorage.setItem("token",token)
          this.islogined = true

          setTimeout(() => {
            this.islogined = false
            this.toaster.showSuccess(`welcome '${loginUser.username}'`, "Success")
            this.loginRouter.navigateByUrl("user/dashboard")
          }, 3000);


        },
        error: (result: any) => {
          console.log(result.error);
          this.toaster.showError(result.error, "Error")
          setTimeout(() => {
            this.loginForm.reset()
          }, 3000);
        }
      })
    }

    else {
      this.toaster.showWarning('Invalid Form', 'Warning')
    }

  }
}
