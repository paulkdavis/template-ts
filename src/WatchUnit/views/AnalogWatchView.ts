import { ITime } from "../models/ITime";
import { ControllerActions } from "../models/ControllerActions";
import { WatchView } from "./WatchView";
import { Matrix } from "../utilities/Matrix";

export class AnalogWatchView extends WatchView {
    
    protected updateClockTime(time: ITime): void {
        throw new Error("Method not implemented.");
    }
    protected clockID: number;
    public getClockID(): number {
        return this.clockID;
    }
    protected onUserAction: (action: ControllerActions, clockID: number) => void;
    protected container: HTMLElement;

    protected clockElement: HTMLElement;

    private hourHandle: HTMLElement;
    private minuteHandle: HTMLElement;
    private secondHandle: HTMLElement;
    
    protected deleteButton: HTMLElement;

    constructor(clockID: number, containerID: string, onUserAction: (action: ControllerActions, clockID: number) => void) {
        super(clockID, containerID, onUserAction);
    }

    private createHandle(type: string): HTMLElement {
        const handle = document.createElement('div');
        handle.classList.add(`${type}-handle`);
        this.container.appendChild(handle);
        return handle;
    }

    public updateTime(time: ITime, colorIndex?: number, modeIndex?: number, formatIndex?: number) {
        this.updateHandles(time);
    }

    private updateHandles(time: ITime): void {
        const hours = time.hours % 12;
        const minutes = time.minutes;
        const seconds = time.seconds;

        const hourAngle = (hours + minutes / 60) * (Math.PI / 6) + Math.PI / 2;
        const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) + Math.PI / 2;
        const secondAngle = seconds * (Math.PI / 30) + Math.PI / 2; 

        this.setHandleTransform(this.hourHandle, hourAngle);
        this.setHandleTransform(this.minuteHandle, minuteAngle);
        this.setHandleTransform(this.secondHandle, secondAngle);
    }

    private setHandleTransform(handle: HTMLElement, angle: number) {
        const handleHeight = handle.offsetHeight;
        const centerY = handleHeight / 2;

        //Rotate around the center of the handle
        const rotationMatrix = Matrix.rotate(angle);
        const translationMatrix = Matrix.translate(0, -centerY);
        const reverseTranslationMatrix = Matrix.translate(0, centerY);

        //Combine the matrices: translate to origin, rotate, then translate back
        const transformationMatrix = Matrix.multiply(
            reverseTranslationMatrix,
            Matrix.multiply(rotationMatrix, translationMatrix)
        );

        handle.style.transform = `matrix(${transformationMatrix[0][0]}, ${transformationMatrix[1][0]}, ${transformationMatrix[0][1]}, ${transformationMatrix[1][1]}, ${transformationMatrix[0][2]}, ${transformationMatrix[1][2]})`;
    }
    

    protected createClockElement(): HTMLElement {
        const clock = document.createElement('div');    
        clock.id = `${this.clockID}`;          


        clock.className = 'clock';
        //clock.appendChild(this.timePanelContainer); //THIS WILL BE CLOCK FACE

        this.hourHandle = this.createHandle('hour');
        this.minuteHandle = this.createHandle('minute');
        this.secondHandle = this.createHandle('second');

        const handleContainer = document.createElement('div');
        handleContainer.className = 'handle-container';

        //Create buttons
        this.deleteButton = this.createButton('deleteButton', this.handleDeleteClock.bind(this));
        this.deleteButton.innerText = 'DELETE';

        //Create and append containers
        handleContainer.appendChild(this.hourHandle);
        handleContainer.appendChild(this.minuteHandle);
        handleContainer.appendChild(this.secondHandle);
        clock.appendChild(handleContainer);
        clock.appendChild(this.deleteButton);

        return clock;
    }

    private createButton(id: string, onClickHandler: () => void): HTMLElement {
        const button = document.createElement('button');
        button.className = 'clockButton';
        button.id = id;
        button.onclick = onClickHandler;
        
        return button;
    }


    protected handleDeleteClock(): void {
        this.onUserAction(ControllerActions.DeleteClock, this.clockID);
        this.container.removeChild(this.clockElement);
    }

 
}
