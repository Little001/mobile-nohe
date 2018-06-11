import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs";
import * as appSettings from "application-settings";
import {RouterExtensions} from "nativescript-angular";
import {APP_SET_LAST_ROUTE, APP_SET_WAS_SUSPENDED} from "~/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private routerExtensions: RouterExtensions) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): RxObservable<boolean>|Promise<boolean>|boolean {
        let last_route = appSettings.getString(APP_SET_LAST_ROUTE);
        let toState = route.url.toString();

        appSettings.setString(APP_SET_LAST_ROUTE, toState);
        if (toState === "login" && appSettings.getString(APP_SET_WAS_SUSPENDED)) {
            this.routerExtensions.navigate([last_route], { clearHistory: true });
        }

        appSettings.remove(APP_SET_WAS_SUSPENDED);
        return true;
    }
}