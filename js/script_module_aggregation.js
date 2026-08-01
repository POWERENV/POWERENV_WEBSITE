import * as pnodeDataDisplayScript from './DATA_RETRIEVAL/PNODE/pnode_data_display_script.js'
import * as eventsAndLoggingDataDisplay from './DATA_RETRIEVAL/events_and_logging_data_display.js'
import * as hardwareDataDisplay from './DATA_RETRIEVAL/hardware_data_display.js'

switchSection('overview.html', event);

document.getElementById("nav-overview").addEventListener('click', (e) => {
    switchSection('overview.html', e);
});

document.getElementById("_hardware_link").addEventListener('click', (e) => {
    hardwareDataDisplay.openHardwareSection(e);
});

document.getElementById("_events_and_logging_link").addEventListener('click', (e) => {
    eventsAndLoggingDataDisplay.openEventsSection(e);
});

document.getElementById("_power_link").addEventListener('click', (e) => {
    switchSection('power.html', e);
});