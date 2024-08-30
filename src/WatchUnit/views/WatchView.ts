import { ITime } from "../models/ITime";
import { ControllerActions } from "../models/ControllerActions";

export class WatchView {
    protected clockID: number;
    protected container: HTMLElement;
    protected clockElement: HTMLElement;
    protected deleteButton: HTMLElement;
    protected currentColorIndex?: number = 0;
    protected currentModeIndex?: number = 0;
    protected currentFormatIndex?: number = 0;
    protected onUserAction: (action: ControllerActions, clockID: number) => void;

    constructor(clockID: number, containerID: string, onUserAction: (action: ControllerActions, clockID: number) => void) {
        this.onUserAction = onUserAction;
        this.clockID = clockID;

        this.container = document.getElementById(containerID);
        if(!this.container) throw new Error(`Container with id "${containerID}" not found`);

        this.clockElement = this.createClockElement();
        this.container.appendChild(this.clockElement);
    }

    public updateTime(time: ITime, colorIndex?: number, modeIndex?: number, formatIndex?: number) {
        this.currentColorIndex = colorIndex;
        this.currentModeIndex = modeIndex;
        this.currentFormatIndex = formatIndex;
        //this.updateClockTime(time);
        //this.updateClockAppearance();
    }

    protected updateClockAppearance(): void {
        //Update color
        //Update mode
    }

    protected createClockElement(): HTMLElement {
        const clock = document.createElement('div');    
        clock.id = `${this.clockID}`;          

        clock.className = 'clock';

        this.deleteButton.innerText = 'DELETE';

        clock.appendChild(this.deleteButton);

        return clock;
    }

    protected handleDeleteClock(): void {
        this.onUserAction(ControllerActions.DeleteClock, this.clockID);
        this.container.removeChild(this.clockElement);
    }

}
