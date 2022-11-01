import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../../services/auth/auth.service';
import { CommonUtils } from '../../../services/common-utils/common-utils';
import{ AppComponent } from'../../../app.component';

@Component({
  selector: 'app-member-login',
  templateUrl: './member-login.page.html',
  styleUrls: ['./member-login.page.scss'],
})

export class MemberLoginPage implements OnInit {

  isLoading = false;
  userInfoLoading;

  isLogin = true;
  userTypes;
  model:any = {}

  constructor( 
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private storage: Storage,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });
  }

  ionViewWillEnter() {

    // this.appComponent.userInfoData();

    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  //---------------- login form submit start-----------------
    onSubmitForm(form:NgForm){
      this.isLoading = true;
      // console.log('form >>', form);
      if(!form.valid){
        return;
      }
      const username = form.value.username;
      const password = form.value.password;

      if(this.isLogin){
        // login server data send
      }else{
        // signup server data send
      }

      this.authenticate(form, form.value);
      // form.reset();

    }

    // authenticate function
    authenticate(_form, form_data) {
      console.log('_form >>>>>>>>>',_form);
      this.isLoading = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;

          // get form value
          // let fd = new FormData();
          // for (let val in _form.value) {
          //   if(_form.value[val] == undefined){
          //     _form.value[val] = '';
          //   }
          //   fd.append(val, _form.value[val]);
    
          // };

          if (this.isLogin) {
            authObs = this.authService.login('student/member_signin', form_data, '')
          } else {
            // authObs = this.authService.signup(email, password);
          }
          authObs.subscribe(
            resData => {
  
              if(resData.return_status > 0)
              {
                this.router.navigateByUrl('/dashboard');

                this.appComponent.userInfoData(); 
                // user info
                /* this.userInfoLoading = true;
                this.http.get('userinfo').subscribe(
                  (res:any) => {
                    this.userInfoLoading = false;
                    console.log("view data  userinfo  res from AUTH -------------------->", res.return_data);
                    if(res.return_status > 0){

                      // update observable service data
                      this.commonUtils.getUserInfoService(res.return_data);
                    }
                  },
                  errRes => {
                    this.userInfoLoading = false;
                  }
                ); */

                console.log('user Type =============))))))))))))))>', resData.return_data.user_type);
                /* this.userTypes = this.commonUtils.userTypes;
                console.log('user Type =============))))))))))))))>', this.userTypes); */

                // this.appComponent.userInfoData();
                // this.appComponent.initializeApp();

                /* if(resData.return_data.user_type == 'group'){
                  this.router.navigateByUrl('/dashboard');
                }else{
                  this.router.navigateByUrl('/dashboard-list');

                } */

                _form.reset();
                loadingEl.dismiss();
                
                /* setTimeout(() => {
                  _form.reset();
                  loadingEl.dismiss();

                }, 2000); */
                
              }else{
                loadingEl.dismiss();
                this.commonUtils.presentToast('error', resData.return_message[0]);
              }
              
              // console.log("data login after resData ++++++>", resData);
              this.isLoading = false;
              // loadingEl.dismiss();
              // this.router.navigateByUrl('/places/tabs/discover');
            },
            errRes => {
              loadingEl.dismiss();
            }
          );
        });
    }
  // login form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }


}