//==========================================================================================
//==========================================================================================
//==================================os_communication_script.js==============================
//This script contains all functions related to the communication with the OS terminal for
// the PNode Dashboard, which are responsible for handling the user interactions with the
// dashboard interface and trigger the corresponding actions.===============================
//==========================================================================================
//==========================================================================================

//=========================================================================================
//====================================Import statements====================================
//=========================================================================================
import * as pnodeDataDisplayScript from  "./DATA_RETRIEVAL/PNODE/pnode_data_display_script.js"
//=========================================================================================
//=========================================================================================
//=========================================================================================

//=========================================================================================
/**
 * This function opens a terminal session with the OS of the specified PNode and returns the initial login response from the server, which can be used to display the live console output in the OS web console modal box.
 * @param {Int} pnodeID The ID of the PNode for which to open the OS terminal session.
 * @returns 
 */
//=========================================================================================
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

//=========================================================================================
/**
 * Closes the OS terminal session for the specified PNode.
 * @param {Int} pnodeID The ID of the PNode for which to close the OS terminal session.
 * @returns 
 */
//=========================================================================================
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

//=========================================================================================
/**
 * This function sends a command input by the user in the OS web console to the server, which queues the command for execution in the OS terminal session of the specified PNode.
 * @param {Int} pnodeID The ID of the PNode for which to send the command.
 * @param {String} command The command to send to the OS terminal session.
 * @returns 
 */
//=========================================================================================
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