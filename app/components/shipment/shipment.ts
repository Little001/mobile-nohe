import {Component, OnDestroy, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import * as imageSourceModule  from "tns-core-modules/image-source";
import { takePicture } from "nativescript-camera";
import { getCurrentLocation, isEnabled } from "nativescript-geolocation";
import * as appSettings from "application-settings";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import {ImageSource, fromBase64} from "tns-core-modules/image-source";
import {
    APP_SET_GPS_ACTIVE, APP_SET_PHOTO_1, APP_SET_PHOTO_2, APP_SET_PHOTO_3, APP_SET_PHOTO_4,
    SEND_GPS_IN_MILISECONDS
} from "../../config";
import {Accuracy} from "tns-core-modules/ui/enums";

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
    providers: [ ShipmentService ]
})

export class ShipmentComponent implements OnInit, OnDestroy {
    public id_shipment = "";
    public code = "";
    public canTakePhoto = true;
    public duringShipment = false;
    public renderedImages: Array<ImageSource> = [];
    public heightList: number = 0;
    public widthPhoto: number = 300;
    public heightPhoto: number = 300;
    public shipment: Shipment;
    private source: ImageSource;
    private photosInBase64: string[];

    constructor(private fonticon: TNSFontIconService,
                private shipmentService: ShipmentService, private routerExtensions: RouterExtensions) {
        this.photosInBase64 = [];
        this.renderedImages = [];
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
        this.photosInBase64 = [];
        this.setPhotosFromAppSettings();

        for (let i = 0; i < this.photosInBase64.length; i++) {
            let file = fromBase64(this.photosInBase64[i]);
            this.renderedImages.push(file);
        }
        this.afterChangePhotos();
    }

    ngOnDestroy() {
        ShipmentComponent.removePhotosFromAppSettings();
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
                    let route = value.latitude + "," + value.longitude;
                    this.shipmentService.postGps(this.shipment.ID.toString(), route);
                    console.log(route);
                }, (error) => {
                    console.log("erorLocation->" + error);
                });
            }, function (e) {
                console.log("Error: " + (e.message || e));
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

        this.shipmentService.postCode(this.id_shipment, this.code, this.photosInBase64);
    }

    public deletePhoto(index: number): void {
        this.renderedImages.splice(index, 1);
        this.photosInBase64.splice(index, 1);
        ShipmentComponent.removePhotosFromAppSettings();
        this.refreshAppSettings();
        this.afterChangePhotos();
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
                    let imageInBase64 = imageSource.toBase64String("jpg");
                    this.photosInBase64.push(imageInBase64);
                    this.renderedImages.push(imageSource);
                    this.afterChangePhotos();
                    this.refreshAppSettings();
                });
            }).catch(err => {
            console.log(err.message);
        });
    }

    private inputsAreValid(): boolean {
        if (this.renderedImages.length !== 4 || this.photosInBase64.length !== 4) {
            alert("You need 4 photos");
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
        this.heightList = this.heightPhoto * this.renderedImages.length;
        this.canTakePhoto = this.renderedImages.length < 4;
    }

    private setPhotosFromAppSettings() {
        if (appSettings.getString(APP_SET_PHOTO_1)) {
            this.photosInBase64.push(appSettings.getString(APP_SET_PHOTO_1));
        }
        if (appSettings.getString(APP_SET_PHOTO_2)) {
            this.photosInBase64.push(appSettings.getString(APP_SET_PHOTO_2));
        }
        if (appSettings.getString(APP_SET_PHOTO_3)) {
            this.photosInBase64.push(appSettings.getString(APP_SET_PHOTO_3));
        }
        if (appSettings.getString(APP_SET_PHOTO_4)) {
            this.photosInBase64.push(appSettings.getString(APP_SET_PHOTO_4));
        }
    }

    private refreshAppSettings() {
        if (this.photosInBase64[0]) {
            appSettings.setString(APP_SET_PHOTO_1, this.photosInBase64[0]);
        }
        if (this.photosInBase64[1]) {
            appSettings.setString(APP_SET_PHOTO_2, this.photosInBase64[1]);
        }
        if (this.photosInBase64[2]) {
            appSettings.setString(APP_SET_PHOTO_3, this.photosInBase64[2]);
        }
        if (this.photosInBase64[3]) {
            appSettings.setString(APP_SET_PHOTO_4, this.photosInBase64[3]);
        }
    }

    public static removePhotosFromAppSettings() {
        appSettings.remove(APP_SET_PHOTO_1);
        appSettings.remove(APP_SET_PHOTO_2);
        appSettings.remove(APP_SET_PHOTO_3);
        appSettings.remove(APP_SET_PHOTO_4);
    }
}
