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
    const notificationLogsData = globalEventsInfo.userNotifications;
    const scheduledBatchOperationsData = globalEventsInfo.userScheduledBatchOperations;

    assignGlobalApplicationEventsEventListeners();
    displayGlobalEventsActivity(activityData);
    displayGlobalEventsDistributionGraph(eventTypesDistribution);
    displayGlobalEventsCadenceStatsGraph(eventCadenceStats);
    displayNotificationLogsData(notificationLogsData);
    displayScheduledBatchOperationsData(scheduledBatchOperationsData);
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
                backgroundColor: '#ff9f43',
                borderRadius: 2,
                hoverBackgroundColor: '#ff9f43aa'
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
            },
            scales: {
                x: {
                    grid: {
                        color: 'transparent'
                    }
                },
                y: {
                    grid: {
                        color: '#2b2b2b'
                    },
                    ticks: {
                        padding: 20
                    },
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
        changeGlobalEventsCadenceGraphInterval(0);

        document.getElementById("_30daysBTN").classList.remove("sbActive");
        document.getElementById("_7daysBTN").classList.remove("sbActive");
        document.getElementById("_1dayBTN").classList.add("sbActive");
    });
}

function displayGlobalEventsCadenceStatsGraph(eventCadenceStats, timeScaleUnit = "day") {
    const eventCadenceCanvas = document.getElementById('eventCadenceViewCanvas').getContext('2d');

    let DataSet = []
    let TimestampLabels = []
    const repeatCount = eventCadenceStats.length == 1 ? 2 : 1;

    for(let k = 0; k < repeatCount; k++) {
        for(let i = 0; i < eventCadenceStats.length; i++) {
            let timestampLabel = eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[2].split("T")[0];

            switch(timeScaleUnit) {
                case "day":
                    timestampLabel = `${eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[2].split("T")[0]}/${eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[1]}/${eventCadenceStats[i].hourlyIntervalTimestamp.split("-")[0]}`;
                    break;
                case "hour":
                    timestampLabel = `${eventCadenceStats[i].hourlyIntervalTimestamp.split("T")[1].split(":")[0]}h`;
                    break;
            }

            TimestampLabels.push(timestampLabel);

            DataSet.push(eventCadenceStats[i].eventCadence);
        }
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
                        autoSkip: false,
                        color: 'transparent'
                    }
                },
                y: {
                    grid: {
                        color: '#2b2b2b'
                    },
                    ticks: {
                        padding: 20,
                        stepSize: 5
                    },
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
                axis: 'x'
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

    if(interval == 0) timeScaleUnit = "hour";

    const globalEventsCadenceStats = await userDataRetrieval.getUserGlobalEventsCadenceStatsData(interval, timeScaleUnit);
    displayGlobalEventsCadenceStatsGraph(globalEventsCadenceStats, timeScaleUnit);
}

function displayNotificationLogsData(notificationLogsData) {
    if(notificationLogsData.length > 0) {
        document.getElementById("emptyNotificationLogsMessage").style.display = "none";
    }

    for(let i = 0; i < notificationLogsData.length; i++) {
        let colorHEX = "";

        switch(notificationLogsData[i].severityLevel) {
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

        let notificationResolvedTimestamp = notificationLogsData[i].notificationResolvedDatetime.replace("T", " ");
        let notificationAcknowledgementTimestamp = notificationLogsData[i].notificationAcknowledgementDatetime.replace("T", " ");

        if(notificationAcknowledgementTimestamp == "2001-01-01 00:00:00") {
            notificationAcknowledgementTimestamp = "EVENT IS NOT ACKNOWLEDGED"
        }

        if(notificationResolvedTimestamp == "2001-01-01 00:00:00") {
            notificationResolvedTimestamp = "EVENT IS NOT RESOLVED"
        }

        document.getElementById("NotificationLogsTableContent").innerHTML += `<tr>
            <td>${notificationLogsData[i].notificationId}</td>
            <td><span class="state-pill" style="background:${colorHEX}11;color:${colorHEX}">${notificationLogsData[i].severityLevel}</span></td>
            <td>${notificationLogsData[i].title}</td>
            <td>${notificationLogsData[i].description}</td>
            <td>${notificationLogsData[i].triggeredAt.replace("T", " ")}</td>
            <td>${notificationLogsData[i].notificationTargetUsername}</td>
            <td>${notificationAcknowledgementTimestamp}</td>
            <td>${notificationResolvedTimestamp}</td>
        </tr>`;
    }
}

function displayScheduledBatchOperationsData(scheduledBatchOperationsData) {
    if(scheduledBatchOperationsData.length > 0) {
        document.getElementById("emptyScheduledBatchOperationsMessage").style.display = "none";
    }

    for(let i = 0; i < scheduledBatchOperationsData.length; i++) {
        document.getElementById("ScheduledBatchOperationsTableContent").innerHTML += `<tr>
            <td>${scheduledBatchOperationsData[i].batchOperationID}</td>
            <td>${scheduledBatchOperationsData[i].batchOperationCatName}</td>
            <td>${scheduledBatchOperationsData[i].batchOperationSourcePPoolName}</td>
            <td>${scheduledBatchOperationsData[i].batchOperationAction}</td>
            <td>${scheduledBatchOperationsData[i].batchOperationDateTime}</td>
            <td>${scheduledBatchOperationsData[i].batchOperationSourceUserName}</td>
        </tr>`;
    }
}