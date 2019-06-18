import { Component, OnInit } from '@angular/core';
import { UserAccountInfoService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  accountInfo: any;
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
        this.accountInfo = userData;
        console.log('#'.repeat(100), ' #userData!!!: ', userData);
      });
  }

}

