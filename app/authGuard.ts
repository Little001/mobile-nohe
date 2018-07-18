import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs";
import {LoaderService} from "~/services/loader.service";
import { LoginService } from "~/services/login.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private loader: LoaderService, private loginService: LoginService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): RxObservable<boolean>|Promise<boolean>|boolean {
        this.loader.show();
        return this.loginService.checkToken();
    }
}