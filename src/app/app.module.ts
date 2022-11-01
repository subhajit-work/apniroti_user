import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule , HTTP_INTERCEPTORS } from  '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';
import { SharedModule } from './shared/shared.module';
import { InterceptorProvider } from './services/interceptors/interceptor';

import { AddCommonModelPageModule } from './pages/modal/add-common-model/add-common-model.module';

//==  gelocation gps === (https://www.freakyjolly.com/ionic-4-turn-on-device-gps-in-ionic-4-application-without-leaving-app-using-ionic-native-plugin/)
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


//barcode scanner (https://www.freakyjolly.com/ionic-4-add-barcode-qr-code-scanner-encoder-ionic-4-native-plugin/)
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// ==== Background Geolocation tracker === (https://medium.com/@chenlitchian/ionic-4-with-background-geolocation-cc57149da36a)
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";

// background mode on
import { BackgroundMode } from '@ionic-native/background-mode/ngx';


// google plus login (https://www.youtube.com/watch?v=NFUN3MIb0GE)
import { GooglePlus } from '@ionic-native/google-plus/ngx';


// facebook login(https://www.youtube.com/watch?v=0iSJs2o5Ra8&list=PLiPB5iCKp3cvelTG5M0jpOO5cSQpa6nUt&index=27)
import { Facebook } from '@ionic-native/facebook/ngx';

// map show(Geolocation and NativeGeocoder needed) (https://www.freakyjolly.com/ionic-4-add-google-maps-geolocation-and-geocoder-in-ionic-4-native-application/)
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

// OneSignal for push notification (https://www.youtube.com/watch?v=K6zPzPFiMIY&list=PLiPB5iCKp3cvelTG5M0jpOO5cSQpa6nUt&index=33)
import { OneSignal } from '@ionic-native/onesignal/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SharedModule, //share module import here
    BrowserAnimationsModule,
    AddCommonModelPageModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,
    BarcodeScanner, //barcode scaner
    BackgroundGeolocation,
    BackgroundMode,
    GooglePlus,
    Facebook,
    NativeGeocoder,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProvider,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
