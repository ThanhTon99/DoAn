import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { NotifyModel } from '../notify';
@Component({
  selector: 'app-notify-dashboard',
  templateUrl: './notify-dashboard.component.html',
  styleUrls: ['./notify-dashboard.component.css'],

})
export class NotifyDashboardComponent implements OnInit {

  PhotoFileName: any;
  notify: NotifyModel | undefined
  urls: string[] = [];
  @ViewChild('content') content !: boolean;
  @ViewChild('formValue') formValue !: FormGroup;
  notifyModelObj: NotifyModel = new NotifyModel()
  notifyData: any = [];
  showAdd !: boolean
  showUpdate!: boolean
  closeResult = ''
  todaydate = new Date()
  message: any;

  selectedFile !: File
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private http: HttpClient

  ) { }

  ngOnInit(): void {
    this.getAllNotify();
  }

  onFileSelected(event: any) {

    this.selectedFile = <File>event.target.files[0];
    const filedata = new FormData();
    filedata.append('files', this.selectedFile, this.selectedFile?.name)
    this.http.post("http://localhost:57050/api/notify/upload", filedata).subscribe(
      res => {
        console.log(res);
      }
    )
  }
  onUpload(fileInput: any) {
    var reader = new FileReader();
    reader.readAsDataURL(fileInput.target.files[0]);
    reader.onload = (events: any) => {
      this.urls = [];
      this.urls.push(events.target.result)
    }
    const file = fileInput.target.files[0];
    this.notifyModelObj.PhotoFileName = file.name;
  }

  clickAddNotify() {
    this.urls = [];
    this.formValue.reset()
    this.showAdd = true
    this.showUpdate = false
  }
  onEdit(row: any) {
    this.urls = [];
    this.showAdd = false
    this.showUpdate = true
    this.notifyModelObj = row
    this.urls.push("http://localhost:57050/Photos/" + row.PhotoFileName)
  }
  postNotifyDatails() {
    this.urls = [];
    this.api.postNotify(this.notifyModelObj).subscribe(res => {
      console.log(res);
      alert("Notify Addded Successfully")
      let ref = document.getElementById('cancel')
      ref?.click()
      this.notifyModelObj.PhotoFileName
      this.getAllNotify()
    }, () => {
      alert("Something Wrong")
    })
  }

  updateNotifyDatails() {
    this.api.updateNotify(this.notifyModelObj).subscribe(res => {
      console.log(res);
      alert("Notify Update Seccessfully")
      let ref = document.getElementById('cancel')
      ref?.click()
      //this.formValue.reset()
      this.getAllNotify()
    }, () => {
      alert("Something Wrong")
    })
  }

  getAllNotify() {
    this.api.getNotify().subscribe(res => {
      this.notifyData = res;
    })
  }
  deleteNotify(row: any) {
    this.api.deleteNotify(row.NotifyId).subscribe(() => {
      alert("Notify Deleted")
      this.getAllNotify()
    })
  }

}
