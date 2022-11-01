import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isUserLoggedIn:any = false;
  userInfo: any = {};

  constructor(public navCtrl: NavController, public gp: GooglePlus) {}

  loginWithGP() {
    this.gp.login({}).then(res=> {
      console.log(res);
      this.userInfo = res;
      this.isUserLoggedIn = true;
    }).catch( err => console.log(err));
  }

  logout() {
    this.gp.logout().then( ()=>{
      this.isUserLoggedIn = false;
    });
  }

}
