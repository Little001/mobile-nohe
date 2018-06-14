import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import * as imageSourceModule  from "tns-core-modules/image-source";
import { takePicture } from "nativescript-camera";
import {clearWatch, watchLocation} from "nativescript-geolocation";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import {ImageSource } from "tns-core-modules/image-source";
import { Page } from "ui/page";
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
    private watchId: number;
    private source: ImageSource;

    constructor(private _page: Page, private fonticon: TNSFontIconService, private loginService: LoginService,
                private shipmentService: ShipmentService, private routerExtensions: RouterExtensions) {
        this.photos = [];
        this.source = new imageSourceModule.ImageSource();

        this.shipmentService.getCurrentlyShipment().subscribe((shipment: Shipment) => {
            if (shipment) {
                this.startWatchLocation();
                this.duringShipment = true;
                this.shipment = shipment;
                this.id_shipment = shipment.ID.toString();
            } else {
                this.duringShipment = false;
                this.stopWatchLocation();
            }
        }, (error) => {
            alert(error);
        });
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    private startWatchLocation() {
        this.watchId = watchLocation(
            function (loc) {
                if (loc) {
                    let route = loc.latitude + "," + loc.longitude;

                    this.shipmentService.postGps(this.shipment.ID.toString(), route).subscribe(() => {
                    }, (error) => {
                    });
                }
            },
            function(e){
                console.log("Error: " + e.message);
            },
            {desiredAccuracy: 3, updateDistance: 10, minimumUpdateTime : 1000 * 3}); // Should update every 20 seconds according to Googe documentation. Not verified.
    }


    private stopWatchLocation() {
        if (this.watchId) {
            clearWatch(this.watchId);
        }
    }

    public resolveShipment(): void {
        if (!this.inputsAreValid()) {
            return;
        }
        let photosInBase64 = [];
        for (let i = 0; i < this.photos.length; i++) {
            photosInBase64.push(this.photos[i].source.toBase64String("jpg"));
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
}
