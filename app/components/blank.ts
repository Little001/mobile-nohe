import { Component } from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "blank",
    moduleId: module.id,
    template: ""
})

export class BlankComponent {
    constructor(private routerExtensions: RouterExtensions) {
        this.routerExtensions.navigate(["/shipment"], { clearHistory: true });
    }
}
