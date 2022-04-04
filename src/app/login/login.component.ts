
import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { NotifyModel } from '../notify';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  notifyModel!: NotifyModel;

  @ViewChild('content') content: any;
  urls: string[] = [];
  notifyData : any ;
  notifyImage: any;
  closeResult = '';
  todaydate = new Date();
  showWatched !: boolean;
  showOut !: boolean;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal,
    private api: ApiService,
    
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Username: [''],
      Password: [''],
      Login: ['truoc'],
      Display: [''],
      Activate: true,    
    })
    
    this.api.getImage().subscribe(res=>{
      this.notifyImage = res
    })
    this.api.getNotifyByActivate().subscribe(res => {
      this.notifyData = res;
      //this.open(this.content)
    })
    this.http.get<any>("http://localhost:57050/api/notify").subscribe(res => {
      const time = res.find((a: any) => {
        return a.Login === this.loginForm.value.Login && a.Activate === this.loginForm.value.Activate
          && a.Display == ['tintuc']
      })
      const time2 = res.find((a: any) => {
        return a.Login === this.loginForm.value.Login && a.Activate === this.loginForm.value.Activate
          && a.Display == ['thongbao']
      })     
      if (time) {
        this.open(this.content)
        this.showWatched = false
        this.showOut = true
      }
      else if (time2) {
        this.open(this.content)
        this.showWatched = true
        this.showOut = false
      }  
      else {
        this.getAllNotify()
      }
    })
  }
  newMessage() {
    this.api.changeMessage(`Đã Xem | ${this.todaydate.toLocaleString()}`);
  }

  login() {
    this.api.getNotifyByActivate1().subscribe(res => {
      this.notifyData = res;
    })
    this.http.get<any>("http://localhost:57050/api/department")
      .subscribe(res => {
        const user = res.find((a: any) => {
          return a.Username === this.loginForm.value.Username && a.Password === this.loginForm.value.Password
        })
        if (user) {
          this.loginForm.reset()
          this.router.navigate(['dashboard'])
          this.http.get<any>("http://localhost:57050/api/notify").subscribe(res => {
            const time = res.find((a: any) => {
              return a.Login == ['sau'] && a.Activate == true && a.Display == ['tintuc']
            })
            const time2 = res.find((a: any) => {
              return a.Login == ['sau'] && a.Activate == true && a.Display == ['thongbao']
            })
            if (time) {
              this.open(this.content);
              this.showWatched = false
              this.showOut = true
            } else if (time2) {
              this.open(this.content)
              this.showWatched = true
              this.showOut = false
            } else {
              this.getAllNotify()
            }
          })
        } else {
          alert("Username or password is incorrect")
        }
      }, err => {
        alert("Something Wrong !!!")
      })
  }

  getAllNotify() {
    this.api.getNotify().subscribe(res => {
      this.notifyData = res;
    })
  }
  open(content:any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      })
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
