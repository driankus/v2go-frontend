import { Component, OnInit } from '@angular/core';
import { UserAccountInfoService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = true;
  // TODO add interphaces to user-info, ev, reservation
  myInfo: any;
  myEvs: any;
  myReservations: any;

  // TODO get pk from localStorage User
  user_pk = 3;

  constructor(
    private accountService: UserAccountInfoService,
    // private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.accountService.getAccountInfo(this.user_pk)
      .subscribe(userData => {
        console.log('#'.repeat(100), ' #userData!!!: ', userData);
        this.myInfo = userData.user;
        this.myEvs = userData.evs;
        this.myReservations = userData.reservations;
        console.log(' #myInfo!!!: ', this.myInfo);
        this.isLoading = !this.isLoading;
      });
  }

}

