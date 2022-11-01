import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, Platform, NavParams, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subscription, from } from 'rxjs';
import { take } from 'rxjs/operators';


import { CommonUtils } from '../../../services/common-utils/common-utils';
import { environment } from '../../../../environments/environment';

// for login
import { AuthService } from '../../../services/auth/auth.service';


/* tslint:disable */ 
@Component({
  selector: 'app-add-common-model',
  templateUrl: './add-common-model.page.html',
  styleUrls: ['./add-common-model.page.scss'],
})
export class AddCommonModelPage implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = '';
  
  // variable declar
  model: any = {};
  form_submit_text = 'Submit';
  private formSubmitSubscribe: Subscription;
  private editDataSubscribe: Subscription;
  private getListSubscribe: Subscription;
  setStartdate;
  api_url;

  get_identifier;
  get_item;
  get_array;
  heder_title;
  onEditField = 'PUT';
  jobApplyStatus = 'true';
  showSubmitButton = true;
  previewOtherUrl;
  principleStartdate;
  get_identifier_type;
  onHiddenFieldIdentifire;
  get_hidden_type;
  onHiddenFieldStatus;
  selectLoading;
  site_url_name;
  senduserId;
  senduserIdStatus = false;

  parentList;
  isLoading = false;

  // @Input() identifire;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private http : HttpClient,
    private navParams : NavParams,
    private commonUtils: CommonUtils, // common functionlity come here
    private authService:AuthService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {

    // today select
    let curentDate = new Date();
    this.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    // this.model.setStartdate = moment(curentDate).format('DD/MM/YYYY');

    this.get_identifier =  this.navParams.get('identifier');
    this.get_identifier_type =  this.navParams.get('identifier_type');
    this.get_hidden_type =  this.navParams.get('hidden_type');

    this.get_item =  this.navParams.get('modalForm_item');
    this.get_array =  this.navParams.get('modalForm_array');
    console.log('this.get_item >>>>>>>>>>>>>>', this.get_item);

  
    if(this.get_identifier == 'change_password_modal'){
      this.heder_title = 'Change Password';
      this.onEditField = 'PUT';
      this.api_url = 'login/change_password/'+ this.get_item.id;
    }

  }

  // ======================== form submit start ===================
    onSubmit(form:NgForm){
      this.form_submit_text = 'Submitting';

      // get form value
      let fd = new FormData();

      // get_in_touch
      if(this.get_identifier == 'get_in_touch'){
        if(this.fileValResume) {
          // normal file upload
          fd.append('resume', this.fileValResume, this.fileValResume.name);
        }else{
          fd.append('resume', '');
        }
      }
      
      for (let val in form.value) {
        if(form.value[val] == undefined){
          form.value[val] = '';
        }
        fd.append(val, form.value[val]);

      };

      if(!form.valid){
        return;
      }
      this.formSubmitSubscribe = this.http.post(this.api_url, fd).subscribe(
        (response:any) => {
          if(this.get_identifier == 'apply_query'){
            this.form_submit_text = 'Apply';
          }else{
            this.form_submit_text = 'Submit';
          }
          if(response.return_status > 0){

            this.commonUtils.presentToast('success', response.return_message);
            form.reset();
            
            if(this.get_identifier == 'get_in_touch'){
              this.model = {};
              this.model.resume = '';
              this.model.resume2 = '';
              this.fileValResume = '';
            }

            if(this.get_identifier == 'apply_query'){
              this.modalController.dismiss('applyQuerysubmitClose');
              this.get_item.job_applied = 1;
            }else{
              this.modalController.dismiss('submitClose');
              
            }
          }
        },
        errRes => {
          if(this.get_identifier == 'apply_query'){
            this.form_submit_text = 'Apply';
          }else{
            this.form_submit_text = 'Submit';
          }
        }
      );

    }
  // form submit end

  // onChange dropdown
  onChange(event){

  }

  // close modal
  closeModal() {
    // this.modalController.dismiss(this.arrayList);
    this.modalController.dismiss();
  }

  // -----datepicker start------

    datePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      toDate: new Date(),
      closeOnSelect: true,
      yearInAscending: true
    };

    principledatePickerObj: any = {
      dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
      closeOnSelect: true,
      yearInAscending: true
    };

    // get selected date
    myFunction(){
      console.log('get seleted date')
    }
// datepicker 

  // -------------- edit page api call start  ------------
    profileLoading;
    allClient;
    editPagaDataCall(api_name, _item){
      // console.log('aa _item >', _item.toString());
      this.onEditField = 'PUT';
      this.profileLoading = true;
      //edit data call
      this.editDataSubscribe = this.http.get(api_name+'/'+_item.id).subscribe(
        (res:any) => {
          this.profileLoading = false;
          console.log("Edit data  res profile >", res.return_data);
          if(res.return_status > 0){

            this.model = {
              name : res.return_data.name,
              // borrower : JSON.parse(res.return_data.client[0].id),
              // enable : res.return_data.status,
              is_login : res.return_data.is_login,
              description : res.return_data.description
            };

            // status
            if(res.return_data.status){
              if(res.return_data.status == '1'){
                  this.model.enable = 'true';
              }else{
                  this.model.enable = '';
              }
            }
            
            if(res.return_data.user_info){
              this.model.username = res.return_data.user_info[0].email;
              this.model.password = res.return_data.user_info[0].password;
            }

            // console.log('country >', this.model.country);
            this.allClient = [];
            res.return_data.client.forEach(element => {
              this.allClient.push(element);
            });
            // this.selectedPeople = [this.people[0].id, this.people[1].id
          }
        },
        errRes => {
          // this.selectLoadingDepend = false;
          this.profileLoading = false;
        }
      );

    }
  // edit page api call end

// getlist data fetch start
  getlist(_getlistUrl){
    this.plt.ready().then(() => {
      this.selectLoading = true;
      this.getListSubscribe = this.commonUtils.getlistCommon(_getlistUrl).subscribe(
        resData => {
          this.selectLoading = false;
          this.parentList = resData.parent;
        },
        errRes => {
          this.selectLoading = false;
        }
      );
    });
  }
// getlist data fetch end

// Normal file upload
  fileVal;
  fileValResume;
  uploadresumePathShow = false;
  normalFileUpload(event) {
    this.fileVal =  event.target.files[0];
    this.model.csvFile =  event.target.files[0].name;

    this.fileValResume =  event.target.files[0];
    this.model.resume =  event.target.files[0].name;
    this.uploadresumePathShow = true;
  }
  fileCross(){
    this.model.csvFile = '';
    this.model.image2 = '';
    
    this.model.resume = '';
    this.model.resume2 = '';
    this.fileValResume = '';
  }
// Normal file upload end

// ------ export function call start ------
  export_url;
  onExport(_identifier, _item){
    this.getListSubscribe = this.authService.globalparamsData.subscribe(res => {
    //  this.export_url = this.main_url+'/transaction_print/'+_item+'?token='+res.token+'&master='+res.master;
      this.export_url = this.file_url+'/'+_item;
    });
    window.open(this.export_url);
  }
// export function call end

  // destroy call
  ngOnDestroy(){
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
    if(this.editDataSubscribe !== undefined){
      this.editDataSubscribe.unsubscribe();
    }
    if(this.getListSubscribe !== undefined){
      this.getListSubscribe.unsubscribe();
    }
  }

}

