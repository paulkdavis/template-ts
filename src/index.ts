import './index.css';
import { MyClass } from './example-unit';
import { WatchModel, WatchView, DigitalWatchView, AnalogWatchView, WatchController } from './WatchUnit';

const a = new MyClass(2);
console.log('number is', a.get());

let isDigital: boolean = true;
let isUIselectionModalVisible: boolean = false;

document.addEventListener("DOMContentLoaded", () => {
    const containerId = "clockContainer";

    const model = new WatchModel(0);
    const controller = new WatchController(model, null);
    const view = new DigitalWatchView(0, containerId, controller.getUserActionHandler());
    controller.setView(view);

    const waitForClockTypeSelection = (): Promise<boolean> => {
        return new Promise((resolve) => {
            let digitalButton = document.getElementById('digital');
            let analogButton = document.getElementById('analog');

            if(digitalButton && analogButton) {
                digitalButton.addEventListener('click', () => resolve(true));
                analogButton.addEventListener('click', () => resolve(false));
            }
        });
    };

     //To add a new clock.
     const handleAddClock = async (): Promise<void> => {
        isUIselectionModalVisible = true;

        const uiSelectionModal = document.getElementById('uiSelectionModal');
        if (uiSelectionModal) {
            uiSelectionModal.style.display = 'block'; // Show the modal
        }

        //Wait for user to select clock type
        isDigital = await waitForClockTypeSelection();

        //Hide the modal after selection
        if (uiSelectionModal) {
            uiSelectionModal.style.display = 'none';
        }

        const model = new WatchModel(controller.getWatchCount() + 1);
        const view = isDigital
            ? new DigitalWatchView(controller.getWatchCount() + 1, containerId, controller.getUserActionHandler())
            : new AnalogWatchView(controller.getWatchCount() + 1, containerId, controller.getUserActionHandler());
        controller.addWatch(view, model);

    };

    let addButton = document.getElementById('addClockButton');
    if(!addButton) {
        addButton = document.createElement('button');
        addButton.id = 'addClockButton';
        addButton.textContent = 'Add Watch';
        document.body.appendChild(addButton);
    }
    addButton.addEventListener('click', handleAddClock);

    let uiSelectionModal = document.getElementById('uiSelectionModal');
    let flexContainer = document.getElementsByClassName('selectionModal-buttons-container')[0];
    let digitalButton = document.createElement('button');
    let analogButton = document.createElement('button');
    if (!uiSelectionModal || !digitalButton || !analogButton || !flexContainer) {
        uiSelectionModal = document.createElement('div');
        uiSelectionModal.id = 'uiSelectionModal';
        uiSelectionModal.style.display = 'none';

        digitalButton.id = 'digital';
        digitalButton.textContent = 'Digital Clock';
        analogButton.id = 'analog';
        analogButton.textContent = 'Analog Clock';

        flexContainer = document.createElement('div');
        flexContainer.className = 'selectionModal-buttons-container'

        flexContainer.appendChild(digitalButton);
        flexContainer.appendChild(analogButton);

        uiSelectionModal.appendChild(flexContainer);

        document.body.appendChild(uiSelectionModal);
    }

});
