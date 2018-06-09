import { Component } from "@angular/core";
import { requestPermissions as cameraRequestPermissions } from "nativescript-camera";
import { enableLocationRequest } from "nativescript-geolocation";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    constructor() {
        enableLocationRequest().then(()=> {
            cameraRequestPermissions();
        }, (error) => {
            console.log("erorrpermission->" + error);
        })
    }
}
