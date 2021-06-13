import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Interviewer, Interviewee, Interview } from '../models/models'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  //Interviewer Functions

  getInterviewers() {
    return this.firestore.collection('interviewers').snapshotChanges();
  }

  getInterviewer(interviewerEmail: string) {
    return this.firestore.doc('interviewers/' + interviewerEmail).get();
  }

  createInterviewer(interviewer: Interviewer) {
    return this.firestore.collection('interviewers').doc(interviewer.email).set(interviewer);
  }

  updateInterviewer(interviewer: Interviewer) {
    this.firestore.doc('interviewers/' + interviewer.email).update(interviewer);
  }

  deleteInterviewer(interviewer: Interviewer) {
    this.firestore.doc('interviewers/' + interviewer.email).delete();
  }

  bookInterviewerTime(interviewerEmail: string, timeSlot: string) {
    let temp: Interviewer;
    this.getInterviewer(interviewerEmail).subscribe(doc => {
      temp = doc.data() as Interviewer;
      temp.bookedTimings.push(timeSlot);
      let index = temp.availableTimings.indexOf(timeSlot);
      temp.availableTimings.splice(index, 1);
      this.updateInterviewer(temp);
    });
  }

  // Interviewee Fucnctions

  getInterviewees() {
    return this.firestore.collection('interviewees').snapshotChanges();
  }

  getInterviewee(intervieweeEmail: string) {
    return this.firestore.doc('interviewees/' + intervieweeEmail).get();
  }

  createInterviewee(interviewee: Interviewee) {
    return this.firestore.collection('interviewees').doc(interviewee.email).set(interviewee);
  }

  updateInterviewee(interviewee: Interviewee) {
    this.firestore.doc('interviewees/' + interviewee.email).update(interviewee);
  }

  deleteInterviewee(interviewee: Interviewee) {
    this.firestore.doc('interviewees/' + interviewee.email).delete();
  }

  bookIntervieweeTime(intervieweeEmail: string, timeSlot: string) {
    let temp: Interviewee;
    this.getInterviewee(intervieweeEmail).subscribe(doc => {
      temp = doc.data() as Interviewee;
      temp.bookedTimings.push(timeSlot);
      let index = temp.availableTimings.indexOf(timeSlot);
      temp.availableTimings.splice(index, 1);
      this.updateInterviewee(temp);
    });
  }

  // Interview Functions

  getInterviews() {
    return this.firestore.collection('interviews').snapshotChanges();
  }

  createInterview(interview: Interview) {
    console.log('Trying to create interview');
    if (this.validateInterview(interview)) {
      console.log('creating interview');
      this.firestore.collection('interviews').doc(interview.id).set(interview).then(el => console.log('created interview', el));
      this.bookInterviewerTime(interview.interviewer, interview.timeSlot);
      interview.interviewees.map(interviewee => this.bookIntervieweeTime(interviewee, interview.timeSlot));
      return interview;
    } else {
      alert('Invalid Interview!');
      return null;
    }
  }

  updateInterview(interview: Interview) {
    if (this.validateInterview(interview)) {
      return this.firestore.doc('interviews/' + interview.id).update(interview);
    } else {
      return null;
    }
  }

  validateInterview(interview: Interview): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let interviewer: Interviewer, interviewees: Array<Interviewee> = [];
      if (interview.interviewer && interview.interviewees && interview.timeSlot) {
        // Now Atleast Two Participants are present

        this.getInterviewer(interview.interviewer).subscribe(doc => {
          interviewer = doc.data() as Interviewer;
          interview.interviewees.map(el => {
            this.getInterviewee(el).subscribe(doc => {
              interviewees.push(doc.data() as Interviewee);
              // Return True if <interviewer> and the <interviewees> are available
              resolve(this.isAvailable(interviewer!.availableTimings, interview.timeSlot) && interviewees.every(el => this.isAvailable(el.availableTimings, interview.timeSlot)));
            });
          });
        });
      }
      else if(!interview.interviewer || !interview.interviewees)
      console.log('Please select 2 participants!');

      else
      console.log('Time slot is already booked');
    });
  }

  // Util Functions

  isAvailable(availableTimings: string[], time: string) {
    return availableTimings.includes(time);
  }
}
