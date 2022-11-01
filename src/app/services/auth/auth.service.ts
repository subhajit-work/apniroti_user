import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, of, empty } from 'rxjs';
import { take, map, tap, delay, switchMap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonUtils } from '../../services/common-utils/common-utils';
 
const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  current_url_path_name;

  // private _globalparamsData = null;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }

  constructor(
    private commonUtils : CommonUtils,
    private storage: Storage, 
    private http : HttpClient,
    private router: Router
  ) { 
  }
 

  //================== auto login start ===================
    autoLogin(){
      // stroage data get
      return from(this.storage.get('setStroageGlobalParamsData')).pipe(
        map(storData => {
          // console.log('storData @@@@@@@>>>>>', storData);
          if(!storData || !storData.token && !storData.session && !storData.toke){
            return null;
          }
          const storeauth = {
            'token': storData.token,
            'session': storData.session,
            'master': storData.master,
            'user': storData.user,
            'user_type': storData.user_type 
          }
          return storeauth;
        }),
        tap(storeauthtication => {
          if (storeauthtication) {
            this._globalparamsData.next(storeauthtication);
          }
        }),
        map(userLog => {
          // console.log("auto login map userLog >>>", userLog);
          return !!userLog;  //return true/false(boolen value)
        })
      );
    }
  // auto login end

  //----- login check for website start------
  autoLoginWebsite(){
    let autologinObsData = from(this.storage.get('setStroageGlobalParamsData'));
    this._globalparamsData.next(autologinObsData);
    return autologinObsData;
  }
  // login check for website end
  
  // ================= login service call start ==================
    login(_url, _data, _siteInfo) {
      return this.http.post(`${_url}?master=${API_MASTER}`, _data).pipe(
        tap(this.setGlobalParams.bind(this)) //use for response value send
      );
    }
    // ---setGlobalParams function defination----
    private setGlobalParams(resData){
      // console.log('..................set 11 >', resData);
      this._globalparamsData.next(
        {
          'token': resData.return_data.token,
          'session': resData.return_data.session,
          'master': resData.return_data.master,
          'user': resData.return_data.user_info,
          'user_type': resData.return_data.user_type
        }
      );

      // stroage
      this.storeAuthData(resData);
    }
    //--- storeAuthData function defination---
    private storeAuthData(_data) {
      console.log('data>>>>>>>>>>>>>>>>>>>>>>>> s', _data.return_data);
      // set stroage data
      this.storage.set('setStroageGlobalParamsData',  {
        'token': _data.return_data.token,
        'session': _data.return_data.session,
        'master': _data.return_data.master,
        'user': _data.return_data.user_info,
        'user_type': _data.return_data.user_type 
      });
      // Plugins.Storage.set({ key: 'authData', value: data });
    }
  //login service call end

  //======================= logout functionlity start ==============
    logout() {
      this.storage.clear().then(() => {
        console.log('all stroage data cleared');
        // this.router.navigateByUrl('/auth');

        this._globalparamsData = new BehaviorSubject(null);
  

        // working code 
        //window.location.reload(); //working

        // user details get
        // this.commonUtils.onSigninStudentInfo(empty());
        // this.commonUtils.onSigninStudentInfo(null);

        // this.router.navigateByUrl('/auth');
        this.router.navigate(['auth'], {replaceUrl: true});


      });
      // this._globalparamsData = null;
    }
  // logout functionlity end
 
}