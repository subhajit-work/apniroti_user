import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { MenuController, Platform, AlertController, ModalController } from '@ionic/angular';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Subscription, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { ResponsiveService } from '../../services/responsive.service';
import { AppComponent } from '../../app.component';
import { CommonUtils } from '../../services/common-utils/common-utils';
import { NavController } from '@ionic/angular';

// geolocation
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  officeInLoading;
  officeInData;
  officeOutLoading;
  officeOutData;
  userInfoLoading;
  locationCoords: any;
  timetest: any;

  form_api;
  private logoutDataSubscribe : Subscription;
  private formSubmitSearchSubscribe : Subscription;
  private viewPageDataSubscribe : Subscription;
  private officeDataSubscribe : Subscription;
  public isMobile: Boolean;
  main_menu;
  side_main_menu;
  searchModel;
  form_api_logout;
  site_info_data;
  get_user_dtls;
  current_url_path_name;
  viewLoadData;
  listing_view_url;

  constructor( 
    private authService: AuthService,
    private commonUtils : CommonUtils,
    private menuCtrl: MenuController,
    private http : HttpClient,
    private router: Router,
    private navCtrl : NavController,
    private modalController : ModalController,
    private responsiveService : ResponsiveService,
    private platform : Platform,
    private alertController : AlertController,
    private appComponent : AppComponent,
    private eRef: ElementRef,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy
    ) { }

  // init
  ngOnInit() {

    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timetest = Date.now();

    this.platform.ready().then(() => {

      /* if (this.platform.is('android')) {
        alert('running on Android device!');
        console.log("running on Android device!");
      }
      if (this.platform.is('ios')) {
          console.log("running on iOS device!");
      } */

      /* if (this.platform.is('mobileweb')) {
          console.log("running in a browser on mobile!");
      } */

    });

    /* this.onResize();
    this.responsiveService.checkWidth(); */


    this.form_api_logout = 'login/return_logout'; //logout api call
    this.form_api = 'subscriber/return_add'; //subscriber api call

    this.listing_view_url = 'student/dashboard';

    // this.viewPageData();
    
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      // console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        // this.get_user_dtls = res.user;
        
        // this.viewPageData();

        // user details set
        // this.commonUtils.onSigninStudentInfo(res.user);
      }
    });

    // user info data get
    this.userInfoLoading = true;
    this.logoutDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
        this.get_user_dtls = res;
        if(res && res.userinfo && res.userinfo.officein_time && res.userinfo.officein_time != null && res.userinfo.officein_time != ''){
          this.officeInData = res.userinfo.officein_time;
        }
        if(res && res.userinfo && res.userinfo.officeout_time && res.userinfo.officeout_time != null && res.userinfo.officeout_time != ''){
          this.officeOutData = res.userinfo.officeout_time;
        }
      }else{
        this.userInfoLoading = false;
        this.get_user_dtls = '';
      }
    });


    // get header data from commoninfo api
    this.logoutDataSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) => {
      if(res != null || res != undefined){
        // console.log('header globalparamsData res HEADER >>>>>>>>>>>', res);
        if(res.menu_data){
          this.main_menu = res.menu_data.main_menu.list;
          this.side_main_menu = res.menu_data.side_menu.list;
          this.site_info_data = res.sitedetails;
          // console.log('this.site_info_data ==================>', this.site_info_data );
        }
      }
    });


    // current url name
    this.current_url_path_name =  this.router.url.split('/')[1];
    // console.log('this.current_url_path_name ==== s>>', this.current_url_path_name);

    // alert('ionViewinit');

  }

  /* onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  } */

  ionViewWillEnter(){
    /* this.form_api = 'logout'; //logout api call
    this.authService.globalparamsData.subscribe(res => {
      console.log('header globalparamsData res >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
      }
    }); */

    // this.viewPageData();
    // alert('ionViewWillEnter');

  }

  ionViewDidEnter(){
    // alert('ionViewDidEnter');
  }


  //------------- office in function---------------------
  async officeIn(){
    const alert = await this.alertController.create({
    header: 'Office In',
    message: 'Are you sure you want to office In?',
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');

          // mobile
          if (this.platform.is('android') || this.platform.is('ios')) {
            // check gps permission and office in call api 
            this.checkGPSPermission('officeIn');
          }else{
            //desktop
            // ==================  desktop office in fetch start =====================
              this.officeInLoading = true;
              this.officeDataSubscribe = this.http.get('officein').subscribe(
                (res:any) => {
                  this.officeInLoading = false;
                  console.log("view data  officeInData res -------------------->", res.return_data);
                  if(res.return_status > 0){
                    this.officeInData = res.return_data.start_time;

                    // update observable service data
                    this.get_user_dtls.userinfo.officein_time = res.return_data.start_time;
                    this.commonUtils.getUserInfoService(this.get_user_dtls);
                  }
                },
                errRes => {
                  this.officeInLoading = false;
                }
              );
            //  desktop office in data fetch end
          }

        }
      }
    ]
    });
    await alert.present(); 
  }

  //------------- office out function---------------------
  async officeOut(){
    const alert = await this.alertController.create({
    header: 'Office Out',
    message: 'Are you sure you want to office Out?',
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Okay',
        handler: () => {
          console.log('Confirm Okay');

          // mobile
          if (this.platform.is('android') || this.platform.is('ios')) {
            //check gps permission and  office out call api
            this.checkGPSPermission('officeOut');
          }else{
            //desktop
            // ================== desktop office out data fetch start =====================
              this.officeOutLoading = true;
              this.officeDataSubscribe = this.http.get('officeout').subscribe(
                (res:any) => {
                  this.officeOutLoading = false;
                  console.log("view data  officeOutData res -------------------->", res.return_data);
                  if(res.return_status > 0){
                    this.officeOutData = res.return_data.end_time;

                    // update observable service data
                    this.get_user_dtls.userinfo.officeout_time = res.return_data.end_time;
                    this.commonUtils.getUserInfoService(this.get_user_dtls);
                  }
                },
                errRes => {
                  this.officeOutLoading = false;
                }
              );
            //desktop  office out  data fetch end
          }
          
        }
      }
    ]
    });
    await alert.present(); 
  }


  //=======================  gelocation function call start =============================
    //Check if application having GPS access permission  
    checkGPSPermission(_identifire) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
  
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS(_identifire);
          } else {
  
            //If not having permission ask for permission
            this.requestGPSPermission(_identifire);
          }
        },
        err => {
          alert(err);
        }
      );
    }
  
    requestGPSPermission(_identifire) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS(_identifire);
              },
              error => {
                //Show alert if user click on 'No Thanks'
                alert('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }
  
    askToTurnOnGPS(_identifire) {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLocationCoordinates(_identifire)
        },
        error => alert('Error requesting location permissions ' + JSON.stringify(error))
      );
    }
  
    // Methos to get device accurate coordinates using device GPS
    getLocationCoordinates(_identifire) {
      this.geolocation.getCurrentPosition().then((resp) => {
        /* this.locationCoords.latitude = resp.coords.latitude;
        this.locationCoords.longitude = resp.coords.longitude;
        this.locationCoords.accuracy = resp.coords.accuracy;
        this.locationCoords.timestamp = resp.timestamp;
        alert('_identifire >' + _identifire + ' latitude >' + resp.coords.latitude + ' longitude >' + resp.coords.longitude); */

        if(_identifire == 'officeIn'){
          // ================== Mobile office in fetch start =====================
            this.officeInLoading = true;
            this.officeDataSubscribe = this.http.get('officein?latitude=' +resp.coords.latitude + '&longitude=' + resp.coords.longitude).subscribe(
              (res:any) => {
                this.officeInLoading = false;
                console.log("view data  officeInData res -------------------->", res.return_data);
                if(res.return_status > 0){
                  this.officeInData = res.return_data.start_time;

                  // update observable service data
                  this.get_user_dtls.userinfo.officein_time = res.return_data.start_time;
                  this.commonUtils.getUserInfoService(this.get_user_dtls);
                }
              },
              errRes => {
                this.officeInLoading = false;
              }
            );
          //  office in data fetch end
        }else{
          // ================== Mobile office out data fetch start =====================
            this.officeOutLoading = true;
            this.officeDataSubscribe = this.http.get('officeout?latitude=' +resp.coords.latitude + '&longitude=' + resp.coords.longitude).subscribe(
              (res:any) => {
                this.officeOutLoading = false;
                console.log("view data  officeOutData res -------------------->", res.return_data);
                if(res.return_status > 0){
                  this.officeOutData = res.return_data.end_time;

                  // update observable service data
                  this.get_user_dtls.userinfo.officeout_time = res.return_data.end_time;
                  this.commonUtils.getUserInfoService(this.get_user_dtls);
                }
              },
              errRes => {
                this.officeOutLoading = false;
              }
            );
          // office out  data fetch end
        }

      }).catch((error) => {
        alert('Error getting location' + error);
      });
    }
  //------------ gelocation  function call end ------------

  // click to go page
  goPage(_url){
    this.router.navigate(['/',_url]);
  }

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.officeDataSubscribe !== undefined){
      this.officeDataSubscribe.unsubscribe();
    }
    if(this.logoutDataSubscribe !== undefined){
      this.logoutDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}
