import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { ApiService } from '../services/api.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // form group/model
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(2)]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })
  constructor(private fb: FormBuilder, private toaster: ToasterService, private api: ApiService, private registerRouter:Router) { }

  // register
  register() {

    if (this.registerForm.valid) {
      let username = this.registerForm.value.username
      let acno = this.registerForm.value.acno

      let pswd = this.registerForm.value.pswd
      // api service call
      this.api.register(username, acno, pswd).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toaster.showSuccess(`${res.username} registered successfully`,"success")
          // navigate to log in
          setTimeout(() => {
            this.registerRouter.navigateByUrl("user/login")
          }, 3000);

        },
        error:(err:any)=>{
          console.log(err.error);
          this.toaster.showError(`${err.error}`,"failed")
          setTimeout(() => {
            this.registerForm.reset()
          }, 3000);
          
        }
      })
    }
    // user input
    else {
      this.toaster.showWarning('Invalid Form', 'Warning')
    }

  }
}
