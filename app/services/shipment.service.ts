import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URL, getAuthorizedHeaders} from "~/config";
import {ShipmentComponent} from "~/components/shipment/shipment";
import {RouterExtensions} from "nativescript-angular";

@Injectable()
export class ShipmentService {
    constructor(private http: HttpClient, private routerExtensions: RouterExtensions) { }

    public postCode(id_shipment: string, code: string, photos: string[]): void {
        let body = new HttpParams();

        body = body.set('id_shipment', id_shipment);
        body = body.set('code', code);
        photos.forEach(photo => {
            body = body.append('photos[]', photo);
        });

        this.http.post(API_URL + "shipment/code", body, {headers: getAuthorizedHeaders()}).subscribe((data) => {
            ShipmentComponent.removeUnUsedAppSettings();
            this.routerExtensions.navigate(["/blank"], {clearHistory: true});
            alert("Shipment was changed");
        }, (error) => {
            alert("Shipment wrong inputs");
        });
    }

    public getCurrentlyShipment() {
        return this.http.get(API_URL + "shipment/currently", {headers: getAuthorizedHeaders()});
    }

    public postGps(id_shipment: string, route: string) {
        let body = new HttpParams();

        body = body.set('id_shipment', id_shipment);
        body = body.set('route', route);

        return this.http.post(API_URL + "shipment/route", body, {headers: getAuthorizedHeaders()});
    }
}