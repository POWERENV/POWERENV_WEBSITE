import * as pnodeDataDisplayScript from './INFRASTRUCTURE_MONITORING_LOGIC/PNODE/pnode_data_display_script.js'
import * as eventsAndLoggingDataDisplay from './INFRASTRUCTURE_MONITORING_LOGIC/events_and_logging_data_display.js'
import * as hardwareDataDisplay from './INFRASTRUCTURE_MONITORING_LOGIC/hardware_data_display.js'
import * as genericScript from "./scripting.js";

genericScript.switchSection('overview.html', event);

document.getElementById("nav-overview")!.addEventListener('click', (e) => {
    genericScript.switchSection('overview.html', e);
});

document.getElementById("_hardware_link")!.addEventListener('click', (e) => {
    hardwareDataDisplay.openHardwareSection(e);
});

document.getElementById("_events_and_logging_link")!.addEventListener('click', (e) => {
    eventsAndLoggingDataDisplay.openEventsSection(e);
});

document.getElementById("_power_link")!.addEventListener('click', (e) => {
    genericScript.switchSection('power.html', e);
});