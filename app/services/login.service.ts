import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {platformNames} from "platform";
import {device} from "platform";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }

    public login() {

        let nativePlatformLocalhost;

        /*in some function or globally*/
        if(device.os === platformNames.ios){
            /*localhost for ios*/
            nativePlatformLocalhost= "localhost";
        }
        else if(device.os === platformNames.android){
            /*localhost for android*/
            console.log("cajk");
            nativePlatformLocalhost= "10.0.2.2";
        }


        let options = this.createRequestOptions();
        return this.http.get("MERAVY6129:51246/api/auction/history/5", { headers: options });
    };

    private createRequestOptions() {
        let headers = new HttpHeaders({
            'token': "xx"
        });


        return headers;
    }
}