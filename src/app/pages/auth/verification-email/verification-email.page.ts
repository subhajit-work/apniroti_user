import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../services/auth/auth.service';
import { CommonUtils } from '../../../services/common-utils/common-utils';
import{ AppComponent } from'../../../app.component';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.page.html',
  styleUrls: ['./verification-email.page.scss'],
})

export class VerificationEmailPage implements OnInit {

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
  form_submit_text = 'Submit';
  form_api;
  parms_action_name;
  parms_action_id;

  ngOnInit() {

	this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
	this.model.user_id = this.parms_action_id;
	
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

    /* if( this.parms_action_name == 'edit'){
	// form submit api edit
	this.form_api = 'student/user_varification/'+this.parms_action_id;

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'student/user_varification?master=1';
	console.log('edit data@@@@@@@@@@@@', this.form_api);
	} */
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
	    // get form value
	    let fd = new FormData();

	    for (let val in form.value) {
	      if(form.value[val] == undefined){
	        form.value[val] = '';
	      }
	      fd.append(val, form.value[val]);
		};
		
		if(this.clickButtonTypeCheck == 'Resend'){
			console.log('Resend');
			this.formSubmitSubscribe = this.http.post("student/send_verification_code?master=1", fd).subscribe(
			(response:any) => {
				if(response.return_status > 0){
	
				this.form_submit_text = 'Submit';
				
				this.commonUtils.presentToast('success', response.return_message);
	
				}else{
				this.form_submit_text = 'Submit';
				}
			},
			);

		}else{
			this.authenticate(form, fd);
		}

	    console.log('value >', fd);

	    if(!form.valid){
	      return;
		}
		

	  }

	  // authenticate function
	  authenticate(_form, form_data) {
		this.form_submit_text = 'Submitting';
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
			  authObs = this.authService.login('student/user_varification', form_data, '')
			  console.log('isLogin', this.isLogin);
			  authObs.subscribe(
				resData => {
				  console.log('resData', resData);
				  if(resData.return_status > 0){
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
			
			}
			
		  });
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
		}
	// destroy subscription end


}