import { Component } from '@angular/core';

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
  items = ["Participant 1", "Participant 2"];
  newItem = "";
  pushItem(){
    if(this.newItem != "") {
      this.items.push(this.newItem);
      this.newItem="";
    }
  }
  foods: Food[] = [
    {value: '9am-0', viewValue: '9.00am-10.00am'},
    {value: '11am-1', viewValue: '11.00am-12.00am'},
    {value: '4pm-2', viewValue: '4.00pm-5.00pm'}
  ];

removeItem(index:number){
  this.items.splice(index,1);
}
}
