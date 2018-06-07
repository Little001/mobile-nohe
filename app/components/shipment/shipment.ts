import {Component} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import * as imageSourceModule  from "tns-core-modules/image-source";
import { ImageAsset } from "image-asset";
import { takePicture, requestPermissions, isAvailable } from "nativescript-camera";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import {ImageSource} from "tns-core-modules/image-source";

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

export class ShipmentComponent {
    public id_shipment = "";
    public code = "";
    public duringShipment = false;
    public shipment: Shipment;
    private source: ImageSource;
    private photosInBase64: string[];

    constructor(private fonticon: TNSFontIconService, private shipmentService: ShipmentService, private routerExtensions: RouterExtensions) {
        this.photosInBase64 = [];
        this.source = new imageSourceModule.ImageSource();
        this.shipmentService.getCurrentlyShipment().subscribe((shipment: Shipment) => {
            if (shipment) {
                this.duringShipment = true;
                this.shipment = shipment;
                this.id_shipment = shipment.ID.toString();
                // show icon (during shipment)
            } else {
                this.duringShipment = false;
                // can start shipment
            }
        }, (error) => {
            alert(error);
        });
    }

    // >> camera-module-photo-code
    public imagesTaken: Array<ImageAsset> = [];
    public saveToGallery: boolean = true;
    public keepAspectRatio: boolean = true;
    public width: number = 300;
    public height: number = 300;
    public heightList: number = 0;


    public resolveShipment(): void {
        if (!this.inputsAreValid()) {
            return;
        }

        this.shipmentService.postCode(this.id_shipment, this.code, this.photosInBase64);
    }

    public deletePhoto(index: number): void {
        this.imagesTaken.splice(index, 1);
    }

    private inputsAreValid(): boolean {
        if (this.imagesTaken.length !== 4 || this.photosInBase64.length !== 4) {
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

    onTakePhoto() {
        let options = {
            width: this.width,
            height: this.height,
            keepAspectRatio: this.keepAspectRatio,
            saveToGallery: this.saveToGallery
        };

        takePicture(options)
            .then(imageAsset => {
                this.imagesTaken.push(imageAsset);
                this.heightList = imageAsset.options.height * this.imagesTaken.length;
                this.source.fromAsset(imageAsset).then((imageSource) => {
                    this.photosInBase64.push(imageSource.toBase64String("jpg"));
                });
            }).catch(err => {
            console.log(err.message);
        });
    }
    // << camera-module-photo-code
    // >> camera-module-perm-code
    onRequestPermissions() {
        requestPermissions();
    }
    // << camera-module-perm-code
    // >> camera-module-avai-code
    onCheckForCamera() {
        let isCameraAvailable = isAvailable();
        console.log("Is camera hardware available: " + isCameraAvailable);
    }
    // << camera-module-avai-code
}
