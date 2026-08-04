import * as genericScript from "../scripting.js";
import * as pgridDataDisplayScript from  "./pgrid_data_display_script.js"
import * as dataRetrievalScript from "./data_retrieval_script.js"
import * as eventsAndLoggingDataDisplayScript from "./events_and_logging_data_display.js"
import * as pgridDataEditScript from './pgrid_data_edit_script.js';
import * as editorComponents from '../DATA_RETRIEVAL/editor_components.js';

export async function openHardwareSection(event) {
    genericScript.switchSection('hardware.html', event);
    await displayRecentActivity();
    await pgridDataDisplayScript.displayPGridsList();

    document.getElementById("viewFullEventActivityButton").addEventListener("click", (e) => {
        eventsAndLoggingDataDisplayScript.openEventsSection(e);
    });

    document.getElementById("createPGridButton").addEventListener("click", () => {
        createNewPGrid();
    });
}

async function displayRecentActivity() {
    const recentActivityData = await dataRetrievalScript.getRecentActivity();

    if(recentActivityData.length > 0) {
        document.getElementById("emptyHardwareActivityListMessage").style.display = "none";
    }

    for(let i = 0; i < recentActivityData.length; i++) {
        let colorHEX = "";

        switch(recentActivityData[i].globalEventSeverityLevel){
            case "INFORMATIONAL":
                colorHEX = "#2269c5"
                break;
            case "WARNING":
                colorHEX = "#ffd166"
                break;
            case "HIGH IMPACT":
                colorHEX = "#ff9f43"
                break;
            case "CRITICAL":
                colorHEX = "#fb7185"
                break;
        }

        document.getElementById("RecentActivityTableContent").innerHTML += `<tr>
            <td>${recentActivityData[i].globalEventId}</td>
            <td><span class="state-pill" style="background:${colorHEX}11;color:${colorHEX}">${recentActivityData[i].globalEventSeverityLevel}</span></td>
            <td>${recentActivityData[i].globalEventTitle}</td>
            <td>${recentActivityData[i].globalEventDescription}</td>
            <td>${recentActivityData[i].globalEventTriggeredAt.replace("T", " ")}</td>
            <td>${recentActivityData[i].notificationTargetUsername}</td>
            <td>${recentActivityData[i].notificationAcknowledgementTimestamp.replace("T", " ")}</td>
            <td>${recentActivityData[i].notificationResolvedTimestamp.replace("T", " ")}</td>
        </tr>`;
    }
}

function createNewPGrid() {
    const pgridCreationWizzardSubmitAction = async () => {
        const pgridName = document.getElementById("pgridNameField").value;
        const pgridReadmeTXT = document.getElementById("pgridReadmeTextField").value;
        await pgridDataEditScript.CreateNewPGrid(pgridName, pgridReadmeTXT);
        openHardwareSection(null);
    };
    const pgridCreationWizzard = new editorComponents.sideConfigurationEditWizzard("PGrid Creation Wizzard", "", pgridCreationWizzardSubmitAction);

    pgridCreationWizzard.insertInputField("pgridNameField", "PGrid Name", "Sample PGrid", "");
    pgridCreationWizzard.insertTextArea("pgridReadmeTextField", "PGrid Readme Text", "Sample PGrid Readme", "", "200px");
}