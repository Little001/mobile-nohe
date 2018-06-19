import {LoadingIndicator} from "nativescript-loading-indicator";
import { Injectable } from "@angular/core";


@Injectable()
export class LoaderService {
    private loader = new LoadingIndicator();
    private options;

    constructor() {
        this.options = {
            message: 'Načítání...',
            progress: 0.65,
            android: {
                indeterminate: true,
                cancelable: false,
                cancelListener: function(dialog) { console.log("Loading cancelled") },
                max: 100,
                progressNumberFormat: "%1d/%2d",
                progressPercentFormat: 0.53,
                progressStyle: 1,
                secondaryProgress: 1
            },
            ios: {
                details: "Additional detail note!",
                margin: 10,
                dimBackground: true,
                color: "#4B9ED6", // color of indicator and labels
                // background box around indicator
                // hideBezel will override this if true
                backgroundColor: "yellow",
                userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
                hideBezel: true, // default false, can hide the surrounding bezel
            }
        };
    }

    public show(): void {
        this.loader.show(this.options);
    }
    public hide(): void {
        this.loader.hide();
    }
}