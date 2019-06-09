import { Component, OnInit, Input} from '@angular/core';
import { ChargingStation } from '../../shared/models/charging-station';
import { EventCS } from '../../shared/models/event-cs';
import { ReservationService, MainService } from '../../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  eventCss: EventCS[];
  evNk: string;
  csNk: string;
  chargingStation: ChargingStation;
  dataLoaded: Promise<boolean>;

  isReserved = false;

  constructor(
    private reservationService: ReservationService, private route: ActivatedRoute, private mainService: MainService
  ) { this.route.params.subscribe( params => this.csNk = params.nk ); }

  ngOnInit() {
    this.mainService.getChargingStation(this.csNk).subscribe(
      chargingStation => {
        this.chargingStation = chargingStation;
        console.log(chargingStation);
        this.dataLoaded = Promise.resolve(true);
      }
    );

    this.reservationService.getAvailabilities('2019-09-25 12:00:00', '2019-09-28 15:30:00', this.csNk).subscribe(
      eventCss => {
        this.eventCss = eventCss;
      }
    );

    // Get CS info and availability
  }

  // public makeReservation() {
  //   this.reservationService.makeReservation(this.evNk, this.eventCs.nk)
  //     .subscribe(() => {
  //       this.isReserved = true; // TODO replace by toasterNotification
  //     }, (error) => {
  //       console.error(error);
  //     });
  // }
}
