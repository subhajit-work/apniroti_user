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
import { environment } from 'src/environments/environment';

declare var RazorpayCheckout:any;

declare var $ :any; //jquary declear
@Component({
	selector: 'app-donate-us',
	templateUrl: './donate-us.page.html',
	styleUrls: ['./donate-us.page.scss'],
})

export class DonateUsPage implements OnInit {

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
  paymentoptions;
  payment_duration;
  cameToKnowList;
  identifier= 'donation';
  smile;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  ngOnInit() {
	// user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
        this.get_user_dtls = res.userinfo;
		console.log('dashboard userinfo',this.get_user_dtls);
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
			father_name : res.userinfo.father_name,
			image : res.userinfo.profile,
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
		
		this.model.smile = this.model.price *2;

		/* Dynamic send hidden value */
		if(this.get_user_dtls.approve == 0 ) {
			this.model.approve = false;
		}else {
			this.model.approve = true;
		}
		
      }else{
        this.userInfoLoading = false;
        this.get_user_dtls = '';
      }
	});
	// End


	//Identifier
	this.model.identifier = this.identifier;

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
	this.form_api = 'student/make_donation/'+this.parms_action_id;

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'student/make_donation';
	console.log('edit data@@@@@@@@@@@@', this.form_api);
	}
  }

  ionViewWillEnter() {
	this.model.smile ='0';

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
  
  onSearchChange(searchValue: string): void {  
	console.log(searchValue);
	this.smile = searchValue;
	this.model.smile = Math.floor(parseInt(this.smile) /2);
  }
  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }


  // ======================== form submit start ===================
	  clickButtonTypeCheck = '';
	  form_submit_text_save = 'Donate Now';
	  form_submit_text_save_another = 'Save & Add Another' ;

	  // click button type 
	  clickButtonType( _buttonType ){
	    this.clickButtonTypeCheck = _buttonType;
	  }

	  onSubmit(form:NgForm){
	    console.log("add form submit >", form.value);
	    
	    if(this.clickButtonTypeCheck == 'Donate Now'){
	      this.form_submit_text_save = 'Donating';
	    }else{
	      this.form_submit_text_save_another = 'Donating';
	    }

	    this.form_submit_text = 'Donating';

	    // get form value
	    let fd = new FormData();

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

	    this.formSubmitSubscribe = this.http.post("student/make_donation", fd).subscribe(
	      (response:any) => {

	        if(this.clickButtonTypeCheck == 'Donate Now'){
	          this.form_submit_text_save = 'Donate Now';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }

	        // this.authService.getTokenSessionMaster();

	        console.log("add form response >", response);

	        if(response.return_status > 0){
				this.form_submit_text = 'Proceed to Pay';
				
				this.loadingController
				.create({ 
					spinner: "lines",
					message: 'Please wait...',
					cssClass: 'custom-loading',
				 })
				.then(loadingEl => {
					loadingEl.present();
					// bank object
					// this.model = {};

					// RazorpayCheckout.open(this.paymentoptions, successCallback, cancelCallback);

					this.commonUtils.presentToast('success', response.return_message);
		
					// getlist data
					// this.getlist('student/getlist');
		
					
					/* // -----------------razorpay payment getwat call start-------------------
					
					var paymentSucessVariable = 0;
					this.paymentoptions = {
						"key": response.return_data.site.razorpay_key, //(rzp_test_oBBldknGgfDRpv) Enter the Key ID generated from the Dashboard
						"amount": this.model.price * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
						"currency": "INR",
						"name": this.payment_duration,
						"description": this.parms_action_name +'ship',
						// "image": this.file_url+'/'+ response.return_data.skill.image,
						"handler": function (responses) {
						//alert(response.razorpay_payment_id); //error alert
					
						console.log('===================== my api call ================');
						// bank object
						this.model = {};
						
						//------ api call only javascript work start---------
						var opts = {
							method: 'GET',      
							headers: {}
						};
						console.log("add form response >@@@@@@@@@@", response);
						var order_api = response.return_data.site_full_api+'&payment_id='+responses.razorpay_payment_id;
						fetch(order_api, opts).then(function (responsee) {
							// return response.json();
						})
						.then(function (body) {
							//doSomething with body;
							console.log('body >>>>>>>>>>>>>>>>>>>>', body);
							paymentSucessVariable = 1;
							// this.router.navigateByUrl(`dashboard`);
						});
						//-api call only javascript work end-
		
						// this.router.navigateByUrl(`dashboard`);
						
						},
						"prefill": {
						"name": response.return_data.full_name,
						"email": response.return_data.userinfo.email,
						"contact": response.return_data.userinfo.mobile
						},
						"notes": {
						"address": response.return_data.userinfo.address_1
						},
						"theme": {
						"color": "#9b4531"
						}
					};
					// initPay() {
						var rzp1 = new Razorpay(this.paymentoptions);
						rzp1.open();
						console.log("payment works");
					// }
					//------ razorpay payment getwat call end ----- */
					
					// -----------------razorpay payment getwat call start-------------------
					
					var paymentSucessVariable = 0;
					this.paymentoptions = {
						description: 'Donation',
						// image: 'https://i.imgur.com/3g7nmJC.png',
						currency: "INR", // your 3 letter currency code
						key: response.return_data.site.razorpay_key, // your Key Id from Razorpay dashboard
						amount: this.model.price * 100, // Payment amount in smallest denomiation e.g. cents for USD
						name: this.payment_duration,
						prefill: {
							"name": response.return_data.full_name,
							"email": response.return_data.userinfo.email,
							"contact": response.return_data.userinfo.mobile
						},
						notes: {
							"address": response.return_data.userinfo.address_1
						},
						theme: {
							color: '#F37254'
						},
						modal: {
							ondismiss: function () {
							alert('dismissed')
							loadingEl.dismiss();
							}
						}
					};

					var successCallback = (payment_id) => {
						// alert('payment_id ss2: ' + payment_id);

						// alert('response n >'+ JSON.stringify(response));


						this.http.get(response.return_data.site_full_api+'&payment_id='+payment_id).subscribe(
							(res:any) => {
								loadingEl.dismiss();
								// alert('payment success api > '+ JSON.stringify(res));
								this.router.navigateByUrl(`cms/thank-you`);
							},
							errRes => {
								// alert('payment error');
							}
						);
						
						
						};

						var cancelCallback = function (error) {
							loadingEl.dismiss();
							// alert(error.description + ' (Error ' + error.code + ')');
						};

						
						/* var successCallback = (payment_id) => { // <- Here!
							alert('payment_id new: ' + payment_id);
							this.router.navigateByUrl(`cms/thank-you`);
						};

						var cancelCallback = (error) => { // <- Here!
							alert(error.description + ' (Error ' + error.code + ')');
						}; */
						
				
				
					RazorpayCheckout.open(this.paymentoptions, successCallback, cancelCallback);

					// initPay() {
						/* var rzp1 = new Razorpay(this.paymentoptions);
						rzp1.open();
						console.log("payment works"); */
					// }
					//------ razorpay payment getwat call end -----
				
					// this.router.navigateByUrl(`dashboard`);
					
					/* // payment success then redirect to dashboard
					let prevNowPlaying = setInterval(() => {
					if(paymentSucessVariable == 1){
						clearInterval(prevNowPlaying);
						this.router.navigateByUrl(`cms/thank-you`);
		
					}
					}, 1000); */
				});
	        }
	      },
	      errRes => {
	        if(this.clickButtonTypeCheck == 'Donate Now'){
	          this.form_submit_text_save = 'Donate Now';
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