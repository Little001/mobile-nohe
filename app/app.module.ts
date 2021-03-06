import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { TNSFontIconModule } from 'nativescript-ng2-fonticon';
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { LoginComponent } from "./components/login/login";
import { ShipmentComponent } from "./components/shipment/shipment";
import { BlankComponent } from "./components/blank";
import { AuthGuard } from "~/authGuard";
import {LoaderService} from "~/services/loader.service";
import {NativeScriptUISideDrawerModule} from "nativescript-ui-sidedrawer/angular";
import {LoginService} from "~/services/login.service";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule,
        TNSFontIconModule.forRoot({
            'mdi': 'material-design-icons.css'
        })
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ShipmentComponent,
        BlankComponent
    ],
    providers: [
        AuthGuard,
        LoaderService,
        LoginService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
