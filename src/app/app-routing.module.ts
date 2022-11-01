import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'member-login',
    loadChildren: () => import('./pages/auth/member-login/member-login.module').then( m => m.MemberLoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'verification-email/:id',
    loadChildren: () => import('./pages/auth/verification-email/verification-email.module').then( m => m.VerificationEmailPageModule)
  },
  { 
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canLoad: [AuthGuard] 
  },
  {
    path: 'become-a-member',
    loadChildren: () => import('./pages/become-a-member/become-a-member.module').then( m => m.BecomeAMemberPageModule),
    canLoad: [AuthGuard] 
  },
  {
    path: 'become-a-volunteer',
    loadChildren: () => import('./pages/become-a-volunteer/become-a-volunteer.module').then( m => m.BecomeAVolunteerPageModule),
    canLoad: [AuthGuard] 
  },
  {
    path: 'donate-us',
    loadChildren: () => import('./pages/donate-us/donate-us.module').then( m => m.DonateUsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'choose-duration/:action',
    loadChildren: () => import('./pages/choose-duration/choose-duration.module').then( m => m.ChooseDurationPageModule)
  },
  {
    path: 'no-of-feed',
    loadChildren: () => import('./pages/no-of-feed/no-of-feed.module').then( m => m.NoOfFeedPageModule)
  },
  {
    path: 'vehicle-tracker',
    loadChildren: () => import('./pages/vehicle-tracker/vehicle-tracker.module').then( m => m.VehicleTrackerPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile-details/:id',
    loadChildren: () => import('./pages/profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  },
  {
    path: 'profile-edit/:id',
    loadChildren: () => import('./pages/profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  {
    path: 'user-details/:id',
    loadChildren: () => import('./pages/user-details/user-details.module').then( m => m.UserDetailsPageModule)
  },
  {
    path: 'list/:action',
    loadChildren: () => import('./pages/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'cms/:action',
    loadChildren: () => import('./pages/cms/cms.module').then( m => m.CmsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '**',   // redirects all other routes to the main page
    redirectTo: 'dashboard'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
