//==========================================================================================
//==========================================================================================
//==================================pnode_events_script.js==================================
//This script contains all functions related to the event listeners of the PNode Dashboard,
// which are responsible for handling the user interactions with the dashboard interface and
// trigger the corresponding actions.=======================================================
//==========================================================================================
//==========================================================================================

//=========================================================================================
//====================================Import statements====================================
//=========================================================================================
import * as fspCommunicationScript from  "../../fsp_communication_script.js"
import * as osCommunicationScript from  "../../os_communication_script.js"
//import * as signalR from "https://cdn.jsdelivr.net/npm/@microsoft/signalr@7.0.5/dist/esm/signalr.js"
//=========================================================================================
//=========================================================================================
//=========================================================================================

var signalRWSSConnection;
var telnetSessionID;

//=========================================================================================
/**
 * This function sets up the event listeners for the PNode console buttons.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export function setUpPNodeConsoleListeners(dashboardData)
{
    document.getElementById("openAsmiWebConsoleBTN").addEventListener("click", async () => {
        await openASMIWebConsole(dashboardData);
    });

    document.getElementById("openOSWebConsoleBTN").addEventListener("click", async () => {
        await openOSCommandTerminal(dashboardData);
    });
}

//=========================================================================================
/**
 * Opens the ASMI web console for the specified PNode.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export async function openASMIWebConsole(dashboardData)
{
    let loginResponse = await fspCommunicationScript.PNodeOpenASMISession(dashboardData.pnode_full_info.pnode_id);

    document.getElementById("consoleCloseBTN").addEventListener("click", async () => {
        await closeASMIWebConsole(dashboardData);
    });

    showASMIConsoleBox(loginResponse);
    document.getElementById("consoleModalBoxConsoleViewport").scrollTo(0, document.getElementById("consoleModalBoxConsoleViewport").scrollHeight);

    resetElementEventListeners("commandForm");
    document.getElementById("commandForm").addEventListener("submit", async (e) => {
        await ASMICommandInputSubmitEvent(e, dashboardData);
    });
}

//=========================================================================================
/**
 * Closes the ASMI web console for the specified PNode.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export async function closeASMIWebConsole(dashboardData)
{
    let logoutResponse = await fspCommunicationScript.PNodeCloseASMISession(dashboardData.pnode_full_info.pnode_id);
    hideASMIConsoleBox();
}

//=========================================================================================
/**
 * This function resets the event listeners of a specified element by cloning it and replacing the original element with the clone.
 * @param {String} targetOBJID The ID of the target element whose event listeners should be reset.
 */
//=========================================================================================
export async function ASMICommandInputSubmitEvent(e, dashboardData)
{
    e.preventDefault();

    let ipt = document.getElementById("consoleModalBoxViewportInput").value;
    let commandResponse = await fspCommunicationScript.PNodeSendASMICommand(dashboardData.pnode_full_info.pnodeSerialCOMPortId, ipt);
    let ttyViewport = document.getElementById("consoleModalBoxConsoleViewport");

    commandResponse.commandResult = commandResponse.commandResult.replaceAll('\r\n\r', '\n');
    document.getElementById("consoleModalBoxViewportContent").innerText += commandResponse.commandResult;
    ttyViewport.scrollTo(0, ttyViewport.scrollHeight);
    document.getElementById("consoleModalBoxViewportInput").value = "";
}

