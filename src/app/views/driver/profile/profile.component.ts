import { Component, OnInit } from '@angular/core';
import { UserAccountInfoService } from '../../../shared/services/api.service';
import { ElectricVehicle } from '../../../shared/models/electric-vehicle';
import { UserInfo } from '../../../shared/models/user-account-data';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading = true;
  myInfo: UserInfo;
  myEvs: ElectricVehicle[];
  myReservations: any[];

  // TODO get pk from localStorage User
  userPk = JSON.parse(localStorage.getItem('userData'))['id'];

  constructor(
    private accountService: UserAccountInfoService,
    // private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.accountService.getAccountInfo(this.userPk)
      .subscribe(userData => {
        this.myInfo = userData.user;
        this.myEvs = userData.evs;
        this.myReservations = userData.reservations;
        this.isLoading = !this.isLoading;
      });
  }

}
