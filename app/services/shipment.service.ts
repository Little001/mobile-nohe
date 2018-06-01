import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RouterExtensions} from "nativescript-angular";
import {platformNames} from "platform";
import {device} from "platform";
import {API_URL, getAuthorizedHeaders} from "~/config";

@Injectable()
export class ShipmentService {
    constructor(private http: HttpClient, private routerExtensions: RouterExtensions) { }

    public startShipment(id_shipment: string, code: string) {
        let body = new HttpParams();
        let nativePlatformLocalhost;

        body = body.set('id_shipment', id_shipment);
        body = body.set('code', code);

        /*in some function or globally*/
        if(device.os === platformNames.ios){
            /*localhost for ios*/
            nativePlatformLocalhost= "localhost";
        }
        else if(device.os === platformNames.android){
            /*localhost for android*/
            nativePlatformLocalhost= "10.0.2.2";
        }


        this.http.post(API_URL + "shipment/code", body, { headers: getAuthorizedHeaders() }).subscribe(() => {
            this.routerExtensions.navigate(["/photo"]);
        }, () => {
            this.routerExtensions.navigate(["/shipment"]);
        });
    };
}