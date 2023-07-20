import { Component, OnInit } from '@angular/core';
import { Toast } from 'ngx-toastr';
import { ToasterService } from '../services/toaster.service';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  // search
  searchkey: string ="";
  allTransactions:any=[]  
  constructor(private api:ApiService, private toast:ToasterService){}
  ngOnInit(): void {
   this.api.transactions().subscribe({
    next:(response:any)=>{
      this.allTransactions = response
      console.log(this.allTransactions);
      
    },
    error:(err:any)=>{
      this.toast.showError(err.error,"Fail")
    }
   })
  }
generatePDF(){
  let pdf = new jspdf()
  // let title_row = ['type', 'Debit Account', 'Amount']
  // let table_body:any=[]
  pdf.setFontSize(16)
  pdf.text("Mini Statement",10,10)
  
  autoTable(pdf, { html: '#transactionHistory' })
  pdf.output("dataurlnewwindow")
  pdf.save("ministatement.pdf")
}

}
