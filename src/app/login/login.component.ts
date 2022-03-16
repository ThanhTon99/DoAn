
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { NotifyModel } from '../notify';
import { mergeWith, Subject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public notifyModel!: NotifyModel;

  @ViewChild('content') content: any;
  notifyData: any;
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
      accout: [''],
      password: [''],
      login: ['truoc'],
      display: [''],
      activate: true,
    })
    this.api.getNotifyByActivate().subscribe(res => {
      this.notifyData = res;
    })
    this.http.get<any>("http://localhost:3000/posts").subscribe(res => {
      const time = res.find((a: any) => {
        return a.login === this.loginForm.value.login && a.activate === this.loginForm.value.activate
          && a.display == ['tintuc']
      })
      const time2 = res.find((a: any) => {
        return a.login === this.loginForm.value.login && a.activate === this.loginForm.value.activate
          && a.display == ['thongbao']
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
        this.getAllNotify
      }
    })
  }

  newMessage() {
    this.api.changeMessage(`Đã Xem | ${this.todaydate.toLocaleString()}`)
  }
  login() {
    this.http.get<any>("http://localhost:3000/signupUsers")
      .subscribe(res => {
        const user = res.find((a: any) => {
          return a.accout === this.loginForm.value.accout && a.password === this.loginForm.value.password
        })
        if (user) {
          this.loginForm.reset()
          this.router.navigate(['dashboard'])
          this.http.get<any>("http://localhost:3000/posts").subscribe(res => {
            const time = res.find((a: any) => {
              return a.login == ['sau'] && a.activate == true && a.display == ['tintuc']
            })
            const time2 = res.find((a: any) => {
              return a.login == ['sau'] && a.activate == true && a.display == ['thongbao']
            })
            if (time) {
              this.open(this.content)
              this.showWatched = false
              this.showOut = true
            } else if (time2) {
              this.open(this.content)
              this.showWatched = true
              this.showOut = false
            } else {
              this.getAllNotify
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
  open(content: any) {
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
