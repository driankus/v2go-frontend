import { Component, OnInit, Input} from '@angular/core';
import { ChargingStation } from '../../shared/models/charging-station';
import { EventCS } from '../../shared/models/event-cs';
import { ReservationService } from '../../shared/services/api.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  eventCs: EventCS;
  evNk: string;
  chargingStation: ChargingStation;

  isReserved = false;

  constructor(
    private reservationService: ReservationService
  ) { }

  ngOnInit() {
    // Get CS info and availability
  }

  public makeReservation() {
    this.reservationService.makeReservation(this.evNk, this.eventCs.nk)
      .subscribe(() => {
        this.isReserved = true; // TODO replace by toasterNotification
      }, (error) => {
        console.error(error);
      });
  }
}
