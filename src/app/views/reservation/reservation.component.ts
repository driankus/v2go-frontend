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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarFormDialogComponent } from '../calendar/calendar-form-dialog/calendar-form-dialog.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
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
    private mainService: MainService,
    private modalService: NgbModal) {
    this.route.params.subscribe(params => (this.csNk = params.nk));
  }

  getTodayStartingAt8Am(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 8);
  }

  getNextWeekEndingAt8Pm(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 7, 20);
  }

  convertDateToAPIFormat(date: Date): String {
    return `${date.toISOString().split('T')[0]} ${date.toLocaleTimeString()}`;
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
            'start': new Date(event.start_datetime),
            'end': new Date(event.end_datetime),
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

        this.refresh.next();

        this.dataLoaded = Promise.resolve(true);
      });
    // Get CS info and availability
  }

  public makeReservation(eventCsNk, startDateTime = null, endDateTime = null) {
    startDateTime = startDateTime == null ? startDateTime : this.convertDateToAPIFormat(startDateTime);
    endDateTime = endDateTime == null ? endDateTime : this.convertDateToAPIFormat(endDateTime);
    this.reservationService
      .makeReservation(eventCsNk, this.evNk, startDateTime, endDateTime)
      .subscribe(
        () => {
          this.isReserved = true; // TODO replace by toasterNotification
          this.refresh.next();
        },
        error => {
          console.error(error);
        }
      );
  }

  public handleEvent(action: string, event: CalendarAppEvent): void {
    if (event.title !== 'RESERVED') {
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
          const startDateTime = new Date(
            event.start.getFullYear(),
            event.start.getMonth(),
            event.start.getDate(),
            res.startTime.hour,
            res.startTime.minute
          );
          const endDateTime = new Date(
            event.end.getFullYear(),
            event.end.getMonth(),
            event.end.getDate(),
            res.endTime.hour,
            res.endTime.minute
          );

          if (dialogAction === 'reserve') {
            if (event.start.getTime() === startDateTime.getTime() && event.end.getTime() === endDateTime.getTime()) {
              this.makeReservation(event.meta.notes);
            } else {
              this.makeReservation(event.meta.notes, startDateTime, endDateTime);
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
