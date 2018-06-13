import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs";
import * as appSettings from "application-settings";
import {RouterExtensions} from "nativescript-angular";
import { APP_SET_TOKEN } from "~/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private routerExtensions: RouterExtensions) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): RxObservable<boolean>|Promise<boolean>|boolean {
        if (appSettings.getString(APP_SET_TOKEN)) {
            return true;
        } else {
            this.routerExtensions.navigate(["/login"], { clearHistory: true });
            return false;
        }
    }
}