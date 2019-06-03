import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DriverRoutingModule } from './driver-routing.module';
import { HomeMapComponent } from '../home-map/home-map.component';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      SharedComponentsModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      DriverRoutingModule
    ],
    declarations: [ HomeMapComponent ]
  })
export class DriverModule { }
