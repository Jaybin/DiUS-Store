import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReadmeComponent } from './readme/readme.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogueComponent
  },
  {
    path: 'catalogue',
    component: CatalogueComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'readme',
    component: ReadmeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
