import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { CommonUtils } from '../../services/common-utils/common-utils';
import{ AppComponent } from'../../app.component';

// google login
import { GooglePlus } from '@ionic-native/google-plus/ngx';

// facebook login
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


/* tslint:disable */ 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {

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
    private appComponent: AppComponent,
    private googlePlus: GooglePlus,
    private fb: Facebook
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
      const email = form.value.email;
      const password = form.value.password;

      if(this.isLogin){
        // login server data send
      }else{
        // signup server data send
      }

      this.authenticate('student/signin', form, form.value);
      // form.reset();

    }

    // authenticate function
    authenticate(_serverApi, _form, form_data) {
      console.log('_serverApi >>>>>>>>>',_serverApi);
      console.log('_form >>>>>>>>>',_form);
      this.isLoading = true;
      this.loadingController
        .create({ 
          keyboardClose: true, 
          message: 'Logging in...',
          spinner: "bubbles",
          cssClass: 'custom-loading',
        })
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
            authObs = this.authService.login(_serverApi, form_data, '')
          } else {
            // authObs = this.authService.signup(email, password);
          }
          authObs.subscribe(
            resData => {
              console.log('resData', resData);
              if(resData.return_status == 2){
                this.router.navigateByUrl(`verification-email/${resData.return_data.user_id}`);
                console.log('verification-email', resData.return_data.user_id);
                this.commonUtils.presentToast('success', resData.return_message);
                loadingEl.dismiss();

              }else if(resData.return_status > 0){
                console.log('resData.return_status > 0', resData.return_status);
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

                // _form.reset();
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


// ================= login with google code start ==================
  // http://www.sbsevatrust.com/apniroti/admin/student/signup?master=1
  googleUsersDtls;
  loginGoogle(){
    console.log('google login click');
    this.googlePlus.login({})
    .then(res => {
      console.log('googlePlus res >', res);
      res.type = "googleLogin"

      // getFbUserDetail(userid: any) {
        /* this.http.get('https://www.googleapis.com/plus/v1/people/me?access_token='+res.accessToken)
        .subscribe(res => {
          console.log('getGoogleUserDetail >', res);
          this.googleUsersDtls = res; */
          this.authenticate('student/social_signup', '', res);
        // });
      // }
      // this.authenticate('student/social_signup', '', res);

    })
    .catch(err => {
      console.error('googlePlus err >', err);
    });
  }

  // ================== view data fetch start =====================
    googleLoginLoading;
    googleLoginData;
    googleLoginApi(){
      console.log('viewPageData', this.http);
      this.googleLoginLoading = true;
      this.http.get('').subscribe(
        (res:any) => {
          this.googleLoginLoading = false;
          this.googleLoginData = res.return_data;
          if(res.return_status > 0){
            this.googleLoginData = res.return_data;
            console.log('this.googleLoginData >', this.googleLoginData);
          }
        },
        errRes => {
          this.googleLoginLoading = false;
        }
      );
    }
  // view data fetch end

// ===login with google code end ====

// =============== login wtth facebook start =============
isLoggedInLoading;
loginFacebook(){
  console.log('facebook login click');

  this.fb.logout().then(() => { }).catch(() => { }); //very important to logout first

  this.fb.login(['public_profile', 'user_friends', 'email'])
  .then((res: FacebookLoginResponse) => {
    console.log('Logged into Facebook!', res);
    if (res.status === 'connected') {
      this.isLoggedInLoading = true;
      this.getFbUserDetail(res.authResponse.userID);
    } else {
      this.isLoggedInLoading = false;
    }
  })
  .catch(e => {
    this.fb.logout().then(() => { }).catch(() => { });
    console.log('Error logging into Facebook', e)
  });
}
fbUsersDtls;
getFbUserDetail(userid: any) {
  this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
  .then(res => {
    console.log('getFbUserDetail >', res);
    this.fbUsersDtls = res;
    this.authenticate('student/social_signup', '', res);
  })
  .catch(e => {
    console.log(e);
  });
}
//===== login with facebook end ====

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
