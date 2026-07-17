//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as pnodeDataDisplayScript from  "./DATA_RETRIEVAL/PNODE/pnode_data_display_script.js"
import * as pnodeEditors from  "./DATA_RETRIEVAL/editor_components.js"
import * as config from "../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

//#region POWER_MGMT
export function PNodePowerOn(pnodeCOMID)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeCOMID}/poweron`, {
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

export function PNodePowerOff(pnodeID)
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

export function PNodeRestart(pnodeCOMID)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeCOMID}/restart`, {
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

export function PNodeTurnOffAttentionLED(pnodeCOMID)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/power/${pnodeCOMID}/atentionLedOff`, {
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

export function PNodeOpenASMISession(pnodeCOMID)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/${pnodeCOMID}/openASMISession`, {
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

export function PNodeCloseASMISession(pnodeCOMID)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/${pnodeCOMID}/closeASMISession`, {
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

export function PNodeSendASMICommand(pnodeCOMID, command)
{
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/fsp/${pnodeCOMID}/sendASMICommand`, {
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

export function PNodeInsertETHAccessPolicy(pnodeCOMID, ipAddress, policyType, policyIndex, _ppoolID, _pgridID)
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
                pnodeEditors.displayPNodesDashboardData(pnodeCOMID, _ppoolID, _pgridID, 1);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

export function PNodeUpdateNetworkConfigs(pnodeCOMID, ethIndex, changedProperties, newValues, IPAddressType, _ppoolID, _pgridID)
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
                document.getElementById("fullScreenLoadingZone").style.display = "none";
                pnodeEditors.displayPNodesDashboardData(pnodeCOMID, _ppoolID, _pgridID, 1);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

//#endregion NETWORK_CONFIGURATION
//#region DOCUMENTATION_CONFIGS

export function PNodeUpdateReadmeText(pnodeID, ppoolID, pgridID, newReadmeTXT){
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/pnode${pnodeID}/changeReadme`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReadmeTXT)
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "PNode Readme successfully received!")
            {
                resolve(LOGS.packetData);
                pnodeDataDisplayScript.displayPNodesDashboardData(pnodeID, ppoolID, pgridID, 1);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

//#endregion DOCUMENTATION_CONFIGS
//#region DATETIME_CONFIGS

export function PNodeUpdateFSPLocalDateTime(pnodeID, newDateTime, ppoolID, pgridID){
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
                pnodeEditors.displayPNodesDashboardData(pnodeID, ppoolID, pgridID, 1);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

//#endregion DATETIME_CONFIGS


export function PNodeResetNetworkConfiguration(pnodeID){
    const confirmationModalBox = new pnodeDataDisplayScript.messageModalBox('CONFIRMATION MESSAGE', 'Are you sure want to reset network configurations?');

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