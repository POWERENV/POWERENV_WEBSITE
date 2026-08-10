import * as config from "../../../config.js"

export async function getRecentActivity() {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/getRecentActivity`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "Recent activity data successfully received!")
            {
                resolve(LOGS.packetData);
            }
            else{
                reject(`Promise Rejected! HTTP Request Fault! Error message: ${LOGS.statusMessage}`);
            }
        });
    });
}

export function getPGridsInfoList() {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/getPGridsList`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.packetData != null)
            {
                resolve(LOGS.packetData);
            }
            else{
                reject("Promise Rejected! HTTP Request Fault!");
            }
        });
    });
}

// #region dataRetrievalMethods

export function getPGridDashboardData(pgridID : Number){
    document.getElementById("fullScreenLoadingZone")!.style.display = "flex";

    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/pgrid${pgridID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.packetData != null)
            {
                resolve(LOGS.packetData);
            }
            else {
                reject("Promise Rejected! HTTP Request Fault!");
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

export function getPPoolDashboardData(pgridID : Number, ppoolID : Number) {
    document.getElementById("fullScreenLoadingZone")!.style.display = "flex";

    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/pgrid${pgridID}/ppool${ppoolID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.packetData != null)
            {
                resolve(LOGS.packetData);
            }
            else {
                reject("Promise Rejected! HTTP Request Fault!");
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

export function getPNodeDashboardData(pgridID : Number, ppoolID : Number, pnodeID : Number){
    document.getElementById("fullScreenLoadingZone")!.style.display = "flex";

    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/pgrid${pgridID}/ppool${ppoolID}/pnode${pnodeID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.packetData != null)
            {
                resolve(LOGS.packetData);
            }
            else {
                reject("Promise Rejected! HTTP Request Fault!");
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

// #endregion dataRetrievalMethods