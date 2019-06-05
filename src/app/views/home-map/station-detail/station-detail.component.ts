import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChargingStation } from '../../../shared/models/charging-station';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss']
})
export class StationDetailComponent {
  @Input() station: ChargingStation;
  @Output() unselectStation = new EventEmitter<undefined>();

  constructor() { }

  backToResults(): void {
    this.unselectStation.emit(undefined);
  }


}
