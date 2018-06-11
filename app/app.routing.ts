import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login";
import { ShipmentComponent } from "./components/shipment/shipment";
import { BlankComponent } from "./components/blank";
import {AuthGuard} from "./authGuard";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full", canActivate:[AuthGuard] },
    { path: "login", component: LoginComponent, canActivate:[AuthGuard]},
    { path: "shipment", component: ShipmentComponent, canActivate:[AuthGuard] },
    { path: "blank", component: BlankComponent, canActivate:[AuthGuard] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }