//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as pnodeEditors from  "../editor_components.js"
import * as genericScripting from "../../scripting.js"
import * as config from "../../../../config.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

export async function CreateNewPGrid(pgridName : string, pgridReadmeTXT : string) {
    const requestBody = {
        pgrid_id: "string",
        pgrid_name: pgridName,
        pgrid_creation_datetime: "string",
        pgrid_last_update_datetime: "string",
        pgrid_owner: "string",
        pgrid_readme_text: pgridReadmeTXT,
        pgrid_ppools_count: 0,
        pgrid_pnodes_count: 0,
        pgrid_active_pnodes_count: 0
    };

    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/createNewPGrid`, {
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

            if(LOGS.statusMessage == "New PGrid successfully created!")
            {
                resolve(LOGS.packetData);
            }
            else {
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            genericScripting.hideScreenLoadingPane();
        });
    });
}

export async function DeletePGrid(pgrid_id : Number) {
    return new Promise((resolve, reject) => {
        const name = fetch(`${config.baseAPIURL}/psystems/backend/data/deletePGrid_${pgrid_id}`, {
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

            if(LOGS.statusMessage == "PGrid successfully deleted!")
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