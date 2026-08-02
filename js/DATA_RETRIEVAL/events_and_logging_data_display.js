import * as genericScript from "../scripting.js";
import * as dataRetrievalScript from "./data_retrieval_script.js"
import * as userDataRetrieval from "./../USER_LOGIC/user_data_retrieval_script.js"

let globalEventsDistributionGraphInstance = null;
let globalEventsCadenceStatsGraphInstance = null;

export async function openEventsSection(event) {
    genericScript.switchSection('tasks.html', event);
    const globalEventsInfo = await userDataRetrieval.getUserGlobalEventsData();
    const activityData = globalEventsInfo.notificationsListInfo;
    const eventTypesDistribution = globalEventsInfo.globalEventsDistribution;
    const eventCadenceStats = globalEventsInfo.globalEventsCadenceStats;

    assignGlobalApplicationEventsEventListeners();
    displayGlobalEventsActivity(activityData);
    displayGlobalEventsDistributionGraph(eventTypesDistribution);
    displayGlobalEventsCadenceStatsGraph(eventCadenceStats);
}

function displayGlobalEventsActivity(recentActivityData) {
    if(recentActivityData.length > 0) {
        document.getElementById("emptyGlobalEventsListMessage").style.display = "none";
    }

    for(let i = 0; i < recentActivityData.length; i++) {
        let colorHEX = "";

        switch(recentActivityData[i].globalEventSeverityLevel) {
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

        let notificationResolvedTimestamp = recentActivityData[i].notificationResolvedTimestamp.replace("T", " ");
        let notificationAcknowledgementTimestamp = recentActivityData[i].notificationAcknowledgementTimestamp.replace("T", " ");

        if(notificationAcknowledgementTimestamp == "2001-01-01 00:00:00") {
            notificationAcknowledgementTimestamp = "EVENT IS NOT ACKNOWLEDGED"
        }

        if(notificationResolvedTimestamp == "2001-01-01 00:00:00") {
            notificationResolvedTimestamp = "EVENT IS NOT RESOLVED"
        }

        document.getElementById("GlobalEventsTableContent").innerHTML += `<tr>
            <td>${recentActivityData[i].globalEventId}</td>
            <td><span class="state-pill" style="background:${colorHEX}11;color:${colorHEX}">${recentActivityData[i].globalEventSeverityLevel}</span></td>
            <td>${recentActivityData[i].globalEventTitle}</td>
            <td>${recentActivityData[i].globalEventDescription}</td>
            <td>${recentActivityData[i].globalEventTriggeredAt.replace("T", " ")}</td>
            <td>${recentActivityData[i].notificationTargetUsername}</td>
            <td>${notificationAcknowledgementTimestamp}</td>
            <td>${notificationResolvedTimestamp}</td>
        </tr>`;
    }
}

function displayGlobalEventsDistributionGraph(eventTypesDistribution) {
    const eventDistributionChartCanvas2DContext = document.getElementById('eventDistributionViewCanvas').getContext('2d');
    
    globalEventsDistributionGraphInstance = new Chart(eventDistributionChartCanvas2DContext, {
        type: 'bar',
        data: {
            labels: [`INFORMATIONAL (${eventTypesDistribution.informationalEventsCount})`, `WARNING (${eventTypesDistribution.warningEventsCount})`, `HIGH IMPACT (${eventTypesDistribution.highImpactEventsCount})`, `CRITICAL (${eventTypesDistribution.criticalEventsCount})`],
            datasets: [{
                label: 'EVENT COUNT',
                data: [
                    eventTypesDistribution.informationalEventsCount,
                    eventTypesDistribution.warningEventsCount,
                    eventTypesDistribution.highImpactEventsCount,
                    eventTypesDistribution.criticalEventsCount
                ],
                backgroundColor: '#b33939',
                borderRadius: 5,
                hoverBackgroundColor: '#c0362a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function assignGlobalApplicationEventsEventListeners() { 
    document.getElementById("_eventLogsBTN").addEventListener("click", () => {
        document.getElementById("eventLogsView").style.display = "block";
        document.getElementById("_eventLogsBTN").classList.add("sbActive");
        document.getElementById("eventDistributionView").style.display = "none";
        document.getElementById("_eventTypeDistributionBTN").classList.remove("sbActive");
    });

    document.getElementById("_eventTypeDistributionBTN").addEventListener("click", () => {
        document.getElementById("eventLogsView").style.display = "none";
        document.getElementById("_eventLogsBTN").classList.remove("sbActive");
        document.getElementById("eventDistributionView").style.display = "block";
        document.getElementById("_eventTypeDistributionBTN").classList.add("sbActive");
    });

    document.getElementById("_30daysBTN").addEventListener("click", () => {
        changeGlobalEventsCadenceGraphInterval(30);

        document.getElementById("_30daysBTN").classList.add("sbActive");
        document.getElementById("_7daysBTN").classList.remove("sbActive");
        document.getElementById("_1dayBTN").classList.remove("sbActive");
    });

    document.getElementById("_7daysBTN").addEventListener("click", () => {
        changeGlobalEventsCadenceGraphInterval(7);

        document.getElementById("_30daysBTN").classList.remove("sbActive");
        document.getElementById("_7daysBTN").classList.add("sbActive");
        document.getElementById("_1dayBTN").classList.remove("sbActive");
    });

    document.getElementById("_1dayBTN").addEventListener("click", () => {
        changeGlobalEventsCadenceGraphInterval(1);

        document.getElementById("_30daysBTN").classList.remove("sbActive");
        document.getElementById("_7daysBTN").classList.remove("sbActive");
        document.getElementById("_1dayBTN").classList.add("sbActive");
    });
}

function displayGlobalEventsCadenceStatsGraph(eventCadenceStats, timeScaleUnit = "day") {
    const eventCadenceCanvas = document.getElementById('eventCadenceViewCanvas').getContext('2d');

    let DataSet = []
    let TimestampLabels = []

    for(let i = 0; i < eventCadenceStats.length; i++) {
        let timestampLabel = eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[2].split("T")[0];

        switch(timeScaleUnit) {
            case "day":
                timestampLabel = eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[2].split("T")[0];
                break;
            case "hour":
                timestampLabel = eventCadenceStats[i].hourlyIntervalTimestamp.split("T")[1].split(":")[0];
                break;
        }

        TimestampLabels.push(timestampLabel);

        DataSet.push(eventCadenceStats[i].eventCadence);
    }

    globalEventsCadenceStatsGraphInstance = new Chart(eventCadenceCanvas, {
        type: 'line',
        data: {
            labels: TimestampLabels,
            datasets: [{
                label: 'EVENT CADENCE',
                data: DataSet,
                tension: 0.3,
                fill: true,
                backgroundColor: '#b3393965',
                borderColor: '#c0362a',
                borderRadius: 5,
                hoverBackgroundColor: '#1f1f1f',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false
                    }
                }
            }
        }
    });
}

async function changeGlobalEventsCadenceGraphInterval(interval) {
    if(globalEventsCadenceStatsGraphInstance != null) {
        globalEventsCadenceStatsGraphInstance.destroy();
        globalEventsCadenceStatsGraphInstance = null;
    }

    let timeScaleUnit = "day";

    if(interval == 1) timeScaleUnit = "hour";

    const globalEventsCadenceStats = await userDataRetrieval.getUserGlobalEventsCadenceStatsData(interval, timeScaleUnit);
    displayGlobalEventsCadenceStatsGraph(globalEventsCadenceStats, timeScaleUnit);
}