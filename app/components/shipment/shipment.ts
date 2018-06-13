import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import * as imageSourceModule  from "tns-core-modules/image-source";
import { takePicture } from "nativescript-camera";
import { getCurrentLocation, isEnabled } from "nativescript-geolocation";
import * as appSettings from "application-settings";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import {ImageSource } from "tns-core-modules/image-source";
import { Page } from "ui/page";
import { APP_SET_GPS_ACTIVE, APP_SET_GPS_ROUTE, SEND_GPS_IN_MILISECONDS } from "../../config";
import {Accuracy} from "tns-core-modules/ui/enums";
import {LoginService} from "~/services/login.service";
import {Photo} from "~/components/shipment/photo";

interface Shipment {
    ID: number,
    from: string;
    to: string;
    price: number
}

@Component({
    selector: "shipment",
    moduleId: module.id,
    templateUrl: "./shipment.html",
    styleUrls: ["./shipment.css"],
    providers: [ ShipmentService, LoginService ]
})

export class ShipmentComponent implements OnInit {
    public id_shipment = "";
    public code = "";
    public canTakePhoto = true;
    public duringShipment = false;
    public photos: Array<Photo> = [];
    private idPhoto: number = 0;
    public widthPhoto: number = 300;
    public heightPhoto: number = 300;
    public shipment: Shipment;
    private source: ImageSource;

    constructor(private _page: Page, private fonticon: TNSFontIconService, private loginService: LoginService,
                private shipmentService: ShipmentService, private routerExtensions: RouterExtensions) {
        this.photos = [];
        this.source = new imageSourceModule.ImageSource();

        this.shipmentService.getCurrentlyShipment().subscribe((shipment: Shipment) => {
            if (shipment) {
                ShipmentComponent.stopGps(() => {
                    this.startGps();
                });
                this.duringShipment = true;
                this.shipment = shipment;
                this.id_shipment = shipment.ID.toString();
            } else {
                this.duringShipment = false;
                ShipmentComponent.stopGps();
            }
        }, (error) => {
            alert(error);
        });
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    private startGps() {
        if (!appSettings.getString(APP_SET_GPS_ACTIVE)) {
            this.stalking();
            appSettings.setString(APP_SET_GPS_ACTIVE, "active");
        }
    }

    private stalking() {
        let interval = setInterval(() =>{
            isEnabled().then(() => {
                getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 500 }).then((value) => {
                    let appRoute = appSettings.getString(APP_SET_GPS_ROUTE);
                    let routeFromAppSettings = appRoute ? appRoute + "|" : "";
                    let route = routeFromAppSettings + value.latitude + "," + value.longitude;

                    this.shipmentService.postGps(this.shipment.ID.toString(), route).subscribe(() => {
                        appSettings.setString(APP_SET_GPS_ROUTE, "");
                    }, (error) => {
                        let appRoute = appSettings.getString(APP_SET_GPS_ROUTE);
                        appSettings.setString(APP_SET_GPS_ROUTE, appRoute + "|" + route);
                        console.log("fail postGps -> " + error);
                    });
                }, (error) => {
                    console.log("get current location -> " + error);
                });
            });

            if (!appSettings.getString(APP_SET_GPS_ACTIVE)) {
                clearInterval(interval);
            }
        }, SEND_GPS_IN_MILISECONDS);
    }

    private static stopGps(afterStopGpsCallback?: () => void) {
        appSettings.remove(APP_SET_GPS_ACTIVE);
        setTimeout(() => {
            if (afterStopGpsCallback) {
                afterStopGpsCallback();
            }
        }, SEND_GPS_IN_MILISECONDS + 500);
    }

    public resolveShipment(): void {
        if (!this.inputsAreValid()) {
            return;
        }
        let photosInBase64 = [];
        for (let i = 0; i < this.photos.length; i++) {
            photosInBase64.push(this.photos[i].inBase64);
        }
        this.shipmentService.postCode(this.id_shipment, this.code, photosInBase64);
    }

    public deletePhoto(id: number): void {
        this.photos = this.photos.filter(photo => photo.ID !== id);
    }

    public logout() {
        this.loginService.logout();
    }

    onTakePhoto() {
        let options = {
            width: this.widthPhoto,
            height: this.heightPhoto,
            keepAspectRatio: true,
            saveToGallery: false
        };

        takePicture(options)
            .then(imageAsset => {
                this.source.fromAsset(imageAsset).then((imageSource) => {
                    let photo = new Photo();
                    photo.ID = this.idPhoto;
                    photo.source = imageSource;
                    photo.inBase64 = imageSource.toBase64String("jpg");
                    this.idPhoto++;
                    this.photos.push(photo);
                    this.afterChangePhotos();
                });
            }).catch(err => {
            console.log(err.message);
        });
    }

    private inputsAreValid(): boolean {
        if (this.photos.length < 1) {
            alert("You need min 1 photo");
            return false;
        }
        if (!this.id_shipment) {
            alert("ID Shipment is required");
            return false;
        }
        if (!this.code) {
            alert("Code is required");
            return false;
        }
        return true;
    }

    private afterChangePhotos() {
        this.canTakePhoto = this.photos.length < 4;
    }

    public static removeUnUsedAppSettings() {
        appSettings.remove(APP_SET_GPS_ROUTE);
    }
}
