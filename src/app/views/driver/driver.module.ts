import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { DriverRoutingModule } from './driver-routing.module';
import { HomeMapComponent } from '../home-map/home-map.component';
import { StationDetailComponent } from '../home-map/station-detail/station-detail.component';
import { ReservationComponent } from '../reservation/reservation.component';
import { CalendarModule, CalendarUtils, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarFormDialogComponent } from '../calendar/calendar-form-dialog/calendar-form-dialog.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      SharedComponentsModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      ColorPickerModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      }),
      AgmCoreModule.forRoot({
        apiKey: environment.GOOGLE_API_KEY
      }),
      DriverRoutingModule
    ],
    providers: [CalendarUtils],
    declarations: [ HomeMapComponent, StationDetailComponent, ReservationComponent, CalendarFormDialogComponent ],
    entryComponents: [CalendarFormDialogComponent]
  })
export class DriverModule { }
