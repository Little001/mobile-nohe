import {Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import { ShipmentService } from "../../services/shipment.service";
import * as imageSourceModule  from "tns-core-modules/image-source";
import { takePicture } from "nativescript-camera";
import { getCurrentLocation } from "nativescript-geolocation";
import { TNSFontIconService } from 'nativescript-ng2-fonticon';
import {ImageSource } from "tns-core-modules/image-source";
import { Page } from "ui/page";
import {LoginService} from "~/services/login.service";
import {Photo} from "~/components/shipment/photo";
import * as dialogs from "ui/dialogs";
import * as appSettings from "application-settings";
import {LoaderService} from "~/services/loader.service";
import {APP_SET_GPS_ACTIVE, GPS_DELAY_IN_MILISECONDS} from "~/config";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {User} from "~/models/User";

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
    providers: [ ShipmentService, LoaderService ]
})

export class ShipmentComponent implements OnInit, AfterViewInit {
    public page_label = "";
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
    private user: User;

    constructor(private _page: Page, private fonticon: TNSFontIconService, private loginService: LoginService,
                private shipmentService: ShipmentService, private routerExtensions: RouterExtensions, private loader: LoaderService,
                private _changeDetectionRef: ChangeDetectorRef) {
        this.user = this.loginService.getUser();
        this.photos = [];
        this.source = new imageSourceModule.ImageSource();
        this.page_label = "Žádná jízda neprobíha...";
        ShipmentComponent.stopWatchLocation();
        this.loader.show();
        this.shipmentService.getCurrentlyShipment().subscribe((shipment: Shipment) => {
            if (shipment) {
                this.page_label = "Právě probíhá jízda...";
                this.duringShipment = true;
                this.shipment = shipment;
                this.id_shipment = shipment.ID.toString();
                this.startWatchLocation();
            } else {
                this.duringShipment = false;
            }
            this.loader.hide();
        }, (error) => {
            this.loader.hide();
            this.routerExtensions.navigate(["/blank"], {clearHistory: true});
        });
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }

    private gettingLocation() {
        let interval = setInterval(() => {
            if (!appSettings.getString(APP_SET_GPS_ACTIVE)) {
                clearInterval(interval);
                return;
            }
            getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).
            then((loc) => {
                let route = loc.latitude + "," + loc.longitude;
                console.log(route);
                this.shipmentService.postGps(this.shipment.ID.toString(), route).subscribe(() => {
                }, (error) => {
                    console.log(error);
                });
            }, (e) => {
                console.log("Error watch location: " + e.message);
            });
        }, GPS_DELAY_IN_MILISECONDS);
    }

    private static stopWatchLocation() {
        appSettings.remove(APP_SET_GPS_ACTIVE);
    }

    private startWatchLocation() {
        ShipmentComponent.stopWatchLocation();
        setTimeout(() => {
            appSettings.setString(APP_SET_GPS_ACTIVE, "active");
            this.gettingLocation();
        }, GPS_DELAY_IN_MILISECONDS + 1000);

    }

    public onPhotoContextMenu(index: number) {
        dialogs.confirm({
            title: "Chcete smazat tuto fotku?",
            okButtonText: "Ano",
            cancelButtonText: "Ne"
        }).then(result => {
            if (result) {
                this.deletePhoto(index);
            }
        });
    }

    public aboutCompanyDialog(): void {
        this.onCloseDrawerTap();
        dialogs.confirm({
            title: "O aplikaci",
            message: "Aplikace je určena jako doplněk pro řidiče pro system NOHE.\n Řidiči, kteří vlastní tuto aplikaci by se měli posrat.",
            okButtonText: "Ok",
        }).then(result => {});
    }

    public useApplicationDialog(): void {
        this.onCloseDrawerTap();
        dialogs.confirm({
            title: "Použití aplikace",
            message: "Aplikace se po přihlášení může dostat do dvou stavů. Buď do stavu kdy řidič začne jízdu nebo kdy již danou jízdu jede.",
            okButtonText: "Ok",
        }).then(result => {});
    }

    public resolveShipment(): void {
        if (!this.inputsAreValid()) {
            return;
        }
        this.loader.show();
        let photosInBase64 = [];
        for (let i = 0; i < this.photos.length; i++) {
            photosInBase64.push(this.photos[i].base64);
        }

        this.shipmentService.postCode(this.id_shipment, this.code, photosInBase64).subscribe((data) => {
            ShipmentComponent.stopWatchLocation();
            this.loader.hide();
            this.routerExtensions.navigate(["/blank"], {clearHistory: true});
            this.changeStateDialog("")
        }, (error) => {
            this.loader.hide();
            this.invalidInputs("Zkontrolujte si zda:\n-číslo zásilky souhlasí se zadaným kódem\n-zadaný kód je určen pro odstartování nebo pro ukončení zásilky");
        });
    }

    private deletePhoto(id: number): void {
        this.photos = this.photos.filter(photo => photo.ID !== id);
        this.afterChangePhotos();
    }

    public logout() {
        this.onCloseDrawerTap();
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
                    photo.base64= imageSource.toBase64String("jpg");
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
            this.invalidInputs("Minimální počet fotek je 1");
            return false;
        }
        if (!this.id_shipment) {
            this.invalidInputs("Musíte zadat číslo jízdy");
            return false;
        }
        if (!this.code) {
            this.invalidInputs("Musíte zadat kód");
            return false;
        }
        return true;
    }

    private afterChangePhotos() {
        this.canTakePhoto = this.photos.length < 6;
    }

    private invalidInputs(message: string): void {
        dialogs.alert({
            title: "Nesprávně zadané údaje",
            message: message
        }).then(() => {
        });
    }

    private changeStateDialog(message: string): void {
        dialogs.alert({
            title: "Změna stavu jízdy",
            message: message
        }).then(() => {
        });
    }
}
