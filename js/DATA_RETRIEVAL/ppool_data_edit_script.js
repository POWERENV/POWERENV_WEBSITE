//==========================================================================================
//==========================================================================================
//===============================ppool_data_edit_script.js==================================
//==========================================================================================
//==========================================================================================

//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as ppoolDataDisplayScript from  "./ppool_data_display_script.js"
import * as editorComponents from  "../DATA_RETRIEVAL/editor_components.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

//#region DOCUMENTATION_CONFIGS

export function PPoolUpdateReadmeText(ppoolID, pgridID, newReadmeTXT){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://{window.location.host}/psystems/backend/data/ppool${ppoolID}/changeReadme`, {
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

//#endregion DOCUMENTATION_CONFIGS