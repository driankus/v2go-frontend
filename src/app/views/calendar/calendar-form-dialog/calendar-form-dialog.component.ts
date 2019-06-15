import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CalendarAppEvent } from 'src/app/shared/models/calendar-event.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Utils } from 'src/app/shared/utils';

interface DialogData {
  event?: CalendarEvent;
  action?: string;
  date?: Date;
  test?: string;
}
@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss']
})
export class CalendarFormDialogComponent implements OnInit {
  data: DialogData;
  event: CalendarEvent;
  dialogTitle: string;
  eventForm: FormGroup;
  action: string;

  ctrl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < this.event.start.getHours() || (value.hour === this.event.start.getHours() && value.minute < this.event.start.getMinutes())) {
      return {tooEarly: true};
    }
    if (value.hour > this.event.end.getHours() && value.minute > this.event.end.getMinutes()) {
      return {tooLate: true};
    }

    return null;
  });

  nextCtrl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < this.ctrl.value.hour || (value.hour < this.ctrl.value.hour && value.minute < this.ctrl.value.minute)) {
      return {invalid: true};
    }

    if (value.hour < this.event.start.getHours() && value.minute < this.event.start.getMinutes()) {
      return {tooEarly: true};
    }
    if (value.hour > this.event.end.getHours() || (value.hour === this.event.end.getHours() && value.minute > this.event.end.getMinutes())) {
      return {tooLate: true};
    }

    return null;
  });

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.action === 'edit') {
        this.dialogTitle = this.event.title;
      } else {
        this.dialogTitle = 'Add Event';
        this.event = new CalendarAppEvent(this.data.event);
        this.ctrl.setValue({'hour': this.event.start.getHours(), 'minute': this.event.start.getMinutes()});
        this.nextCtrl.setValue({'hour': this.event.end.getHours(), 'minute': this.event.end.getMinutes()});
      }
      this.eventForm = this.buildEventForm(this.event);

    }, 100);
    this.eventForm = this.buildEventForm(this.event);

  }
  buildEventForm(event: CalendarAppEvent = {start: null, title: null, color: {primary: '', secondary: ''}, meta: {location: '', notes: ''}}) {
    return new FormGroup({
      _id: new FormControl(event._id),
      title: new FormControl(event.title, Validators.required),
      allDay: new FormControl(event.allDay),
      color: this.formBuilder.group({
        primary: new FormControl(event.color.primary),
        secondary: new FormControl(event.color.secondary)
      }),
      meta: this.formBuilder.group({
        location: new FormControl(event.meta.location),
        notes: new FormControl(event.meta.notes)
      })
    });
  }

}
