import { ITime } from "../models/ITime";
import { WatchLightColors } from "../models/WatchLightColors";
import { WatchModes } from "../models/WatchModes";
import { WatchTimeFormats } from "../models/WatchTimeFormats";
import { ControllerActions } from "../models/ControllerActions";
import { WatchView } from "./WatchView";

export class DigitalWatchView extends WatchView {
    
    private timePanelContainer: HTMLElement;
    private hoursContainer: HTMLElement;
    private minutesContainer: HTMLElement;
    private secondsContainer :HTMLElement;
    private modeButton: HTMLElement;
    private modeLabel: HTMLElement;
    private increaseButton: HTMLElement;
    private increaseLabel: HTMLElement;
    private lightButton: HTMLElement;
    private lightLabel: HTMLElement;
    private formatButton: HTMLElement;
    private formatLabel: HTMLElement;
    private resetButton: HTMLElement;
    private resetLabel: HTMLElement;
    protected deleteButton: HTMLElement;

    protected currentColorIndex: number = 0;
    protected currentModeIndex: number = 0;
    protected currentFormatIndex: number = 0;

    constructor(clockID: number, containerID: string, onUserAction: (action: ControllerActions, clockID: number) => void) {
        super(clockID, containerID, onUserAction);
    }

    protected createClockElement(): HTMLElement {
        const clock = document.createElement('div');
        clock.id = `${this.clockID}`;
        this.timePanelContainer = document.createElement('div');
        this.hoursContainer = document.createElement('span');
        this.minutesContainer = document.createElement('span');
        this.secondsContainer = document.createElement('span');
        this.timePanelContainer.className = 'timeContainer';
        this.timePanelContainer.style.backgroundColor = WatchLightColors[this.currentColorIndex];

        this.timePanelContainer.appendChild(this.hoursContainer);
        this.timePanelContainer.appendChild(this.minutesContainer);
        this.timePanelContainer.appendChild(this.secondsContainer);

        clock.className = 'clock';
        clock.appendChild(this.timePanelContainer);

        // Create and append buttons and labels
        this.modeButton = this.createButton('modeButton', this.handleModeButtonClick.bind(this));
        this.increaseButton = this.createButton('increaseButton', this.handleIncreaseButtonClick.bind(this));
        this.lightButton = this.createButton('lightButton', this.handleLightButtonClick.bind(this));
        this.formatButton = this.createButton('formatButton', this.handleFormatButtonClick.bind(this));
        this.resetButton = this.createButton('resetButton', this.handleResetButtonClick.bind(this));
        this.deleteButton = this.createButton('deleteButton', this.handleDeleteClock.bind(this));
        this.deleteButton.innerText = 'DELETE';
        

        // Create labels
        const modeLabel = this.createLabel('Mode', true);
        const increaseLabel = this.createLabel('Increase', false);
        const lightLabel = this.createLabel('Light', true);
        const formatLabel = this.createLabel('AM/PM - 24H', false);
        const resetLabel = this.createLabel('RESET', false);

        // Append button-label containers
        clock.appendChild(this.createButtonLabelContainer(this.modeButton, modeLabel));
        clock.appendChild(this.createButtonLabelContainer(this.increaseButton, increaseLabel));
        clock.appendChild(this.createButtonLabelContainer(this.lightButton, lightLabel));
        clock.appendChild(this.createButtonLabelContainer(this.formatButton, formatLabel));
        clock.appendChild(this.createButtonLabelContainer(this.resetButton, resetLabel));
        clock.appendChild(this.deleteButton);

        return clock;
    }

    public updateTime(time: ITime, colorIndex?: number, modeIndex?: number, formatIndex?: number): void {
        this.currentColorIndex = colorIndex;
        this.currentModeIndex = modeIndex;
        this.currentFormatIndex = formatIndex;
        this.timePanelContainer.style.backgroundColor = WatchLightColors[this.currentColorIndex%2];

        switch(this.currentModeIndex) {
            case WatchModes.noBlinking:
                this.removeBlink(this.minutesContainer);
                break;
            case WatchModes.hoursBlinking:
                this.addBlink(this.hoursContainer);
                break;
            case WatchModes.minutesBlinking:
                this.removeBlink(this.hoursContainer);
                this.addBlink(this.minutesContainer);
                break;
        }

        this.hoursContainer.innerText = `${this.formatUnit(time.hours, true)}:`;
        this.minutesContainer.innerText = `${this.formatUnit(time.minutes)}:`;
        this.secondsContainer.innerText = `${this.formatUnit(time.seconds)} ${this.returnCorrespondingTimeFormat(time.hours)} `;
    }

    private createButton(id: string, onClickHandler: () => void): HTMLElement {
        const button = document.createElement('button');
        button.className = 'clockButton';
        button.id = id;
        button.onclick = onClickHandler;
        return button;
    }

    private createLabel(text: string, isLeftSide: boolean): HTMLElement {
        const label = document.createElement('label');
        label.innerText = text;
        label.className = `buttonLabel ${isLeftSide ? 'leftSide' : 'rightSide'}`;
        return label;
    }

    private createButtonLabelContainer(button: HTMLElement, label: HTMLElement): HTMLElement {
        const container = document.createElement('div');
        container.className = 'clockButtonLabelContainer';
        container.id = `${button.id}Container`;
        container.appendChild(label);
        container.appendChild(button);
        return container;
    }

    private handleModeButtonClick(): void {
        this.onUserAction(ControllerActions.IncrementMode, this.clockID);
    }

    private handleIncreaseButtonClick(): void {
        switch (this.currentModeIndex) {
            case WatchModes.hoursBlinking:
                this.onUserAction(ControllerActions.IncrementHours, this.clockID);
                break;
            case WatchModes.minutesBlinking:
                this.onUserAction(ControllerActions.IncrementMinutes, this.clockID);
                break;
        }
    }

    private handleLightButtonClick(): void {
        this.onUserAction(ControllerActions.IncrementLightColor, this.clockID);
    }

    private handleFormatButtonClick(): void {
        this.onUserAction(ControllerActions.IncrementTimeFormat, this.clockID);
    }

    private handleResetButtonClick(): void {
        this.onUserAction(ControllerActions.ResetTime, this.clockID);
    }

    protected handleDeleteClock(): void {
        this.onUserAction(ControllerActions.DeleteClock, this.clockID);
        this.container.removeChild(this.clockElement);
    }   

    private addBlink(container: HTMLElement): void {
        container.classList.add('blinking');
    }
    private removeBlink(container: HTMLElement): void {
        container.classList.remove('blinking');
    }

    private formatUnit(t: number, isHours?: boolean): string {
        isHours = isHours ?? false;
        switch (this.currentFormatIndex) {
            case WatchTimeFormats.AMPM:
                if (isHours) {
                    const hour = t % 12 === 0 ? 12 : t % 12;
                    return hour < 10 ? `0${hour}` : `${hour}`;
                }
                return t < 10 ? `0${t}` : `${t}`;
            case WatchTimeFormats.MILITARY:
                return t < 10 ? `0${t}` : `${t}`;
            default:
                return `${t}`;
        }
    }
    
    private returnCorrespondingTimeFormat(hours: number): string {
        if(this.currentFormatIndex == WatchTimeFormats.AMPM) {
            if(hours > 11) {
                return 'PM';
            }else {
                return 'AM';
            }
        }
        return '';
    }
}
