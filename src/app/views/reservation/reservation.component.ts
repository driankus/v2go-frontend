import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChargingStation } from '../../shared/models/charging-station';
import { EventCS } from '../../shared/models/event-cs';
import {
  ReservationService,
  MainService
} from '../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CalendarAppEvent } from 'src/app/shared/models/calendar-event.model';
import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEvent
} from "angular-calendar";
import { CalendarAppService } from "../calendar/calendar-app.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CalendarFormDialogComponent } from "../calendar/calendar-form-dialog/calendar-form-dialog.component";
import { Utils } from "src/app/shared/utils";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"]
})
export class ReservationComponent implements OnInit {
  eventCss: EventCS[];
  evNk = '55f002a97554ae0a6ffd021311eca1b5';
  csNk: string;
  chargingStation: ChargingStation;
  dataLoaded: Promise<boolean>;

  isReserved = false;

  @ViewChild('eventDeleteConfirm') eventDeleteConfirm;
  public refresh: Subject<any> = new Subject();
  public events: CalendarAppEvent[] = [];
  private today = new Date();
  private startWeekOn = this.today.getDay();
  private colors = {
    'AVAILABLE': '#9ACD32',
    'RESERVED': '#FFA07A'
  };

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private mainService: MainService
  ) {
    this.route.params.subscribe(params => (this.csNk = params.nk));
  }

  getTodayStartingAt8Am(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8);
  }

  getNextWeekEndingAt8Pm(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7, 20);
  }

  convertDateToAPIFormat(date: Date): String {
    return date.toISOString().replace('T', ' ').split('.000Z')[0];
  }

  ngOnInit() {
    this.mainService
      .getChargingStation(this.csNk)
      .subscribe(chargingStation => {
        this.chargingStation = chargingStation;
      });

    this.reservationService
      .getAvailabilities(
        this.convertDateToAPIFormat(this.getTodayStartingAt8Am()),
        this.convertDateToAPIFormat(this.getNextWeekEndingAt8Pm()),
        this.csNk
      )
      .subscribe(eventCss => {
        this.eventCss = eventCss;

        eventCss.forEach(event => {
          const calEvent = new CalendarAppEvent({
            'start': new Date(event.startDateTime),
            'end': new Date(event.endDateTime),
            'title': event.status,
            'color': {
              'secondary': this.colors[event.status]
            },
            'actions': [],
            'draggable': false,
            'meta': {
              'notes': event.nk
            }
          });
          this.events.push(calEvent);
        });

        this.dataLoaded = Promise.resolve(true);
      });
    // Get CS info and availability
  }

  public makeReservation(eventCsNk) {
    this.reservationService.makeReservation(eventCsNk, this.evNk).subscribe(
      () => {
        this.isReserved = true; // TODO replace by toasterNotification
      },
      error => {
        console.error(error);
      }
    );
  }

  private initEvents(events): CalendarAppEvent[] {
    return events.map(event => {
      event.actions = this.actions;
      return new CalendarAppEvent(event);
    });
  }

  public handleEvent(action: string, event: CalendarAppEvent): void {
    const dialogRef = this.modalService.open(CalendarFormDialogComponent, {
      centered: true
    });
    dialogRef.componentInstance.data = { event, action };
    dialogRef.result
      .then(res => {
        if (!res) {
          return;
        }
        const dialogAction = res.action;
        const responseEvent = res.event;
        responseEvent.start = Utils.ngbDateToDate(responseEvent.start);
        responseEvent.end = Utils.ngbDateToDate(responseEvent.end);
        console.log(res);
        if (dialogAction === "reserve") {
          this.makeReservation(event.meta.notes);
          this.refresh.next();
        } else if (dialogAction === "delete") {
          this.removeEvent(event);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;

    this.calendarService.updateEvent(event).subscribe(events => {
      this.events = this.initEvents(events);
      this.refresh.next();
    });
  }

  public removeEvent(event) {
    this.modalService
      .open(this.eventDeleteConfirm, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
          this.calendarService.deleteEvent(event._id).subscribe(events => {
            this.events = this.initEvents(events);
            this.refresh.next();
          });
        },
        reason => {}
      );
  }
}