//=========================================================================================
/**
 * Opens the OS command terminal for the specified PNode.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export async function openOSCommandTerminal(dashboardData)
{
    let loginResponse = await osCommunicationScript.PNodeOpenOSTerminalSession(dashboardData.pnode_full_info.pnode_id);

    document.getElementById("consoleCloseBTN").addEventListener("click", async () => {
        let logoutResponse = await osCommunicationScript.PNodeCloseOSTerminalSession(telnetSessionID);
        hideASMIConsoleBox();
    });

    showOSConsoleBox(dashboardData);
    document.getElementById("consoleModalBoxConsoleViewport").scrollTo(0, document.getElementById("consoleModalBoxConsoleViewport").scrollHeight);

    resetElementEventListeners("commandForm");
    document.getElementById("commandForm").addEventListener("submit", async (e) => {
        osCommandInputSubmitEvent(e, dashboardData);
    });

    telnetSessionID = Number(loginResponse);
    signalRWSSConnection = new signalR.HubConnectionBuilder()
        .withUrl(`http://{window.location.host}/osTerminal?sessionId=${telnetSessionID}`)
        .build();

    signalRWSSConnection.on("ReceiveTerminalOutput", (data) => {
        document.getElementById("consoleModalBoxViewportContent").innerText += data;
        document.getElementById("consoleModalBoxConsoleViewport").scrollTo(0, document.getElementById("consoleModalBoxConsoleViewport").scrollHeight);
    });

    signalRWSSConnection.start()
        .then(() => console.log("Connected!"))
        .catch(err => console.error(err));

    osCommandInputSubmitEvent(null, dashboardData);
}

//=========================================================================================
/**
 * This function handles the submission of commands in the OS web console, sending the command to the server and updating the console viewport with the response.
 * @param {Object} e The event object generated by the form submission event.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export async function osCommandInputSubmitEvent(e, dashboardData)
{
    if(e != null) e.preventDefault();

    let ipt = document.getElementById("consoleModalBoxViewportInput").value;
    let commandResponse = await osCommunicationScript.PNodeSendCommandToOSTerminalSession(telnetSessionID, (ipt == "" || ipt == "exit") ? "echo" : ipt);
    let ttyViewport = document.getElementById("consoleModalBoxConsoleViewport");

    commandResponse = commandResponse.replaceAll('\r\n\r', '\n');
    ttyViewport.scrollTo(0, ttyViewport.scrollHeight);
    document.getElementById("consoleModalBoxViewportInput").value = "";

    document.getElementById("consoleModalBoxConsoleViewport").scrollTo(0, document.getElementById("consoleModalBoxConsoleViewport").scrollHeight);

    if(ipt == "exit"){
        let logoutResponse = await osCommunicationScript.PNodeCloseOSTerminalSession(telnetSessionID);
        hideASMIConsoleBox();
    }
}

export async function osTerminalContentRealTimeUpdate(dashboardData)
{
    const sessionId = "your-session-id";

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`/terminal?sessionId=${sessionId}`)
        .build();

    connection.on("ReceiveOutput", (data) => {
        console.log("Terminal:", data);
    });

    connection.start()
        .then(() => console.log("Connected!"))
        .catch(err => console.error(err));
}

//=========================================================================================
/**
 * Sets up the event listeners for the power actions buttons of a specified PNode.
 * @param {Object} dashboardData The dashboard data object containing information about the PNode.
 */
//=========================================================================================
export function setUpPNodePowerActionsEventListeners(dashboardData)
{
    document.getElementById("_PNodePowerOnBTN").addEventListener("click", async () => {
        console.log(await fspCommunicationScript.PNodePowerOn(dashboardData.pnode_full_info.pnode_id));
    });
    document.getElementById("_PNodePowerOffBTN").addEventListener("click", async () => {
        console.log(await fspCommunicationScript.PNodePowerOff(dashboardData.pnode_full_info.pnode_id));
    });
    document.getElementById("_PNodeRestart").addEventListener("click", async () => {
        console.log(await fspCommunicationScript.PNodeRestart(dashboardData.pnode_full_info.pnode_id));
    });
    if(document.getElementById("turnOFFAttentionLED").style.display == "inline-flex"){
        document.getElementById("turnOFFAttentionLED").addEventListener("click", async () => {
            console.log(await fspCommunicationScript.PNodeTurnOffAttentionLED(dashboardData.pnode_full_info.pnode_id));
        });
    }

    if(dashboardData.pnode_full_info.pnodeActivenessState == true){
        disableButton("changeUserCredentialsBTN");
        disableButton("_pnodeResetNICConfigs");
        disableButton("_pnodeAddAccessPolicy");
        disableButton("_configureLPARBTN");
        document.getElementById('systemStateActiveWarning').style.display = 'block';
    }
    document.getElementById("_pnodeResetNICConfigs").addEventListener("click", () => {
        fspCommunicationScript.PNodeResetNetworkConfiguration(dashboardData.pnode_full_info.pnode_id);
    });
}