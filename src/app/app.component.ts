import { Component } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import { Observable } from 'rxjs';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title="Interview Scheduler";
  items = ["Interviewer 1", "Interviewee 1"];
  itValue=' ';
  its: Observable<any[]>;

  constructor(public db: AngularFireDatabase){
    this.its=db.list('its').valueChanges();
  }
  selectedValue: string = '';
  newItem = "";
  newItem1 = "";
  pushItem(){
    if(this.newItem != "") {
      this.items.push(this.newItem);
      this.newItem="";
    }
    if(this.newItem1 != "") {
      this.items.push(this.newItem1);
      this.newItem1="";
    }
  }

  foods: Food[] = [
    {value: '9am-0', viewValue: '15/06/2021-9.00am-10.00am'},
    {value: '11am-1', viewValue: '15/06/2021-11.00am-12.00am'},
    {value: '4pm-2', viewValue: '15/06/2021-4.00pm-5.00pm'}
  ];

removeItem(index:number){
  this.items.splice(index,1);
}
}
