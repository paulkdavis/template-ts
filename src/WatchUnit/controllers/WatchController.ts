import { WatchModel } from "../models/WatchModel";
import { WatchView } from "../views/WatchView";

import { ControllerActions } from "../models/ControllerActions";

export class WatchController {

    private models: WatchModel[];
    private views: WatchView[] | null;

    private onUserAction: (action: ControllerActions) => void;

    private runningWatchCount: number = 0;

    constructor(model: WatchModel, view: WatchView | null = null) {
        this.models = [];
        this.views = [];

        this.models.push(model);
        //this.views.push(view);

        this.onUserAction = this.handleUserInput.bind(this);
    }

    public setView(view: WatchView): void {
        this.views.push(view);
        //Start the clock once the view has been set.
        this.startWatch();
    }

    public addWatch(view: WatchView, model: WatchModel): void {
        this.models.push(model);
        this.views.push(view);
        this.runningWatchCount++;
    }

    public getWatchCount(): number {
        return this.runningWatchCount;
    }

    private removeWatch(clockID: number): void {
       this.models[clockID] = null;
       this.views[clockID] = null;
    }

    private startWatch(): void {
        this.updateView();
        setInterval(() => this.updateView(), 1000)
    }

    private updateView(): void {
        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[i];
            const view = this.views[i];
    
            const time = model.getTime();
            const color = model.getCurrentColorIndex();
            const mode = model.getCurrentModeIndex();
            const format = model.getCurrentTimeFormatIndex();
    
            view.updateTime(time, color, mode, format);
        }
    }

    public handleUserInput(action: ControllerActions, clockID: number): void {
        switch(action) {
            case ControllerActions.IncrementLightColor:
                this.models[clockID].incrementCurrentColorIndex();
                break;
            case ControllerActions.IncrementMode:
                this.models[clockID].incrementCurrentModeIndex();
                break;
            case ControllerActions.IncrementHours:
                this.models[clockID].addHour();
                break;
            case ControllerActions.IncrementMinutes:
                this.models[clockID].addMinute();
                break;
            case ControllerActions.IncrementTimeFormat:
                this.models[clockID].incrementCurrentTimeFormatIndex();
                break;
            case ControllerActions.ResetTime:
                this.models[clockID].resetTime();
                break;
            case ControllerActions.DeleteClock:
                this.removeWatch(clockID);
                break;
        }
        this.updateView();
    }

    public getUserActionHandler(): (action: ControllerActions) => void {
        return this.onUserAction;
    }


}