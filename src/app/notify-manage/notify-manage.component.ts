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
  notifyData: any;
  message: any;
  notifyMessage:any;
  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.api.getNotify().subscribe(res => {
      this.notifyData = res
    })
    this.api.getMessage().subscribe(res=>{
      this.notifyMessage = res;
    })
    this.api.currentMessage.subscribe(message => this.message = message)
  }

}