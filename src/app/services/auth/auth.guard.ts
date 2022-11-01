import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

/* tslint:disable */ 
@Injectable({
  providedIn: 'root'
})
// CanLoad is need for befor module loaded it check auth true or false
export class AuthGuard implements CanLoad  {

  // variable
  get_path_name;

  constructor( 
    private authService : AuthService,
    private router : Router
  ){
  }

  canLoad(
    route: Route, 
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean{
      return this.authService.globalparamsData.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if (!isAuthenticated) {
            // console.log('when auto login >');
            return this.authService.autoLogin();
          } else {
            // console.log('when menually login >');
            return of(!!isAuthenticated); //(!!) means true or false (boolean value)
          }
        }),
        tap(isAuthenticated => {
          // console.log('isAuthenticated gurd ##################### 222', isAuthenticated);
    
          if (!isAuthenticated) {
            this.router.navigateByUrl('/auth');
          }
        })
      );

  }
}