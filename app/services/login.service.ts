import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import * as appSettings from "application-settings";
import {RouterExtensions} from "nativescript-angular";
import {platformNames} from "platform";
import {device} from "platform";
import {User} from "~/models/User";
import {API_URL, APP_SET_TOKEN, getUnauthorizedHeaders} from "../config";
import {LoaderService} from "~/services/loader.service";

interface LoginResponse {
    Token: string;
    User: {
        ID: number;
        username: string;
        role: number;
    }
}

@Injectable()
export class LoginService {
    private user: User;
    private _isLogged: boolean = false;
    constructor(private http: HttpClient, private routerExtensions: RouterExtensions, @Inject(LoaderService) private loader) { }

    public getUser(): User {
        return this.user;
    }

    public islogged(): boolean {
        return this._isLogged;
    }

    public login(username: string, password: string) {
        let body = new HttpParams();
        let nativePlatformLocalhost;

        this.loader.show();
        appSettings.clear();
        body = body.set('Username', username);
        body = body.set('Password', password);

        /*in some function or globally*/
        if(device.os === platformNames.ios){
            /*localhost for ios*/
            nativePlatformLocalhost= "localhost";
        }
        else if(device.os === platformNames.android){
            /*localhost for android*/
            nativePlatformLocalhost= "10.0.2.2";
        }


        this.http.post(API_URL + "login", body, { headers: getUnauthorizedHeaders() }).subscribe((data) => {
            let dataResponse = data as LoginResponse;

            appSettings.setString(APP_SET_TOKEN, dataResponse.Token);
            this.user = new User({
                ID: dataResponse.User.ID,
                username: dataResponse.User.username,
                role: dataResponse.User.role
            });
            this._isLogged = true;
            this.loader.hide();
            this.routerExtensions.navigate(["/shipment"], { clearHistory: true });
        }, () => {
            this.routerExtensions.navigate(["/login"], { clearHistory: true });
            this.loader.hide();
            alert("Wrong username or password");
        });
    };

    public logout() {
        let nativePlatformLocalhost;

        /*in some function or globally*/
        if(device.os === platformNames.ios){
            /*localhost for ios*/
            nativePlatformLocalhost= "localhost";
        }
        else if(device.os === platformNames.android){
            /*localhost for android*/
            nativePlatformLocalhost= "10.0.2.2";
        }


        this.http.post(API_URL + "logout", null, { headers: getUnauthorizedHeaders() }).subscribe((data) => {
            this._isLogged = false;
            appSettings.clear();
            this.routerExtensions.navigate(["/login"], { clearHistory: true });
        }, () => {
        });
    };
}