import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './services/firestore.service';
import { Interview, Interviewee, Interviewer } from './models/models';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = "Interview Scheduler";

  interviewId: string = '';
  interviewer: string = '';
  interviewee: Array<string> = [''];
  timeSlot: string = '';

  interviewersList: Array<Interviewer> = [];
  intervieweesList: Array<Interviewee> = [];

  interviewsList: Array<Interview> = [];

  timeSlots = [
    'June 13, 2021 08:00',
    'June 13, 2021 09:00',
    'June 13, 2021 10:00',
    'June 13, 2021 11:00',
    'June 13, 2021 12:00',
    'June 13, 2021 16:00',
    'June 13, 2021 17:00',
    'June 13, 2021 18:00',
    'June 13, 2021 19:00',
    'June 13, 2021 20:00',
    'June 13, 2021 21:00',
    'June 13, 2021 22:00',
  ];

  constructor(private firestoreService: FirestoreService) {
  }

  generateId(str: string) {
    var s = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      s = ((s << 5) - s) + chr;
      s |= 0;
    }
    return (s < 0 ? (-1 * s) : s).toString();
  };

  getTimeName(str: string) {
    return new Date(parseInt(str)).toString();
  }

  ngOnInit() {
    this.firestoreService.getInterviewers().subscribe(data => {
      this.interviewersList = data.map(e => {
        return e.payload.doc.data() as Interviewer;
      })
    });
    this.firestoreService.getInterviewees().subscribe(data => {
      this.intervieweesList = data.map(e => {
        return e.payload.doc.data() as Interviewee;
      })
    });
    this.firestoreService.getInterviews().subscribe(data => {
      this.interviewsList = data.map(e => {
        return e.payload.doc.data() as Interview;
      })
    });
  }

  createInterview() {
    let interviewObj: Interview = {
      id: this.interviewId,
      interviewer: this.interviewer,
      interviewees: this.interviewee,
      timeSlot: new Date(this.timeSlot).getTime().toString()
    };
    this.firestoreService.createInterview(interviewObj);
  }

  editInterview(interview: Interview) {
    this.interviewId = interview.id;
    this.interviewer = interview.interviewer;
    this.interviewee = interview.interviewees;
    this.timeSlot = interview.timeSlot;
  }

  testFunc() {
    let interviewers: Interviewer[] = [
      {
        email: 'interviewer@test.com',
        availableTimings: [
          new Date('June 13 2021, 08:00').getTime().toString(),
          new Date('June 13 2021, 09:00').getTime().toString(),
          new Date('June 13 2021, 10:00').getTime().toString(),
          new Date('June 13 2021, 11:00').getTime().toString(),
          new Date('June 13 2021, 12:00').getTime().toString()
        ],
        bookedTimings: []
      },
      {
        email: 'interviewer1@test.com',
        availableTimings: this.timeSlots.map(time => new Date(time).getTime().toString()),
        bookedTimings: []
      },
      {
        email: 'interviewer2@test.com',
        availableTimings: this.timeSlots.map(time => new Date(time).getTime().toString()),
        bookedTimings: []
      },
    ];

    let interviewees: Interviewee[] = [
      {
        email: 'interviewee@test.com',
        availableTimings: this.timeSlots.map(time => new Date(time).getTime().toString()),
        bookedTimings: [],
        resume: ''
      },
      {
        email: 'interviewee1@test.com',
        availableTimings: this.timeSlots.map(time => new Date(time).getTime().toString()),
        bookedTimings: [],
        resume: ''
      },
      {
        email: 'interviewee2@test.com',
        availableTimings: this.timeSlots.map(time => new Date(time).getTime().toString()),
        bookedTimings: [],
        resume: ''
      },
    ];

    // let interview: Interview = {
    //   id: '1001',
    //   interviewer: 'interviewer@test.com',
    //   interviewees: ['interviewee1@test.com', 'interviewee2@test.com'],
    //   timeSlot: new Date('June 13, 2021 09:00:00').getTime().toString()
    // };

    interviewers.map(interviewer => this.firestoreService.createInterviewer(interviewer));
    interviewees.map(interviewee => this.firestoreService.createInterviewee(interviewee));

    // this.firestoreService.getInterviewers().subscribe(data => {
    //   let temp = data.map(e => {
    //     return e.payload.doc.data();
    //   })
    //   console.log(temp);
    // });

    // this.firestoreService.getInterviewees().subscribe(data => {
    //   let temp = data.map(e => {
    //     return e.payload.doc.data();
    //   })
    //   console.log(temp);
    // });

    // this.firestoreService.getInterviewer(interviewers[0].email).subscribe(doc => {
    //   console.log(this.firestoreService.isAvailable(
    //     (doc.data() as Interviewer).availableTimings,
    //     new Date('June 13, 2021 08:00:00').getTime().toString()
    //   ));
    // });

    // this.firestoreService.validateInterview(interview).then(data => console.log(data));
  }
}
