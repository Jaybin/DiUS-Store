import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DataService } from './services/data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductDetailsModalComponent } from './shared/components/product-details-modal/product-details-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadmeComponent } from './readme/readme.component';

@NgModule({
  declarations: [
    AppComponent,
    CatalogueComponent,
    CheckoutComponent,
    NavbarComponent,
    ProductDetailsModalComponent,
    ReadmeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(DataService),
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
