import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';


// map show
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
 
declare var google;

@Component({
  selector: 'app-vehicle-tracker',
  templateUrl: './vehicle-tracker.page.html',
  styleUrls: ['./vehicle-tracker.page.scss'],
})

/* tslint:disable */ 
export class VehicleTrackerPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  parms_action_id;
  viewLoadData;
  listing_view_url;
  viewData;
  pageData;
  commonPageData;
  showMapZoom;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]


  // map
  @ViewChild('map', {static:true}) mapElement: ElementRef;
  map: any;
  address:string;
  private markers = [];
  records = [];
  latLngGet;

  constructor(
    private activatedRoute : ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private http : HttpClient,
    private cdr: ChangeDetectorRef,
    private commonUtils : CommonUtils,
    private authService : AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    // user info data get
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== Tracker HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        if(res.siteinfo && res.siteinfo.map_zoom){
          this.showMapZoom = res.siteinfo.map_zoom;
        }
      }
    });
    // End
  
    // this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('this.parms_action_name CMS >>>>>>>>>>>>>>', this.parms_action_id);

    // view page url name
    this.listing_view_url = 'student/track_location' ;
    
    // map show
    // this.loadMap();

    // this.viewPageData();
  }

  ionViewDidLoad() {
    // this.loadMap();
  }

  ionViewWillEnter() {
    // map show
  //  this.loadMap();

  this.viewPageData();
   }

  // ================== view data fetch start =====================
    viewPageData(){
      console.log('viewPageData', this.http);
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          this.pageData = res.return_data;

          console.log('MAP res.return_data >', res.return_data);

          if(res.return_status > 0){
          
          // map load
           this.loadMap(res.return_data);


            this.viewData = res.return_data[this.parms_action_id];
            console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
          }else {
            this.router.navigateByUrl('/dashboard');
            console.log('this.router', this.router);
          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end


  loadMap(_MapData) {

    console.log('_MapData >>>>>>>>>', _MapData);

    // ---------signgle marker current postion mark------------
    /* this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //  this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
      //  this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

      this.latLngGet = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.addMarker(this.latLngGet);

    }).catch((error) => {
      console.log('Error getting location', error);
    }); */


  
    //--------------multiple marker--------------
    let latLng = new google.maps.LatLng(_MapData[0].latitude, _MapData[0].longitude);

    let mapOptions = {
      center: latLng,
      zoom: +this.showMapZoom, //17 (+ added for string to number convert)
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < _MapData.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(_MapData[i].latitude, _MapData[i].longitude),
        animation: google.maps.Animation.DROP,
        map: this.map,
        icon: { url : 'assets/images/google_marker.png' }
      });

      let content = `<h6>${_MapData[i].user_fullname}</h6><p>${_MapData[i].address}</p>`;
      this.addInfoWindow(marker, content);

     /*  google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(_MapData[i].user_fullname, _MapData[i].address);
          infowindow.open(this.map, marker);
        }
      })(marker, i)); */
    }
  }

  /* addMarker(latLng) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    let content = "<h4>Information!</h4>";
    this.markers.push(marker);
    this.addInfoWindow(marker, content);
    marker.setMap(this.map);
  }*/
  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }



  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}




