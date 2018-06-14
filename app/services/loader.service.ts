import {LoadingIndicator} from "nativescript-loading-indicator";
import { Injectable } from "@angular/core";


@Injectable()
export class LoaderService {
    private loader = new LoadingIndicator();
    private options;

    constructor() {
        this.options = {
            message: 'Loading...',
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