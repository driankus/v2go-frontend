import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChargingStation } from '../../../shared/models/charging-station';
import { ToastrService } from 'ngx-toastr';
import { ReservationService, UserAccountInfoService } from 'src/app/shared/services/api.service';
import { EventCS } from 'src/app/shared/models/event-cs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent implements OnInit {
  @Input() station: ChargingStation;
  @Output() unselectStation = new EventEmitter<undefined>();
  stationAvailabilities: EventCS[];
  public refresh: Subject<any> = new Subject(); // TODO need to figure out how to use this
  evNk: string;

  constructor(
    private apiService: ReservationService,
    private toastr: ToastrService,
    private accountService: UserAccountInfoService,
  ) {}

  toProperString(date: Date) {
    return date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
  }

  ngOnInit() {
    this.setUp();
  }

  setUp(): void {
    const today = new Date();
    this.apiService
      .getAvailabilities(
        this.toProperString(new Date(today.getFullYear(), today.getMonth(), today.getDate())),
        this.toProperString(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
        this.station.nk
      )
      .subscribe(
        eventCss => { this.stationAvailabilities = eventCss; },
        error => { console.log(error); }
      );
  }

  backToResults(): void {
    this.unselectStation.emit(undefined);
  }

  makeReservation(eventCsNk: string): void {
    const userId = JSON.parse(localStorage.getItem('userData'))['id'];
    this.accountService.getAccountInfo(userId)
    .subscribe(userData => {
      console.log(this.evNk);
      this.evNk = userData.evs[0].nk;

      this.apiService.makeReservation(eventCsNk, this.evNk, null, null).subscribe(
        reservation => {
          this.backToResults();
          this.toastr.success('Reservation made', 'Success!', {
            progressBar: true
          });
        },
        error => {
          console.log(error);
        }
      );
    });
  }
}
