import { ITime } from "./ITime";

export class WatchModel {

    private clockID: number;
    public getClockID(): number {
        return this.clockID;
    }
    private date: Date;
    private currentColorIndex: number = 0;
    private currentModeIndex: number = 0;
    private currentHoursAddition: number = 0;
    private currentMinutesAddition: number = 0;
    private currentTimeFormatIndex: number = 0;

    constructor(clockID: number) {
        this.clockID = clockID;
        this.date = new Date();
    }

    public getTime(): ITime {
        this.date = new Date();
        this.date.setHours(this.date.getHours()+this.currentHoursAddition);
        this.date.setMinutes(this.date.getMinutes()+this.currentMinutesAddition);
        return {
            hours: this.date.getHours(),
            minutes: this.date.getMinutes(),
            seconds: this.date.getSeconds()
        }
    }

    public addHour(): void {
        this.currentHoursAddition++;
    }

    public addMinute(): void {
        this.currentMinutesAddition++;
    }

    public getCurrentModeIndex(): number {
        return this.currentModeIndex;
    }

    public incrementCurrentModeIndex(): void {
        this.currentModeIndex = (this.currentModeIndex+1)%3;
    }

    public getCurrentColorIndex(): number {
        return this.currentColorIndex;
    }

    public incrementCurrentColorIndex(): void {
        this.currentColorIndex = (this.currentColorIndex+1)%2;
    }

    public getCurrentTimeFormatIndex(): number {
        return this.currentTimeFormatIndex;
    }

    public incrementCurrentTimeFormatIndex(): void {
        this.currentTimeFormatIndex = (this.currentTimeFormatIndex+1)%2;
    }

    public resetTime(): void {
        this.currentHoursAddition = 0;
        this.currentMinutesAddition = 0;
    }

}