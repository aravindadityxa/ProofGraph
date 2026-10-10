import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminOverviewComponent } from './features/admin/admin-overview/admin-overview.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';

import { VerificationEngineComponent } from './shared/components/verification-engine/verification-engine.component';
import { RecordsTableComponent } from './shared/components/records-table/records-table.component';
import { ActivityFeedComponent } from './shared/components/activity-feed/activity-feed.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminComponent,
    AdminOverviewComponent,
    UserManagementComponent,
    VerificationEngineComponent,
    RecordsTableComponent,
    ActivityFeedComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
