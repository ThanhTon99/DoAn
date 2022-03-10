import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-notify-manage',
  templateUrl: './notify-manage.component.html',
  styleUrls: ['./notify-manage.component.css']
})
export class NotifyManageComponent implements OnInit {
  notifyData: any
  message : any;
  formValue !: FormGroup

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit():void {
    this.formValue = this.formBuilder.group({
      title: [''],
      description: [''],
      content: [''],
      start: [''],
      end: [''],
      login: [''],
      display: [''],
      activate: true,
      //file: [''],
    })
    this.getAllNotify();
    this.api.currentMessage.subscribe(message => this.message = message)

}
getAllNotify() {
  this.api.getNotify().subscribe(res => {
    this.notifyData = res
  })
}
}