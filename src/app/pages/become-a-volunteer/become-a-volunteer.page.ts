import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-become-a-volunteer',
  templateUrl: './become-a-volunteer.page.html',
  styleUrls: ['./become-a-volunteer.page.scss'],
})

export class BecomeAVolunteerPage implements OnInit {

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

  /*Variable Names*/
  private formSubmitSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  form_submit_text = 'Submit';
  form_api;
  parms_action_name;
  parms_action_id;
  get_user_dtls;
  identifier = 'volunteer';
  commonPageData;
  genderArry;
  cameToKnowList;
  setStartdate;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;

  ngOnInit() {

	// user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
		this.get_user_dtls = res.userinfo;
		this.cameToKnowList = res.userinfo.came_to_know_arr;
		
		this.model = {
			fname : res.userinfo.fname,
			lname : res.userinfo.lname,
			mobile : res.userinfo.mobile,
			pin : res.userinfo.pin,
			email : res.userinfo.email,
			password : res.userinfo.password,
			gender : res.userinfo.gender,
			dob : res.userinfo.dob,
			image : res.userinfo.profile,
			father_name : res.userinfo.father_name,
			resume : res.userinfo.resume,
			nationality : res.userinfo.nationality,
			religion : res.userinfo.religion,
			adhar_no : res.userinfo.adhar_no,
			occupation : res.userinfo.occupation,
			address_1 : res.userinfo.address_1,
			address_2 : res.userinfo.address_2,
			username : res.userinfo.username,
			came_to_know : res.userinfo.came_to_know_name,
			referred_by : res.userinfo.referred_by,
			approve : res.userinfo.approve
		};

		

		/* Dynamic send hidden value */
		if(this.get_user_dtls.approve == 0 ) {
			this.model.approve = false;
		}else {
			this.model.approve = true;
		}
		// gender selected
		this.genderArry = res.userinfo.gender_arr;
		console.log('this.genderArry', this.genderArry);
		if(res.userinfo.gender_arr){
		  res.userinfo.gender_arr.forEach(element => {
			element.gender = res.userinfo.gender;
		  });
		}
		console.log('dashboard userinfo',this.get_user_dtls);
		
      }else{
        this.userInfoLoading = false;
        this.get_user_dtls = '';
      }
	});
	// End

	//Today
	let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    // menu hide
    // this.menuCtrl.enable(true);

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
	this.form_api = 'student/volunteer_signup/'+this.parms_action_id;

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'student/volunteer_signup?master=1';
	console.log('edit data@@@@@@@@@@@@', this.form_api);
	}
  }

  ionViewWillEnter() {

    // this.appComponent.userInfoData();

    // menu hide
    // this.menuCtrl.enable(true);

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

	    this.formSubmitSubscribe = this.http.post("student/volunteer_signup", fd).subscribe(
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
	          
			  this.router.navigateByUrl(`choose-duration/${this.identifier}`);
	          
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
			if(this.userInfoDataSubscribe !== undefined){
				this.userInfoDataSubscribe.unsubscribe();
			}
		}
	// destroy subscription end


}