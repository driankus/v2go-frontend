import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchStationsService } from '../../../../services/api.service';

@Component({
  selector: 'app-driver-header',
  templateUrl: './driver-header.component.html',
  styleUrls: ['./driver-header.component.scss']
})
export class DriverHeaderComponent implements OnInit {
  notifications: any[];

  constructor(
    // private navService: NavigationService,
    private auth: AuthService
  ) {
    this.notifications = [
      {
        icon: 'i-Speach-Bubble-6',
        title: 'Assistant tip',
        badge: '3',
        text: 'Your battery is running low, I recommend making a stop in 30 min.',
        time: new Date(),
        status: 'primary',
        link: '/chat'
      },
      {
        icon: 'i-Speach-Bubble-6',
        title: 'Reservation update',
        badge: '3',
        text: 'Reservation #429 is confirmed?',
        time: new Date('24/5/2019'),
        status: 'success',
        link: '/tables/full'
      }
    ];
  }

  ngOnInit() {
  }

  // toggelSidebar() {
  //   const state = this.navService.sidebarState;
  //   if (state.childnavOpen && state.sidenavOpen) {
  //     return state.childnavOpen = false;
  //   }
  //   if (!state.childnavOpen && state.sidenavOpen) {
  //     return state.sidenavOpen = false;
  //   }
  //   if (!state.sidenavOpen && !state.childnavOpen) {
  //       state.sidenavOpen = true;
  //       setTimeout(() => {
  //           state.childnavOpen = true;
  //       }, 50);
  //   }
  // }

  logout() {
    this.auth.logout();
  }

}
