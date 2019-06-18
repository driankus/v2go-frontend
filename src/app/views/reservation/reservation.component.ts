import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ChargingStation } from "../../shared/models/charging-station";
import { EventCS } from "../../shared/models/event-cs";
import { ReservationService, MainService} from "../../shared/services/api.service";
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
import { ToastrService } from "ngx-toastr";

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

  public viewDate = new Date();
  public activeDayIsOpen = true;
  public refresh: Subject<any> = new Subject();
  public events: CalendarAppEvent[] = [];

  constructor(
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.route.params.subscribe(params => (this.csNk = params.nk));
  }

  toProperString(date: Date) {
    return date.toISOString().split("T")[0] + " " + date.toLocaleTimeString();
  }

  ngOnInit() {
    this.events = [];
    this.mainService
      .getChargingStation(this.csNk)
      .subscribe(chargingStation => {
        this.chargingStation = chargingStation;
      });

    const today = new Date();

    this.reservationService
      .getAvailabilities(
        this.toProperString(new Date(today.getFullYear(), today.getMonth(), 8)),
        this.toProperString(
          new Date(today.getFullYear(), today.getMonth(), 20)
        ),
        this.csNk
      )
      .subscribe(eventCss => {
        this.eventCss = eventCss;

        eventCss.forEach(event => {
          const colors = {
<<<<<<< HEAD
            AVAILABLE: "#6B8E23",
            RESERVED: "#CD5C5C"
=======
            AVAILABLE: '#90EE90',
            RESERVED: '#FFA07A'
>>>>>>> reservation
          };
          const calEvent = new CalendarAppEvent({
            start: new Date(event.startDateTime),
            end: new Date(event.endDateTime),
            title: event.status,
            color: {
              secondary: colors[event.status]
            },
            actions: [
              {
                label: '<i class="i-Edit m-1 text-secondary"></i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                  this.handleEvent("edit", event);
                }
              }
            ],
            draggable: false,
            meta: {
              notes: event.nk
            }
          });
          this.events.push(calEvent);
        });

        this.dataLoaded = Promise.resolve(true);
      });
    // Get CS info and availability
  }

  public makeReservation(eventCsNk, startDateTime = null, endDateTime = null) {
    startDateTime =
      startDateTime == null
        ? startDateTime
        : this.toProperString(startDateTime);
    endDateTime =
      endDateTime == null ? endDateTime : this.toProperString(endDateTime);
    this.reservationService
      .makeReservation(eventCsNk, this.evNk, startDateTime, endDateTime)
      .subscribe(
        () => {
          this.isReserved = true; // TODO replace by toasterNotification
          this.ngOnInit();
          this.refresh.next();
<<<<<<< HEAD
          this.toastr.success("Reservation made", "Success!", {
            progressBar: true
          });
=======
          this.toastr.success('Reservation made', 'Success!', {progressBar: true});
>>>>>>> reservation
        },
        error => {
          console.error(error);
        }
      );
  }

  public handleEvent(action: string, event: CalendarAppEvent): void {
    if (event.title !== "RESERVED") {
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

          if (dialogAction === "reserve") {
<<<<<<< HEAD
            if (
              event.start.getTime() === startDateTime.getTime() &&
              event.end.getTime() === endDateTime.getTime()
            ) {
              this.makeReservation(event.meta.notes);
            } else if (
              event.start.getTime() === startDateTime.getTime() ||
              event.end.getTime() === endDateTime.getTime()
            ) {
              this.makeReservation(
                event.meta.notes,
                startDateTime,
                endDateTime
              );
=======
            if (event.start.getTime() === startDateTime.getTime() && event.end.getTime() === endDateTime.getTime()) {
              this.makeReservation(event.meta.notes);
            } else if (event.start.getTime() === startDateTime.getTime() || event.end.getTime() === endDateTime.getTime()) {
              this.makeReservation(event.meta.notes, startDateTime, endDateTime);
>>>>>>> reservation
            }
            this.refresh.next();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
