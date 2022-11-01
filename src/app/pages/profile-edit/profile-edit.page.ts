import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { CommonUtils } from '../../services/common-utils/common-utils';
import{ AppComponent } from'../../app.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})

export class ProfileEditPage implements OnInit {

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
    private activatedRoute : ActivatedRoute,
  ) { }

  /*Variable Names*/
  private formSubmitSubscribe: Subscription;
  private viewPageDataSubscribe: Subscription;
  form_submit_text = 'Submit';
  form_api;
  parms_action_name;
  parms_action_id;
  get_user_dtls;
  identifier = 'member';
  listing_view_url;
  viewLoadData;
  pageData;
  viewData;
  genderArry;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;
  

  ngOnInit() {
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    // view page url name
    this.listing_view_url = 'student/return_edit/'+this.parms_action_id ;

    this.viewPageData();
	
    // menu hide
    // this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          // this.router.navigateByUrl('/dashboard');
        }
      }
    });

    if( this.parms_action_name == 'edit'){
	// form submit api edit
	this.form_api = 'student/member_signup/'+this.parms_action_id;

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'student/member_signup?master=1';
	console.log('edit data@@@@@@@@@@@@', this.form_api);
	}
  }

  ionViewWillEnter() {

    // this.appComponent.userInfoData();

    // menu hide
    // this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          // this.router.navigateByUrl('/dashboard');
        }
      }
    });
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  // radiobutton change
	radioButtonChange(_val){
		console.log('radio button change value >', _val);
	}

  	// ionic date picker
	pickDate(_item, _identifire){
		console.log("pickTime _item >>>>>>>>>.", _item);
		if(_identifire == 'startDate'){
		this.model.dob = moment(_item).format("YYYY-MM-DD");
		this.model.end_date = '';
		}else if(_identifire == 'endDate'){
		this.model.end_date = moment(_item).format("YYYY-MM-DD");
		}
	
		// two dates difference in number of days
		if(this.model.dob && this.model.end_date){
		let startDate = moment(this.model.dob, "YYYY-MM-DD");
		let endDate = moment(this.model.end_date, "YYYY-MM-DD");
		
		this.model.no_of_days = endDate.diff(startDate, 'days');
		}
	
	}

	// clear form item
	clearItem(_identifire, _item){
		if(_identifire == 'dob'){
		this.model.dob = '';
		this.model.end_date = '';
		}else if(_identifire == 'end_date'){
		this.model.end_date = '';
		}
  }
  
  // Normal file upload
  fileValResume;
  fileValprofile;
  fileValprofileCross;
  fileValResumeCross;
  normalFileNameResume;
  normalFileNameProfile;
  uploadImagePathShow = false;
  uploadresumePathShow = false;
  imgaePreview;
  normalFileUpload(event, _item, _name) {
    console.log('nomal file upload _item => ', _item);
    console.log('nomal file upload _name => ', _name);

    if(_name == 'resume'){
      this.fileValResume =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameResume = _name;
      this.uploadresumePathShow = true;
    }else{
      this.fileValprofile =  event.target.files[0];

      const render = new FileReader();
      render.onload = () =>{
        this.imgaePreview = render.result;
        // console.log('this.imgaePreview >>', this.imgaePreview);
      }
      render.readAsDataURL(this.fileValprofile);

      _item =  event.target.files[0].name;
      this.normalFileNameProfile = _name;
      this.uploadImagePathShow = true;
    }
  }
  fileCross(_item, _identifire){
    if(_identifire == 'resume'){
      this.model.resume = null;
      this.model.resume2 = null;
      this.normalFileNameResume = '';
      this.fileValResumeCross = 'cross_resume';

    }else{
      this.model.image = null;
      this.model.image2 = null;
      this.normalFileNameProfile = '';
      this.fileValprofileCross = 'cross_image';
      this.uploadImagePathShow = false;
    }
  }
  // Normal file upload end

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        this.pageData = res.return_data;

        this.model = {
          fname : res.return_data.fname,
          lname : res.return_data.lname,
          mobile : res.return_data.mobile,
          pin : res.return_data.pin,
          email : res.return_data.email,
          password : res.return_data.password,
          gender : res.return_data.gender,
          dob : res.return_data.dob,
          father_name : res.return_data.father_name,
          image : res.return_data.image,
          resume : res.return_data.resume,
          nationality : res.return_data.nationality,
          religion : res.return_data.religion,
          adhar_no : res.return_data.adhar_no,
          occupation : res.return_data.occupation,
          address_1 : res.return_data.address_1,
          address_2 : res.return_data.address_2,
          username : res.return_data.username,
          approve : res.return_data.approve,
          role_id : res.return_data.user_type,
          status : true
        };

        /* Dynamic send hidden value */
        if(this.pageData.approve == 0 ) {
          this.model.approve = false;
        }else {
          this.model.approve = true;
        }
        // gender selected
        this.genderArry = res.return_data.gender_arr;
        console.log('this.genderArry', this.genderArry);
        if(res.return_data.gender_arr){
          res.return_data.gender_arr.forEach(element => {
          element.gender = res.return_data.gender;
          });
        }

        console.log('this.pageData', this.pageData);
        if(res.return_status > 0){
          this.viewData = res.return_data[this.parms_action_id];
          console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  // ======================== form submit start ===================
	  clickButtonTypeCheck = '';
	  form_submit_text_save = 'Save';
	  form_submit_text_save_another = 'Save & Add Another' ;

	  // click button type 
	  clickButtonType( _buttonType ){
	    this.clickButtonTypeCheck = _buttonType;
	  }

	  onSubmit(form:NgForm){
	    console.log("add form submit >", form.value);
	    
	    if(this.clickButtonTypeCheck == 'Save'){
	      this.form_submit_text_save = 'Submitting';
	    }else{
	      this.form_submit_text_save_another = 'Submitting';
	    }

	    this.form_submit_text = 'Submitting';

	    // get form value
      let fd = new FormData();
      
      // fileValprofile
      if(this.fileValprofile) {
        // normal file upload
        fd.append(this.normalFileNameProfile, this.fileValprofile, this.fileValprofile.name);
      }else if(this.fileValprofileCross == 'cross_image'){
        fd.append('image', 'removed');
      }else{
        fd.append('image', '');
      }

	    for (let val in form.value) {
	      if(form.value[val] == undefined){
	        form.value[val] = '';
	      }
	      fd.append(val, form.value[val]);
	    };

	    console.log('value >', fd);

	    if(!form.valid){
	      return;
	    }

	    this.formSubmitSubscribe = this.http.post("student/return_edit/"+this.parms_action_id, fd).subscribe(
	      (response:any) => {

	        if(this.clickButtonTypeCheck == 'Save'){
	          this.form_submit_text_save = 'Save';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }

	        // this.authService.getTokenSessionMaster();

	        console.log("add form response >", response);

	        if(response.return_status > 0){

            this.form_submit_text = 'Submit';
            
            this.appComponent.userInfoData();
	          
            //   this.router.navigateByUrl(`choose-duration`);
            console.log('this.identifier', this.identifier);
            this.router.navigateByUrl(`profile-details/${this.parms_action_id}`);
			  
			  
			  
	          // user details set
	          if(this.get_user_dtls){
	            this.commonUtils.onClicksigninCheck(this.get_user_dtls);
	          }
	          // this.commonUtils.presentToast(response.return_message);
	          this.commonUtils.presentToast('success', response.return_message);

	          if(this.clickButtonTypeCheck == 'Save'){

	            // this.router.navigate(['/student-list']);

	          }

	          // this.notifier.notify( type, 'aa' );
	    
	          if( this.parms_action_name == 'add'){
	            // form.reset();
	            this.model = {};
	            this.model = {
	              enable : 'true',
	              sms: 'true',
	              emailcheck: 'true'
	            };
	          }
	          
	        }else{
	          this.form_submit_text = 'Submit';
	        }
	      },
	      errRes => {
	        if(this.clickButtonTypeCheck == 'Save'){
	          this.form_submit_text_save = 'Save';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }
	        this.form_submit_text = 'Submit';
	      }
	    );

	  }
	// form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }

    // ----------- destroy subscription start ---------
		ngOnDestroy() {
			if(this.formSubmitSubscribe !== undefined){
			  	this.formSubmitSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
		}
	// destroy subscription end


}