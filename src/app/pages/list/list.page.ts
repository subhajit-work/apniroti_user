import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Platform, IonContent } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';


declare var $ :any; //jquary declear

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})

export class ListPage implements OnInit, OnDestroy {

  // @ViewChild(IonContent,{ static: true }) content: IonContent;
  
  // variable
  public isMobile: Boolean;
  skilsList;
  careersList;
  locationList;
  selectLoading;
  getlistLoading = true;
  model: any = {};
  private formSubmitSearchSubscribe: Subscription;
  private getListSubscribe : Subscription;
  private itemsSubscribe : Subscription;
  isSelected;
  checkedList = [];
  checkedListLocation = [];
  selectedLocationIds = [];
  fetchItems = [];
  isListLoading = false;
  listing_url;
  itemcheckClick = false;
  allselectModel;
  getlistData;
  checkinfinite;
  scrollRefreshEvent;
  parms_action_name;
  listing;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;


  //---- list page variable --
  // pager object
  pager: any = {};
  pageNo = 1;
  // paged items
  pageItems: any[];
  listAlldata;
  // api parms
  api_parms: any = {};
  urlIdentifire = '';
  searchTerm:string = '';
  cherecterSearchTerm:string = '';
  sortColumnName = '';
  sortOrderName = '';
  advanceSearchParms = '';
  current_url_path_name;
  selectedindustryId;
  parms_action_name_category;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]

  constructor(
    private responsiveService : ResponsiveService,
    private http : HttpClient,
    private plt: Platform,
    private commonUtils : CommonUtils,
    private router: Router,
    private activatedRoute : ActivatedRoute,
  ) {}

  // init
  ngOnInit() {
    this.onResize();
    this.responsiveService.checkWidth();
  }

  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
      // console.log('this.isMobile >', this.isMobile);
    });
  }

  // ion View Will Enter call
  ionViewWillEnter() {
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
	  console.log('this.parms_action_name CMS >>>>>>>>>>>>>>', this.parms_action_name);

    // getlist data url name
    // this.getlist('skill/getlist');

    // list data url name
    // this.listing_url = 'daily_attendance_report?date=2019/12/10';
    if(this.parms_action_name == 'member-list'){
      this.listing_url = 'student/member_list'
      this.listing = 'Member';
    }else{
      this.listing_url = 'volunteer/volunteer_list'
      this.listing = 'Volunteer';
    }
    ;

    this.api_parms = {
      type:'frontend'
    }
  
    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire, '', ''); 

  }


  ionViewDidEnter(){

    // go to scroll top in mozila browser
    // this.content.scrollToTop(0);
  }

 
  //--------------  getlist data fetch start -------------
  
    getlist(_getlistUrl){
      this.plt.ready().then(() => {
        this.getlistLoading = true;
        this.selectLoading = true;
        this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
          resData => {
            this.selectLoading = false;
            this.getlistLoading = false;
            console.log('skill getlist resData >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resData);
            this.getlistData = resData;

          },
          errRes => {
            this.selectLoading = false;
            this.getlistLoading = false;
          }
        );
      });
    }
  // getlist data fetch end

  // ---------  list data function ---------
    listDataItems:any[] = [];
    noDataFoundText;
    noDataFound;
    onListData(_list_url, _displayRecord, _page, _apiParms, _search, _advSearchParms, _identifire, _checkinfinite, _eventidentifire) {
      this.plt.ready().then(() => {
        this.isListLoading = true;
        if(_checkinfinite != '' && _checkinfinite != undefined){
         // _checkinfinite.target.disabled = true; //infinite scroll disable
        }
        this.itemsSubscribe = this.commonUtils.fetchList(_list_url, _displayRecord, _page, _apiParms,  _search, _advSearchParms, _identifire).subscribe(
          resData => {
          this.isListLoading = false;

          if(_eventidentifire == 'refresh'){
            this.listDataItems = [];
          }

          this.fetchItems = resData[0];
          this.listAlldata = resData[1];

          if(resData[0] && resData[0].length > 0){
            resData[0].forEach(element => {
              if (this.listDataItems.indexOf(element.id) == -1) {
                this.listDataItems.push(element);
              }
            });


            if(_checkinfinite != '' && _checkinfinite != undefined){
              // _checkinfinite.target.complete();
              //  setTimeout(() => {
                _checkinfinite.target.complete(); // this is how you need to call in v4
                // Disable the infinite scroll
                _checkinfinite.target.disabled = false;  //infinite scroll enable
                // this.content.scrollToTop(0);
              // }, 100);
            }

            if(resData[1].last_page == this.pageNo){
              this.noDataFound = true;
              this.noDataFoundText='No More Data Found';
            }

            if(this.scrollRefreshEvent){
              setTimeout(() => {
                this.scrollRefreshEvent.target.complete(); // this is need to call in v4
              }, 500);
            }

            this.pageNo++;
            
          }else{
            if(this.scrollRefreshEvent){
              setTimeout(() => {
                this.scrollRefreshEvent.target.complete(); // this is need to call in v4
              }, 500);
            }
            if(_checkinfinite != '' && _checkinfinite != undefined){
            _checkinfinite.target.complete();
            }
            this.noDataFound = true;

            if(_eventidentifire == 'loadMore'){
              this.noDataFoundText='No More Data Found';
            }else{
              this.noDataFoundText='No Data Found';
            }
            
          }
      
        },
        errRes => {
          this.isListLoading = false;
          this.noDataFound = false;
        }
        );
      });
    }
  

  // ------- display record start-------
    displayRecord = this.commonUtils.displayRecord;
    displayRecords = this.commonUtils.displayRecords;
    displayRecordChange(_record) {
      this.displayRecord = _record;

      this.onListData(this.listing_url, this.displayRecord, '', this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire, '', '')

    }
  // display record end

  // ------------searchbar start------------------
    searchList(event){
      this.searchTerm = event.target.value;

      this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire, '', '')

    }
  // searchbar end

  // refresh
  ionRefresh(event) {

    this.scrollRefreshEvent = '';
    this.scrollRefreshEvent = event;

    this.pageNo = 1;
    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire, event, 'refresh')
  }

  // infinite scroll data fetch
  loadMoreData(event){
    // get pager object from service
    // this.pageNo++;
  
    // console.log("this.pageNo NNNNNNNNNNNNNNNNNn >", this.pageNo);

    this.scrollRefreshEvent = '';
    this.scrollRefreshEvent = event;
  
    this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.advanceSearchParms, this.urlIdentifire, event, 'loadMore');
  }

  // ----- click item hilight back start ----
    activeHighlightIndex;
    clickItemHighlight(index){
      this.activeHighlightIndex = index;
    }
  //click item hilight back end 



  // ----------- destroy subscription ---------
  ngOnDestroy() {
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
    if(this.itemsSubscribe !== undefined){
      this.itemsSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
  }

}