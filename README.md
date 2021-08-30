# DiusComputerStore

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.5.

## Development server

Run `npm install` to install all dependencies. Once that is completed, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Features

Welcome to DiUS Computer Store. This is a one stop shop for all your technology requirements.
All products are displayed in the catalogue section.
The store can be accessed in two modes - admin and customer, although authentication and that separation has not been handled.
Admin users can add new products to the catalogue, edit existing product in catalogue, delete a product from the catalogue.
Customers can add items to their cart by clicking the add to cart button next to the product.
Customers can scan (+ button) or remove the products (- button) from their cart via the modal that pops up.
It displays the total amount, calculates discounts, updates freebies if available on offer and adjusts the total accordingly.
Customer can remove product from the cart in the checkout section or remove from the catalogue page via the modal when they click the add to cart button.
An assumption has been made to apply the logic for freebies (i.e products that are provided free of charge along with other products).
When a product that has an associated freebie is scanned, the freebie item is automatically added to the cart depending upon business requirement.
Now if user scans a new product (that was already added as a freebie) after this, an entry will be added to the cart and user will be charged for this.
So the third test scenario may not work as expected. Nevertheless, the calculation for total will adhere to the discounts applied.
The other scenarios should all work fine.
The app consists of a root app component, navbar component, catalogue component, product-details-modal component, checkout component and a readme component.
All interfaces used for the application has been added to the interfaces folder.
All constant values used in the application have been defined in the constants folder.
Backend operations for managing CRUD operations on products is handled by the angular-in-memory-web-api
The service folder holds all services to handle API requests to the angular-in-memory-web-api, generate seed data for catalogue and managing cart operations.
Routing is managed by the app-routing module.
There is scope for future UI implementation to build/configure the logic for 'specials' section.
Right now it is configurable based on the properties in the ISpecial interface, but not from the UI.
An example of how this can be achieved is in the data.service.ts file.
A few unit test cases have been added to test the business logic in the component files.