import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { Page } from "ui/page";


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

    constructor(private _page: Page, private loginService: LoginService) {
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    public submit() {
        this.loginService.login(this.userName, this.passWord);
    }
}

