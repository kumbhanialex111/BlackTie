import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { DataService } from '../../../data.service';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  slider:any;
  fileToUpload: File = null;

  constructor(
    private http: HttpClient,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getAppSlider()
    .subscribe(data => {
      console.log('slider data',data);
      this.slider=data;
    });
  }

  deleteMe(id){
    this.dataService.deleteAppSlider(id)
    .subscribe(data => {
      this.loadData();
    });
  }

  AddMe(){
      console.log('add file ');
      this.dataService.addAppSlider(localStorage.getItem('imageSlidePath'))
      .subscribe(data => {
        localStorage.setItem('imageSlidePath','');
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
              console.log("imageSlidePath",res.Location);
              localStorage.setItem("imageSlidePath",res.Location);
          }
      });
  }
}
