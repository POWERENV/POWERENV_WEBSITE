//==========================================================================================
//==========================================================================================
//===============================ppool_data_edit_script.js==================================
//==========================================================================================
//==========================================================================================

//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as ppoolDataDisplayScript from  "./ppool_data_display_script.js"
import * as editorComponents from  "../editor_components.js"
import * as config from "../../../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

//#region DOCUMENTATION_CONFIGS

export function PPoolUpdateReadmeText(ppoolID, pgridID, newReadmeTXT){
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/ppool${ppoolID}/changeReadme`, {
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

            if(LOGS.statusMessage == "PPool Readme successfully received!")
            {
                resolve(LOGS.packetData);
                ppoolDataDisplayScript.displayPPoolDashboardData(pgridID, ppoolID, 1);
            }
            else{
                editorComponents.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

export async function CreateNewPPool(ppoolName, ppoolTag, ppoolReadmeText, ppoolAssociatedPGridID) {
    const requestBody = {
        ppool_id: 0,
        ppool_name: ppoolName,
        ppool_tag: ppoolTag,
        ppool_parent_pgrid_id: ppoolAssociatedPGridID,
        ppool_parent_pgrid_name: "string",
        ppool_creation_datetime: "string",
        ppool_last_update_datetime: "string",
        ppool_readme_text: ppoolReadmeText,
        ppool_pnodes_count: 0,
        ppool_active_pnodes_count: 0
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
}

export async function DeletePPool(ppool_id) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/deletePPool_${ppool_id}`, {
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

            if(LOGS.statusMessage == "PPool successfully deleted!")
            {
                resolve(LOGS.packetData);
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