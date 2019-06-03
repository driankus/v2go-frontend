import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';
import { DriverRoutingModule } from './driver-routing.module';
import { HomeMapComponent } from '../home-map/home-map.component';
import { environment } from '../../../environments/environment';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      SharedComponentsModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      AgmCoreModule.forRoot({
        apiKey: environment.GOOGLE_API_KEY
      }),
      DriverRoutingModule
    ],
    declarations: [ HomeMapComponent ]
  })
export class DriverModule { }
