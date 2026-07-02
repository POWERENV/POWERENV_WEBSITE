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
import * as pnodeEditors from "./DATA_RETRIEVAL/editor_components.js"
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
        const name = fetch(`http://{window.location.host}/psystems/os/${pnodeID}/openOSSession`, {
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
                // Perform any necessary actions upon successful session establishment
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

//=========================================================================================
/**
 * Closes a specified OS terminal session.
 * @param {Int} sessionID The ID of the session which we want to close.
 * @returns 
 */
//=========================================================================================
export function PNodeCloseOSTerminalSession(sessionID){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://{window.location.host}/psystems/os/${sessionID}/closeOSSession`, {
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
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}

//=========================================================================================
/**
 * This function sends a command input by the user in the OS web console to the server, which queues the command for execution in the specified OS terminal session.
 * @param {Int} sessionID The ID of the session which we want to send the command to.
 * @param {String} command The command to send to the OS terminal session.
 * @returns 
 */
//=========================================================================================
export function PNodeSendCommandToOSTerminalSession(sessionID, command){
    return new Promise((resolve, reject) => {
        const name = fetch(`http://{window.location.host}/psystems/os/${sessionID}/OSSendCommand`, {
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
                pnodeEditors.showErrorMessage(LOGS.statusMessage);
                reject(LOGS.statusMessage);
            }

            document.getElementById("fullScreenLoadingZone").style.display = "none";
        });
    });
}