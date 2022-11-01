import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController, Platform } from '@ionic/angular';

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

/* tslint:disable */ 

@Component({
  selector: 'app-choose-duration',
  templateUrl: './choose-duration.page.html',
  styleUrls: ['./choose-duration.page.scss'],
})

export class ChooseDurationPage implements OnInit {

  isLoading = false;
  userInfoLoading;

  isLogin = true;
  userTypes;
  model:any = {}


  constructor( 
	private activatedRoute : ActivatedRoute,
	private plt: Platform,
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private storage: Storage,
    private appComponent: AppComponent
  ) {}

  /*Variable Names*/
  private formSubmitSubscribe: Subscription;
  private getListSubscribe: Subscription;
  private contactByCompanySubscribe: Subscription;
  form_submit_text = 'Pay Now';
  form_api;
  parms_action_name;
  parms_action_id;
  getUserDetails;
  selectLoading;
  getlistdata;
  companyByContact_api;
  paymentoptions;
  payment_duration;
  durationList;
  selectLoadingDepend;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;


  ngOnInit() {

	this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
	console.log('this.parms_action_name CMS >>>>>>>>>>>>>>', this.parms_action_name);
	this.model.identifier = this.parms_action_name;

	// company by contact api
	this.companyByContact_api = 'student/'

	// getlist data
	this.getlist('student/getlist');

	// ============== user info data get ======================
	this.getListSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
		console.log(' =========== LEAVE  userdata observable  >>>>>>>>>>>', res);
		if(res){
			this.getUserDetails = res.userinfo;
		}
	});

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
	this.form_api = 'student/signup/'+this.parms_action_id;

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'student/signup?master=1';
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
  // ========================getlist data fetch Start========================
	getlist(_getlistUrl){
		this.plt.ready().then(() => {
		this.selectLoading = true;
		this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
			resData => {
			this.selectLoading = false;
			console.log('getlist resData >', resData);
			this.getlistdata = resData;

			if(this.parms_action_name == 'member') {
				this.durationList = resData.membership_duration;
			}else{
				this.durationList = resData.volunteership_duration;
			}
			

			// pre select duration id
			if( this.parms_action_name == 'add' && this.getUserDetails){
				resData.duration.forEach(element => {
				if(element.id == this.getUserDetails.id){
					this.model.duration = element;
					console.log('this.model.duration', this.model.duration);
				}
				});
				resData.status.forEach(element => {
				if(element.id == '0'){
					this.model.leave_statuss = element;
				}
				});
			}

			},
			errRes => {
			this.selectLoading = false;
			}
		);
		});
	}
	// getlist data fetch end

	// select box
	selectBoxChange(_item, _identifire) {

		if(_item == null){
			this.model.price = null;
		}
		let _id = _item.id;
		this.payment_duration = _item.name;
		this.model.value = _item.value;

		let identy;
		if(_identifire == 'duration'){
			identy = 'return_getPriceWithDuration?id';
			this.contactByCompany(_id,  identy);
		}
		console.log('port:', _id);
		this.contactByCompany(_id,  identy);
	}

	//contactByCompany
    contactByCompany = function( _id , _name){
		this.selectLoadingDepend = true;
		this.contactByCompanySubscribe = this.http.get(this.companyByContact_api+ _name + '=' +_id +'&type='+this.parms_action_name+'ship_duration').subscribe(
		  (res:any) => {
		  this.selectLoadingDepend = false;
		  
		  this.model.price = res.return_data.price;
			
			console.log(' this.model.price',  this.model.price);
		  if(res.return_status > 0){
  
			if(_name == 'return_getDegreeWithData?qualification'){
			  this.degreeList = res.return_data.degree;
			}else if(_name == 'return_getInterestWithData?degree'){
			  this.interestList = res.return_data.interest;
			}else if(_name == 'return_getSubjectWithData?qualification'){
			  this.subjectList = res.return_data.subject;
			}
		  }
		},
		errRes => {
		  this.selectLoadingDepend = false;
		}
		);
	}


  // ======================== form submit start ===================
	  clickButtonTypeCheck = '';
	  form_submit_text_save = 'Pay Now';
	  form_submit_text_save_another = 'Save & Add Another' ;

	  // click button type 
	  clickButtonType( _buttonType ){
	    this.clickButtonTypeCheck = _buttonType;
	  }

	  onSubmit(form:NgForm){
	    console.log("add form submit >", form.value);
	    
	    if(this.clickButtonTypeCheck == 'Pay Now'){
	      this.form_submit_text_save = 'Please Wait';
	    }else{
	      this.form_submit_text_save_another = 'Please Wait';
	    }

	    this.form_submit_text = 'Please Wait';

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

			// formsubmitRes;
	    this.formSubmitSubscribe = this.http.post("student/make_payment", fd).subscribe(
	      (response:any) => {

	        if(this.clickButtonTypeCheck == 'Pay Now'){
	          this.form_submit_text_save = 'Pay Now';
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
						description: this.parms_action_name +'ship',
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
						// alert('site_full_api: ' + response.return_data.site_full_api);

						// alert('response n >'+ JSON.stringify(response));


						this.http.get(response.return_data.site_full_api+'&payment_id='+payment_id).subscribe(
							(res:any) => {
								loadingEl.dismiss();
								// alert('payment success api > '+ JSON.stringify(response.return_data.site_full_api));
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
	        if(this.clickButtonTypeCheck == 'Pay Now'){
	          this.form_submit_text_save = 'Pay Now';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }
	        this.form_submit_text = 'Pay Now';
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
			if(this.getListSubscribe !== undefined){
				this.getListSubscribe.unsubscribe();
			}
			if(this.contactByCompanySubscribe !== undefined){
				this.contactByCompanySubscribe.unsubscribe();
			}
		}
	// destroy subscription end


}