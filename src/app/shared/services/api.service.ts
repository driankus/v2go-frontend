import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ChargingStation } from '../models/charging-station';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { EventCS } from '../models/event-cs';

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
      return this.http.get<ChargingStation[]>(this.API_URL, { params: params });
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class MainService {
  API_URL = environment.devUrl + 'stations/';
  user: User;

  constructor(private http: HttpClient) {}

  public getChargingStation(csNk: string) {
    return this.http.get<ChargingStation>(this.API_URL + csNk + '/');
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  API_URL = environment.devUrl + 'volt_reservation/';
  user: User;

  constructor(private http: HttpClient) {}

  public getAvailabilities(startDateTime, endDateTime, csNk) {
    const params = new HttpParams()
      .set('cs_nk', csNk)
      .set('start_datetime', startDateTime)
      .append('end_datetime', endDateTime);

    return this.http.get<EventCS[]>(this.API_URL + 'station-availabilities/', {params: params});
  }

  public makeReservation(event_cs_nk, ev_nk, custom_start_datetime, custom_end_datetime): Observable<Reservation> {
    if (custom_start_datetime && custom_end_datetime) {
      return this.http.post<Reservation>(this.API_URL + 'reservations/custom/',
      {
        event_cs_nk,
        ev_nk,
        custom_start_datetime,
        custom_end_datetime
      });
    } else {
      return this.http.post<Reservation>(this.API_URL + 'reservations/',
      {
        event_cs_nk,
        ev_nk
      });
    }
  }
}
