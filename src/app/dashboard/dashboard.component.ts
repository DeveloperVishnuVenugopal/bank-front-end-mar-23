import { Component, OnInit, Output } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Toast, ToastRef } from 'ngx-toastr';
import { ToasterService } from '../services/toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: string = ""

  
  // acno:any=localStorage.getItem("loginAcno")
  balance: number = 0
  balancesuccessStatus: boolean = false

  // fund form
  transferForm = this.fb.group({

    creditacno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]

  })

  constructor(private api: ApiService, private toast: ToasterService, private fb: FormBuilder, private dashboardRouter:Router) { }
  

  ngOnInit(): void {
    if (localStorage.getItem("loginUsername")) {
      this.user = localStorage.getItem("loginUsername") || ""
    }
  }
  getbalance() {
    const acno = localStorage.getItem("loginAcno")
    this.api.getbalance(acno).subscribe({
      next: (Output: any) => {
        this.balancesuccessStatus = true
        this.balance = Output

      },
      error: (err: any) => {
        // alert(err.error)
        this.toast.showWarning(err.error, "warning")

      }
    })
  }

  transfer(){
    if(this.transferForm.valid){
      let creditAcno= this.transferForm.value.creditacno
      let amount=this.transferForm.value.amount
      this.api.fundtransfer(creditAcno,amount).subscribe({
        next:(Response:any)=>{
          this.toast.showSuccess(Response,"success")
        },
        error:(err:any)=>{
          this.toast.showError(err.error,"failed")
        }
      })
    }
    else{
      this.toast.showWarning("invalid form","Warning")
    }
  }

  // DeleteAccount
  deleteacount(){

    this.api.deleteAcno().subscribe({
      next:(response:any)=>{
        // localStorage.removeItem("loginUsername")
        // localStorage.removeItem("loginAcno")
        // localStorage.removeItem("token")
        // localStorage.clear() 
        this.toast.showSuccess(response,"Success")
        this.logout()
        // setTimeout(() => {
        //   this.dashboardRouter.navigateByUrl("")
        // }, 2000);
      },
      error:(err:any)=>{
        this.toast.showError(err.message, "Error")
      }
    })
  }


  // logout 
  logout(){
        localStorage.removeItem("loginUsername")
        localStorage.removeItem("loginAcno")
        localStorage.removeItem("token")
        setTimeout(() => {
          this.dashboardRouter.navigateByUrl("")
        }, 1000);
  }
}
