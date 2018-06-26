import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs";
import * as appSettings from "application-settings";
import {RouterExtensions} from "nativescript-angular";
import {API_URL, getAuthorizedHeaders} from "~/config";
import {LoaderService} from "~/services/loader.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private routerExtensions: RouterExtensions, private loader: LoaderService, private http: HttpClient) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): RxObservable<boolean>|Promise<boolean>|boolean {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.http.post(API_URL + "checkToken", null, { headers: getAuthorizedHeaders() }).subscribe((data) => {
                resolve(true);
                this.loader.hide();
            }, () => {
                reject(false);
                appSettings.clear();
                this.routerExtensions.navigate(["/login"], { clearHistory: true });
                this.loader.hide();
            });
        });
    }
}