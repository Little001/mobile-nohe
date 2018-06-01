import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import { ImageAsset } from "image-asset";
import { takePicture, requestPermissions, isAvailable } from "nativescript-camera";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';


@Component({
    selector: "shipment",
    moduleId: module.id,
    templateUrl: "./shipment.html",
    providers: [ ShipmentService ]
})
export class ShipmentComponent {
    public id_shipment = "";
    public code = "";

    constructor(private fonticon: TNSFontIconService, private shipmentService: ShipmentService, private routerExtensions: RouterExtensions) {
    }

    public startShipment(): void {
        this.shipmentService.startShipment(this.id_shipment, this.code)
    }

    // >> camera-module-photo-code
    public imagesTaken: Array<ImageAsset> = [];
    public saveToGallery: boolean = true;
    public keepAspectRatio: boolean = true;
    public width: number = 300;
    public height: number = 300;
    public heightList: number = 0;

    public deletePhoto(index: number): void {
        this.imagesTaken.splice(index, 1);
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
                console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
                console.log(this.heightList);

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
