//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as pnodeDataDisplayScript from  "./pnode_data_display_script.js"
import * as pnodeEditors from  "../editor_components.js"
import * as config from "../../../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

class pnodeBasicInfo {
    //pNodeID : Number
    nickName = "string"
    systemModelName = "string"
    systemMachineTypeModel = "string"
    systemMachineSerialNumber = "string"
    systemPSeries = "string"
    parentPPoolID = 0
    readmeText = "string"
    serialCOMPort = "string"
}

class pnodeData {
    pnodeBasicInfo = {
        
    }

    pnodeFSPInfo = {
        fspid: 0,
        fspasmiUsername: "string",
        fspasmiPasswordHash: "string",
        fspasmiVersion: "string",
        fspasmiLocalTime: "string"
    }

    pnodeOSUserInfoType = {
        osid: 0,
        osUsername: "string",
        osPasswordHash: "string",
        osipAddress: "string",
        osFamily: "string"
    }
}

export function PNodeUpdateReadmeText(pnodeID : Number, ppoolID : Number, pgridID : Number, newReadmeTXT : String) {
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

/*export async function CreateNewPNode(pnodeData) {
    const requestBody = {
        pnodeBasicInfo: {
            pNodeID: 0,
            nickName: "string",
            systemModelName: "string",
            systemMachineTypeModel: "string",
            systemMachineSerialNumber: "string",
            systemPSeries: "string",
            parentPPoolID: 0,
            readmeText: "string",
            serialCOMPort: "string"
        },
        pnodeFSPInfo: {
            fspid: 0,
            fspasmiUsername: "string",
            fspasmiPasswordHash: "string",
            fspasmiVersion: "string",
            fspasmiLocalTime: "string"
        },
        pnodeOSUserInfoType: {
            osid: 0,
            osUsername: "string",
            osPasswordHash: "string",
            osipAddress: "string",
            osFamily: "string"
        }
    };

    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/createNewPPool`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "New PPool successfully created!")
            {
                resolve(LOGS.packetData);
            }
            else{
                editorComponents.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}*/