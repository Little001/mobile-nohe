import {Component, OnInit} from "@angular/core";
import { LoginService } from "../../services/login.service";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./homeView.html",
    providers: [ LoginService ]
})
export class HomeComponent implements OnInit {

    constructor(private loginService: LoginService, private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
    }
    public logout() {
        this.loginService.logout();
    }

    public shipment() {
        this.routerExtensions.navigate(["/shipment"]);
    }
}
