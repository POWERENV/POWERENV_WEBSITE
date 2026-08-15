//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as pnodeDataDisplayScript from  "./pnode_data_display_script.js"
import * as pnodeEditors from  "../editor_components.js"
import * as genericScripting from "../../scripting.js"
import * as typeDefinitions from "../../types.js"
import * as config from "../../../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

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

            genericScripting.hideScreenLoadingPane();
        });
    });
}

export async function syncNewPNodeMachine(pnodeData : typeDefinitions.MachineConnectionCredentialsData) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/syncNewPNodeMachine`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pnodeData)
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "Machine Data Synchronized!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            genericScripting.hideScreenLoadingPane();
        });
    });
}

export async function CreateNewPNode(pnodeData : typeDefinitions.NewPNodeData) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/createNewPNode`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pnodeData)
        }).then(res => {
            return res.text();
        } ).then(data => {
            return JSON.parse(data);
        } ).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "New PNode successfully created!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            genericScripting.hideScreenLoadingPane();
        });
    });
}

export async function DeletePNode(pnodeID : Number) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/deletePNode_${pnodeID}`, {
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

            if(LOGS.statusMessage == "PNode successfully deleted!")
            {
                resolve(LOGS.packetData);
            }
            else{
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            genericScripting.hideScreenLoadingPane();
        });
    });
}