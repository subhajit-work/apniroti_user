import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.page.html',
  styleUrls: ['./cms.page.scss'],
})
export class CmsPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  private viewPageDataSubscribe: Subscription;
  parms_action_name;
  viewLoadData;
  listing_view_url;
  viewData;
  commonPageData;
  terms_page;
  // api parms
  api_parms: any = {};

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]

  constructor(
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private commonUtils : CommonUtils,
    private authService : AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    console.log('this.parms_action_name CMS >>>>>>>>>>>>>>', this.parms_action_name);

    if(this.parms_action_name == 'roles-and-responsibilities-of-member') {
      this.terms_page = 'member'
    }else if(this.parms_action_name == 'roles-and-responsibilities-of-volunteers') {
      this.terms_page = 'volunteer'
    }
    console.log('this.terms_page CMS >>>>>>>>>>>>>>', this.terms_page);

    // view page url name
    this.listing_view_url = 'cms/frontend_return_index?per_page=1000' ;
    

    this.viewPageData();
  }

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        console.log("view data  res cms -------------------->", res.return_data);
        if(res.return_status > 0){
          this.viewData = res.return_data[this.parms_action_name];
          console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
// view data fetch end

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}
