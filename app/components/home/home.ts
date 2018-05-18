import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "./homeView.html",
})
export class HomeComponent implements OnInit {
    private ids = 5;

    constructor(private routerExtensions: RouterExtensions) {
    }

    ngOnInit(): void {
        this.ids = 78;
    }
    public onTap() {
        this.routerExtensions.navigate(["/login"]);
    }
}
