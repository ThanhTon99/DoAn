import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { UserModule } from '../user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild('formValue') formValue !: FormGroup;
  userModule: UserModule = new UserModule();
  userData: any;
  showAdd!: boolean;
  showUpdate !:boolean;
  filter:any;
  constructor(
    private api : ApiService,
    private http :HttpClient,

  ) { }

  ngOnInit() {
    this.getAlluser()
  }

  getAlluser(){
    this.api.getUser().subscribe((res)=>{
      this.userData = res
    })
  }
  clickAddUser(){
    this.formValue.reset()
    this.showAdd = true
    this.showUpdate = false
  }
  onEdit(row: any){
    this.showAdd = false
    this.showUpdate = true
    this.userModule = row
  }
  deleteUser(row: any){
    this.api.deleteUser(row.UserId).subscribe(()=>{
      alert("User Deleted")
      this.getAlluser();
    })
  }
  postUserDatails(){
    this.http.post<any>("http://localhost:57050/api/department", this.formValue.value).subscribe(res=>{
      console.log(res);
      alert("User Added Successfully")
      let ref = document.getElementById('cancel')
      ref?.click()
      this.getAlluser()
    }, () => {
      alert("Something Wrong")
    })
  }
  updateUserDatails(){
    this.api.updateUser(this.userModule).subscribe(res => {
      console.log(res);
      alert("Notify Update Seccessfully")
      let ref = document.getElementById('cancel')
      ref?.click()
      //this.formValue.reset()
      this.getAlluser()
    }, () => {
      alert("Something Wrong")
    })
  }

}
