import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { Page } from "ui/page";
import * as appSettings from "application-settings";
import {APP_SET_TOKEN} from "~/config";
import {RouterExtensions} from "nativescript-angular";


@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./loginView.html",
    styleUrls: ["./login.css"],
    providers: [ LoginService ]
})
export class LoginComponent implements OnInit{
    public userName = "";
    public passWord = "";

    constructor(private _page: Page, private loginService: LoginService, private routerExtensions: RouterExtensions) {
        if (appSettings.getString(APP_SET_TOKEN)) {
            this.routerExtensions.navigate(["/shipment"], { clearHistory: true });
        }
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    public submit() {
        this.loginService.login(this.userName, this.passWord);
    }
}

