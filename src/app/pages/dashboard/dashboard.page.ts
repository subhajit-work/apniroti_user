import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController, MenuController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { Router, ActivatedRoute } from '@angular/router';

// barcode scanner
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { JsonPipe } from '@angular/common';

// background tracker
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation/ngx";

/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  /*Veriable*/
  private viewPageDataSubscribe: Subscription;
  userInfoLoading;
  get_user_dtls;
  listing_view_url;
  viewLoadData;
  pageData;
  viewData;
  genderArry;
  gps_button;


  // barcode scanner
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{},
  ]

  private userInfoDataSubscribe: Subscription;

  constructor(
    public menuCtrl: MenuController,
    private commonUtils : CommonUtils,
    private barcodeScanner: BarcodeScanner,
    private http : HttpClient,
    private router : Router,
    private backgroundGeolocation: BackgroundGeolocation,
    private platform : Platform
  ) { 

    //barcode Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {

    // view page url name
    this.listing_view_url = 'student/userinfo';

    this.viewPageData();

    // menu show
    this.menuCtrl.enable(true);

    if ((this.platform.is('android') || this.platform.is('ios')) && !this.platform.is('mobileweb')) {
      // alert('running on Android device!');
      //console.log("running on Android device!");

      // gps backgroud check (for mobile android/ios)
      // this.startBackgroundGeolocation();
      
    }else{
      // desktop view or website
    }

    // user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.get_user_dtls = res;
        console.log('dashboard userinfo',this.get_user_dtls);
        this.userInfoLoading = false;
      }else{
        this.get_user_dtls = '';
        this.userInfoLoading = false;
      }
    });
  }

  ionViewWillEnter() {

    // menu show
    this.menuCtrl.enable(true);
  }

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    console.log('dashboard userinfo',this.get_user_dtls);
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        
        this.pageData = res.return_data;

        console.log('this.pageData', this.pageData);
        if(res.return_status > 0){
          console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  closeModal() {
    console.log('Clicked');
  }

  // barode call
  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        // alert("Barcode data " + JSON.stringify(barcodeData));
        // this.scannedData = barcodeData;

        this.userInfoDataSubscribe = this.http.get('student/fetch_user_by_qrcode?'+'qrcode='
        +barcodeData.text).subscribe(
          (res:any) => {
            // alert('res >'+ JSON.stringify(res));
            // this.router.navigateByUrl(`user-details/`+res.return_data.user_id);
            this.router.navigate(['/user-details', res.return_data.user_id]);
        },
        errRes => {
        }
        );
      })
      .catch(err => {
        // console.log("Error", err);
      });
  }

  //##################### background gps track start ########################
    startBackgroundGeolocation() {

      console.log('this.gps_button', this.gps_button);
      
      // alert('Track strat');
      const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 500,
      distanceFilter: 0,
      debug: false,
      stopOnTerminate: true,
      startForeground: true,
      locationProvider: 1,
      interval: (60 * 1000), //2mins in millis
      //interval: (120 * 1000), //2mins in millis
     // interval: (600 * 1000), //10 mins in millis
      //fastestInterval: (60 * 1000), // 1min in millis
      // activitiesInterval: (60 * 1000),
      stopOnStillActivity: false,
      pauseLocationUpdates: false,
      activityType: 'AutomotiveNavigation',
      notificationText: 'Location Tracking Started',
      notificationTitle: 'Location Tracking'
      };

      //const config: BackgroundGeolocationConfig = {
      //desiredAccuracy: 10, //Specify the desired-accuracy of the geolocation system.
      //stationaryRadius: 20, //Default: 25. When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.
      //distanceFilter: 30, // The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
      //debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      //stopOnTerminate: true, // enable this to clear background location settings when the app terminates
      //interval: 2000 //1000 means 10 second
      //};

      this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
          // alert('location>'+location);
          
          this.sendGPS(location);

          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          });
      });

      // start recording location
      this.backgroundGeolocation.start();

      // If you wish to turn OFF background-tracking, call the #stop method.
      //this.backgroundGeolocation.stop();
    }
    
    sendGPS(location) {
    
    if (location.speed == undefined) {
        location.speed = 0;
        this.gps_button = false;
    }
    //alert('111111111111111');
   
    this.gpsDataSendApi(location);

    // setInterval(() => { 
    //     //alert("Hello"); 
    //     // alert("link >"+ this.gps_update_link); 
        

    //     //this.backgroundGeolocation.stop();
    //     // this.backgroundGeolocation.start();

    //     this.gpsDataSendApi(location);
        
    // }, 60000); //1 seconds means 1000 (60,000 means 1 minute)
    }

    urlFireCount = 0;
    timestamp;

    gpsDataSendApi(location){


      // alert('gpsDataSendApi >'+ JSON.stringify(location));
      // header data call
      // this.headerLoadData();
      
      this.timestamp = new Date(location.time);
      this.gps_button = true;
      
      this.http
      .post(
          "dashboard/check_interval_mail", // backend api to post
          {
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          timestamp: this.timestamp
          },
          {}
      )
      .subscribe((data:any) => {
        this.gps_button = false;
          // this.urlFireCount++;
          // console.log(data.status);
          // console.log(data.data); // data received by server
          // console.log(data.headers);
          //this.backgroundGeolocation.finish(); // FOR IOS ONLY
          // alert('res  count>'+ this.urlFireCount + ' latitude >'+ location.latitude + ' longitude >'+ location.longitude);
      });
    }
  //##### background gps track end #####


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}
