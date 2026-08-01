import * as genericScript from "../scripting.js";
import * as pgridDataDisplayScript from  "./pgrid_data_display_script.js"
import * as dataRetrievalScript from "./data_retrieval_script.js"

export function openHardwareSection(event) {
    genericScript.switchSection('hardware.html', event);
    displayRecentActivity();
    pgridDataDisplayScript.displayPGridsList();
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