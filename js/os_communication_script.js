import * as pnodeDataDisplayScript from  "./DATA_RETRIEVAL/PNODE/pnode_data_display_script.js"

export function PNodeOpenOSTerminalSession(pnodeID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/os/${pnodeID}/openOSSession`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "OS session established with success!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeDataDisplayScript.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

export function PNodeCloseOSTerminalSession(pnodeID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/os/${pnodeID}/closeOSSession`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "OS session closed with success!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeDataDisplayScript.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

export function PNodeSendCommandToOSTerminalSession(pnodeID, command){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://localhost:5000/psystems/os/${pnodeID}/OSSendCommand`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(command)
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "OS command successfully sent and queued!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeDataDisplayScript.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}