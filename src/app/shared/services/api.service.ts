import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ChargingStation } from '../models/charging-station';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class SearchStationsService {
  private API_URL = environment.devUrl + 'volt_finder/near-poi';
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Performs CS search by calling the 'API/near-poi' endpoint.
   *
   * @param poiLat - Point of interest latitude, either from user's location or default lat (MTL)
   * @param poiLng - Point of interest longitude or default lng (MTL)
   */
  findStations(poiLat: number, poiLng: number): Observable<ChargingStation[]> {
    if (typeof poiLat === 'undefined' || typeof poiLng === 'undefined') {
      console.log('Error at findStations(). Invalid coordinates.');
    } else {
      const params = new HttpParams()
        .set('poi_lat', String(poiLat))
        .set('poi_lng', String(poiLng));
      return this.http.get<ChargingStation[]>(this.API_URL, { params: params }).pipe(
        map(stationsList => stationsList.map(station => ChargingStation.create(station)))
      );
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  API_URL = this.API_URL + 'volt_reservation/reservations/';
  user: User;

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('v2go.user');
    this.user = User.create(JSON.parse(userData));
  }

  public makeReservation(eventCsNk, evNk): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL,
      {
        event_cs_nk: eventCsNk,
        ev_nk: evNk
      });
  }
}
