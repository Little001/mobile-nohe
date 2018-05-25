import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import * as appSettings from "application-settings";
import {RouterExtensions} from "nativescript-angular";
import {platformNames} from "platform";
import {device} from "platform";
import {User} from "~/models/User";

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
    constructor(private http: HttpClient, private routerExtensions: RouterExtensions) { }

    public getUser(): User {
        return this.user;
    }

    public login(username: string, password: string) {
        let body = new HttpParams();
        let nativePlatformLocalhost;
        let options = LoginService.createRequestOptions();

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


        this.http.post("http://10.0.2.2:51246/api/login", body, { headers: options }).subscribe((data) => {
            let dataResponse = data as LoginResponse;

            appSettings.setString("token", dataResponse.Token);
            this.user = new User({
                ID: dataResponse.User.ID,
                username: dataResponse.User.username,
                role: dataResponse.User.role
            });
            this.routerExtensions.navigate(["/home"]);
        }, () => {
            this.routerExtensions.navigate(["/login"]);
        });
    };

    public logout() {
        let nativePlatformLocalhost;
        let options = LoginService.createRequestOptions();


        /*in some function or globally*/
        if(device.os === platformNames.ios){
            /*localhost for ios*/
            nativePlatformLocalhost= "localhost";
        }
        else if(device.os === platformNames.android){
            /*localhost for android*/
            nativePlatformLocalhost= "10.0.2.2";
        }


        this.http.post("http://10.0.2.2:51246/api/logout", null, { headers: options }).subscribe((data) => {
            this.routerExtensions.navigate(["/login"]);
        }, () => {
        });
    };

    private static createRequestOptions() {
        return new HttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        });
    }
}