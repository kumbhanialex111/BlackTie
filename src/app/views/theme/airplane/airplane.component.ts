import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { DataService } from '../../../data.service';

import { ModalDirective } from 'ngx-bootstrap/modal';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-airplane',
  templateUrl: './airplane.component.html',
  styleUrls: ['./airplane.component.scss']
})
export class AirplaneComponent implements OnInit {

  airplane:any;
  name:string;
  id:string;
  fileToUpload: File = null;

  myfile:any;
  file:any;
  imagePath:string;

  public primaryModal;
  constructor(
    private http: HttpClient,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.loadData(); 
  }
  loadData(){
    this.dataService.getAirplane()
    .subscribe(data => {
      this.airplane=data;
    });
  }

  deleteMe(id){
    this.dataService.deleteAirplane(id)
    .subscribe(data => {
      this.loadData();
    });
  }

  AddMe(){
    this.dataService.addAirplane(this.id,this.name,localStorage.getItem('imagePath'))
    .subscribe(data => {
      localStorage.setItem('imagePath','');
      this.id="";
      this.name="";
      this.loadData();
    });
  }

  handleFileInput(files: FileList) {
    console.log('file to upload',files.item(0));
    this.fileToUpload = files.item(0);

    AWS.config.update({
      accessKeyId: this.dataService.accessKeyId,
      secretAccessKey: this.dataService.secretAccessKey,
      region: "ap.south-1"
      });
      
      var s3 = new AWS.S3();
      var params = {
          Bucket: this.dataService.Bucket,
          Key: this.fileToUpload.name,
          Body: this.fileToUpload,
          ContentType:'image/jpeg',
          ACL: "public-read",
          AccessControlPolicy: {
            Grants: [
            {
                Grantee: {
                Type: 'AllUsers', 
                },
                Permission: 'READ'
            },
            ],
        },
      };
      s3.upload(params, function (err, res) {
          if (err) {
              console.log("Error uploading data: ", err);
          } else {
              console.log("Successfully uploaded data to myBucket/myKey",res.Location);
              this.imagePath=res.Location;
              localStorage.setItem("imagePath",res.Location);
          }
      });
  }

    fileEvent(files: FileList){
        this.file = files.item(0);
    }
}
