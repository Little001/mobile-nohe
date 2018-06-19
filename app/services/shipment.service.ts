import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_URL, getAuthorizedHeaders} from "~/config";
import {RouterExtensions} from "nativescript-angular";
import {LoaderService} from "~/services/loader.service";

@Injectable()
export class ShipmentService {
    constructor(private http: HttpClient, private routerExtensions: RouterExtensions, @Inject(LoaderService) private loader) { }

    public postCode(id_shipment: string, code: string, photos: string[]) {
        let body = new HttpParams();

        body = body.set('id_shipment', id_shipment);
        body = body.set('code', code);
        photos.forEach(photo => {
            body = body.append('photos[]', photo);
        });

        return this.http.post(API_URL + "shipment/code", body, {headers: getAuthorizedHeaders()});
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