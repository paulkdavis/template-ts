import './index.css';
import { MyClass } from './example-unit';
var a = new MyClass(2);
console.log('number is', a.get());
document.addEventListener("DOMContentLoaded", function () {
    var containerId = "clockContainer";
    var model = new ClockModel();
    var view = new ClockView(containerId);
    var controller = new ClockController(model, view);
});
