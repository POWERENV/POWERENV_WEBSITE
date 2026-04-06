export function getPGridsInfoList(){
    return new Promise((resolve, reject) => {
        const name = fetch("http://localhost:5000/psystems/backend/data/getPGridsList", {
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

export function getPGridDashboardData(pgridID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/backend/data/pgrid${pgridID}`, {
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

export function getPPoolDashboardData(pgridID, ppoolID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/backend/data/pgrid${pgridID}/ppool${ppoolID}`, {
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

export function getPNodeDashboardData(pgridID, ppoolID, pnodeID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/backend/data/pgrid${pgridID}/ppool${ppoolID}/pnode${pnodeID}`, {
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

// #endregion dataRetrievalMethods