import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ChargingStation } from "../../shared/models/charging-station";
import { EventCS } from "../../shared/models/event-cs";
import {
  ReservationService,
  MainService
} from "../../shared/services/api.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { CalendarAppEvent } from "src/app/shared/models/calendar-event.model";
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
  evNk: string = "55f002a97554ae0a6ffd021311eca1b5";
  csNk: string;
  chargingStation: ChargingStation;
  dataLoaded: Promise<boolean>;

  isReserved = false;

  public view = "month";
  public viewDate = new Date();
  @ViewChild("eventDeleteConfirm") eventDeleteConfirm;
  public activeDayIsOpen = true;
  public refresh: Subject<any> = new Subject();
  public events: CalendarAppEvent[] = [];
  private actions: CalendarEventAction[];
  private startWeekOn = new Date().getDay();

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private calendarService: CalendarAppService,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => (this.csNk = params.nk));
  }

  ngOnInit() {
    this.mainService
      .getChargingStation(this.csNk)
      .subscribe(chargingStation => {
        this.chargingStation = chargingStation;
      });

      const today = new Date();

    this.reservationService
      .getAvailabilities(
        new Date(today.getFullYear(), today.getMonth(), 8).toISOString().replace('T', ' ').split('.000Z')[0],
        new Date(today.getFullYear(), today.getMonth(), 20).toISOString().replace('T', ' ').split('.000Z')[0],
        this.csNk
      )
      .subscribe(eventCss => {
        this.eventCss = eventCss;
        console.log(this.eventCss);

        eventCss.forEach(event => {
          console.log(event.startDateTime);
          let colors = {
            'AVAILABLE': '#6B8E23',
            'RESERVED': '#CD5C5C'
          }
          let calEvent = new CalendarAppEvent({
            'start': new Date(event.startDateTime),
            'end': new Date(event.endDateTime),
            'title': event.status,
            'color': {
              'secondary': colors[event.status]
            },
            'actions': [{
              label: '<i class="i-Edit m-1 text-secondary"></i>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('edit', event);
              }
            }, {
              label: '<i class="i-Close m-1 text-danger"></i>',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                this.removeEvent(event);
              }
            }],
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
