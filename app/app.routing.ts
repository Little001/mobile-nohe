import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login";
import { HomeComponent } from "./components/home/home";
import { ShipmentComponent } from "./components/shipment/shipment";
import {AuthGuard} from "./can";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full", canActivate:[AuthGuard] },
    { path: "login", component: LoginComponent, canActivate:[AuthGuard]},
    { path: "home", component: HomeComponent, canActivate:[AuthGuard] },
    { path: "shipment", component: ShipmentComponent, canActivate:[AuthGuard] },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }