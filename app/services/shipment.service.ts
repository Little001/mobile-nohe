import { Injectable } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URL, getAuthorizedHeaders} from "~/config";

@Injectable()
export class ShipmentService {
    constructor(private http: HttpClient) { }

    public postCode(id_shipment: string, code: string, photos: string[]): void {
        let body = new HttpParams();

        body = body.set('id_shipment', id_shipment);
        body = body.set('code', code);
        photos.forEach(photo => {
            body = body.append('photos[]', photo);
        });

        this.http.post(API_URL + "shipment/code", body, {headers: getAuthorizedHeaders()}).subscribe((data) => {
            alert(JSON.stringify(data));
        }, (error) => {
            alert(JSON.stringify(error));
        });
    }

    public getCurrentlyShipment() {
        return this.http.get(API_URL + "shipment/currently", {headers: getAuthorizedHeaders()});
    }
}