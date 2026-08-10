//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as pnodeDataDisplayScript from  "./PNODE/pnode_data_display_script.js"
import * as pnodeEditors from  "./editor_components.js"
import * as config from "../../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

//#region POWER_MGMT
export function PNodePowerOn(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeID}/poweron`, {
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

            if(LOGS.statusMessage == "System powered on successfully.")
            {
                pnodeEditors.showSuccessMessage(LOGS.statusMessage);
                resolve(LOGS.statusMessage);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

export function PNodePowerOff(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeID}/poweroff`, {
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

            if(LOGS.statusMessage == "System powered off successfully.")
            {
                pnodeEditors.showSuccessMessage(LOGS.statusMessage);
                resolve(LOGS.statusMessage);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

export function PNodeRestart(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeID}/restart`, {
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

            if(LOGS.statusMessage == "System restarted successfully.")
            {
                pnodeEditors.showSuccessMessage(LOGS.statusMessage);
                resolve(LOGS.statusMessage);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

export function PNodeTurnOffAttentionLED(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeID}/atentionLedOff`, {
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

            if(LOGS.statusMessage == "Atention LED powered off.")
            {
                pnodeEditors.showSuccessMessage(LOGS.statusMessage);
                resolve(LOGS.statusMessage);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

//#endregion POWER_MGMT
//#region REMOTE_CONSOLE_MGMT

export function PNodeOpenASMISession(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/${pnodeID}/openASMISession`, {
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

            if(LOGS.statusMessage == "ASMI Session Started!!!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

export function PNodeCloseASMISession(pnodeID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/${pnodeID}/closeASMISession`, {
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

            if(LOGS.statusMessage == "ASMI Session Ended Successfully!!!")
            {
                resolve(LOGS.statusMessage);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

export function PNodeSendASMICommand(pnodeID : Number, command : string)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/pnode${pnodeID}/sendASMICommand`, {
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

            if(LOGS.statusMessage == "Command Executed Successfully!!!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }
        });
    });
}

//#endregion REMOTE_CONSOLE_MGMT
//#region NETWORK_CONFIGURATION

export function PNodeInsertETHAccessPolicy(pnodeCOMID : Number, ipAddress : string, policyType : string, policyIndex : Number, _ppoolID : Number, _pgridID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/network/${pnodeCOMID}/${policyType == "ALLOW" ? "editAllowedIPAddresses" : "editDeniedIPAddresses"}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: `{
                "indexes": [
                    ${policyIndex}
                ],
                "ipAddresses": [
                    "${ipAddress}"
                ]
            }`
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "Allowed IP addresses edited successfully." || LOGS.statusMessage == "Denied IP addresses edited successfully.")
            {
                resolve(LOGS.packetData);
                pnodeDataDisplayScript.displayPNodesDashboardData(pnodeCOMID, _ppoolID, _pgridID);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

export function PNodeUpdateNetworkConfigs(pnodeCOMID : Number, ethIndex : Number, changedProperties : string, newValues : string, IPAddressType : string, _ppoolID : Number, _pgridID : Number)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/network/${pnodeCOMID}/editNetworkInterfaceConfigs/bulkData`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: `{
                "eth_index": ${ethIndex},
                "changedProperties": ${changedProperties},
                "newValues": ${newValues},
                "ipAddressType": ${IPAddressType}
            }`
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "Network information edited successfully.")
            {
                resolve(LOGS.packetData);
                document.getElementById("fullScreenLoadingZone")!.style.display = "none";
                pnodeDataDisplayScript.displayPNodesDashboardData(pnodeCOMID, _ppoolID, _pgridID);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

//#endregion NETWORK_CONFIGURATION
//#region DATETIME_CONFIGS

export function PNodeUpdateFSPLocalDateTime(pnodeID : Number, newDateTime : string, ppoolID : Number, pgridID : Number) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/datetime/${pnodeID}/setdatetime/${newDateTime}`, {
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

            if(LOGS.statusMessage == "System date and time set successfully!")
            {
                resolve(LOGS.packetData);
                pnodeDataDisplayScript.displayPNodesDashboardData(pnodeID, ppoolID, pgridID);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone")!.style.display = "none";
        });
    });
}

//#endregion DATETIME_CONFIGS


export function PNodeResetNetworkConfiguration(pnodeID : Number){
    const confirmationModalBox = new pnodeEditors.messageModalBox('CONFIRMATION MESSAGE', 'Are you sure want to reset network configurations?');

    const confirmationModalBoxRejected = () => {
        confirmationModalBox.hideMessageBox();
    };
    const confirmationModalBoxConfirmed = () => {
        confirmationModalBox.hideMessageBox();
    };

    confirmationModalBox.addActionButton('Yes', confirmationModalBoxConfirmed);
    requestAnimationFrame(() => {
        confirmationModalBox.addActionButton('No', confirmationModalBoxRejected);
    });
}