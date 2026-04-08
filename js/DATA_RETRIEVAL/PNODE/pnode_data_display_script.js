//=========================================================================================
//====================================Import statements====================================
//=========================================================================================

import * as mainScript from "../data_handling_main_script.js"
import * as dataRetrievalScript from "../data_retrieval_script.js"
import * as pnodeEventsScript from  "./pnode_events_script.js"
import * as pnodeEditors from "../editor_components.js"
import * as ppoolDataDisplayScript from  "../ppool_data_display_script.js"
import * as fspCommunicationScript from  "../../fsp_communication_script.js"
import * as osCommunicationScript from  "../../os_communication_script.js"

//=========================================================================================
//=========================================================================================
//=========================================================================================

//#region GENERAL

//=========================================================================================
/**
 * This is the main function for displaying all pnode data in the dashboard.
 * @param {String} _pnodeID The ID of the pnode to display the dashboard for, used for data retrieval.
 * @param {String} _ppoolID The ID of the pnode's parent pool, used for data retrieval.
 * @param {String} _pgridID The ID of the pnode's parent grid, used for data retrieval.
 * @param {Event} e The event object from the click event that triggered the function, used to prevent default behavior.
*/
//=========================================================================================
export async function displayPNodesDashboardData(_pnodeID, _ppoolID, _pgridID, e)
{
    let dashboardData = await dataRetrievalScript.getPNodeDashboardData(_pgridID, _ppoolID, _pnodeID);
    await switchCustomSection('pnode_mgmt.html', 'content', 'content');

    mainScript.updateActiveTreeNode(dashboardData.pnode_full_info.pnode_nickname);

    document.getElementById("_backToPoolBTN").addEventListener("click", async (e) => {
        await ppoolDataDisplayScript.displayPPoolDashboardData(_pgridID, _ppoolID, e);
    });

    document.getElementById("reloadSettingsBTN").addEventListener("click", async (e) => {
        await displayPNodesDashboardData(_pnodeID, _ppoolID, _pgridID, e);
    });

    document.getElementById('changePNodeReadmeBTN').addEventListener('click', () => {
        const changesSaveOperation = () => {
            const newReadmeTXT = document.getElementById('readmeTextTextArea').value;
            fspCommunicationScript.PNodeUpdateReadmeText(_pnodeID, _ppoolID, _pgridID, newReadmeTXT);
        };
        const readmeTextEditorBox = new pnodeEditors.configurationEditWizzard('Edit Readme Text', dashboardData, changesSaveOperation);
        readmeTextEditorBox.insertTextArea('readmeTextTextArea', 'Readme Text', 'Write Readme Text', dashboardData.pnode_full_info.pnode_readme_text, null);
    });

    pnodeEventsScript.setUpPNodeConsoleListeners(dashboardData);
    displayPNodesMainInfo(dashboardData);
    document.getElementById('content').scrollTop = 0;
    displayPNodesFSPInfo(dashboardData);
    displayPNodesMachineInfo(dashboardData);
    displayPNodesNetworkInterfacesInfo(dashboardData);
    displayPNodesETHAccessPoliciesInfo(dashboardData, _ppoolID, _pgridID);
    displayPNodesLoginAudits(dashboardData);
    displayPNodesOperationHistory(dashboardData);
    displayPNodesErrorLogs(dashboardData);
    pnodeEventsScript.setUpPNodePowerActionsEventListeners(dashboardData);
}

//=========================================================================================
/**
 * This function shows a brief block of pnode information.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information.
*/
//=========================================================================================
function displayPNodesMainInfo(dashboardData)
{
    document.getElementById("_pnodeName").innerText = dashboardData.pnode_full_info.pnode_nickname;
    document.getElementById("_propsPNodeName").innerText = dashboardData.pnode_full_info.pnode_nickname;
    document.getElementById("_propsPNodeID").innerText = dashboardData.pnode_full_info.pnode_id;
    document.getElementById("_propsPNodeParentPPoolName").innerText = dashboardData.pnode_full_info.pnode_parent_ppool_name;
    document.getElementById("_propsPNodeCreationDatetime").innerText = dashboardData.pnode_full_info.pnode_config_datetime;
    document.getElementById("_propsPNodeLastUpdateDatetime").innerText = dashboardData.pnode_full_info.pnode_last_update_datetime;
    document.getElementById("_propsPNodeWorkingState").innerText = dashboardData.pnode_full_info.pnodeActivenessState == true ? "ACTIVE" : "INACTIVE";
    document.getElementById("_propsPNodeLastHeartBeatDatetime").innerText = dashboardData.pnode_full_info.pnode_last_heartbeat_datetime;
    document.getElementById("_propsPNodeAttentionLedState").innerText = dashboardData.pnode_full_info.pnode_attention_led_state;
    document.getElementById("_pnodeReadmeTextParagraph").innerText = dashboardData.pnode_full_info.pnode_readme_text;
    document.getElementById("_propsPNodeSerialCOMPortID").innerText = dashboardData.pnode_full_info.pnodeSerialCOMPortId;
    document.getElementById("turnOFFAttentionLED").style.display = dashboardData.pnode_full_info.pnode_attention_led_state == "ON" ? "inline-flex" : "none";
}

//=========================================================================================
/**
 * This function shows brief FSP information inherent to the pnode.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information and provide context data for edit operations.
*/
//=========================================================================================
function displayPNodesFSPInfo(dashboardData)
{
    document.getElementById("_pnodeFSPID").innerText = dashboardData.pnodeFSPInfo.pnode_fsp_id;
    document.getElementById("_pnodeFSPVERSION").innerText = dashboardData.pnodeFSPInfo.pnode_fsp_asmi_version;
    document.getElementById("_pnodeFSPUSERNAME").innerText = dashboardData.pnodeFSPInfo.pnode_fsp_asmi_username;
    document.getElementById("_pnodeFSPPASSWORD").innerText = dashboardData.pnodeFSPInfo.pnode_fsp_asmi_password_hash;
    document.getElementById("_pnodeFSPLocalDateTime").getElementsByTagName('span')[0].innerText = dashboardData.pnodeFSPInfo.pnode_fsp_asmi_local_datetime;
    document.getElementById("_pnodeFSPLocalDateTime").getElementsByTagName('button')[0].addEventListener('click', () => {
        editPNodeASMIDateTimeEvent(dashboardData);
    });
}

//=========================================================================================
/**
 * This function opens a configurationEditWizzard side-panel for editing the pnode's ASMI local date and time.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information.
*/
//=========================================================================================
function editPNodeASMIDateTimeEvent(dashboardData)
{
    const changesSaveOperation = (e, instance) => {
        const newLocalDateTime = instance.struct_inputFields.editBoxLocalDateTimeInput;
        fspCommunicationScript.PNodeUpdateFSPLocalDateTime(dashboardData.pnode_full_info.pnode_id, newLocalDateTime, dashboardData.pnode_full_info.pnode_parent_ppool_id, dashboardData.pnode_full_info.pnode_parent_pgrid_id);
    };

    let fspLocalDateTimeEditorBox = new pnodeEditors.configurationEditWizzard('Edit FSP ASMI Local DateTime', dashboardData, changesSaveOperation);
    fspLocalDateTimeEditorBox.insertInputField('editBoxLocalDateTimeInput', 'FSP ASMI LOCAL DATETIME (YYYY-MM-DD HH:MM:SS):', 'YYYY-MM-DD HH:MM:SS', dashboardData.pnodeFSPInfo.pnode_fsp_asmi_local_datetime);
}

//=========================================================================================
/**
 * This function displays the physical machine information inherent to the pnode.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information.
*/
//=========================================================================================
function displayPNodesMachineInfo(dashboardData)
{
    document.getElementById("_pnodeSystemModelName").innerText = dashboardData.pnodeMachineInfo.pnode_system_model_name;
    document.getElementById("_pnodeMachineTypeModel").innerText = dashboardData.pnodeMachineInfo.pnode_machine_type_model;
    document.getElementById("_pnodeMachineSerialNumber").innerText = dashboardData.pnodeMachineInfo.pnode_machine_serial_number;
    document.getElementById("_pnodeSystemPSeriesGeneration").innerText = dashboardData.pnodeMachineInfo.pnode_system_pseries;
}

//#endregion GENERAL

//#region NETWORK INTERFACE CARDS

//=========================================================================================
/**
 * This function displays a menu for inspecting and editing pnode's NIC configurations.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information and provide context data for edit operations.
 * @param {String} _ppoolID The ID of the pnode's parent pool, used for edit operations.
 * @param {String} _pgridID The ID of the pnode's parent grid, used for edit operations.
*/
//=========================================================================================
function displayPNodesNetworkInterfacesInfo(dashboardData, _ppoolID, _pgridID)
{    
    for(let i = 0; i < dashboardData.pnodeNICInfo.length; i++){
        document.getElementById("_pnodeNICInfo").innerHTML += `<tr class="NICRegistryInfo" id="NICRES_${i}">
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_id}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_name}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_mac_address}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_ip_address}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_ip_address_type}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_subnet_mask}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_default_gateway}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_hostname}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_domain_name}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_first_dns_ip_address}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_second_dns_ip_address}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_third_dns_ip_address}</td>
            <td>${dashboardData.pnodeNICInfo[i].pnode_nic_type}</td>
        </tr>`;

        requestAnimationFrame(() => {
            if(dashboardData.pnode_full_info.pnodeActivenessState == false){
                document.getElementById(`NICRES_${i}`).style.cursor = 'pointer';
                document.getElementById(`NICRES_${i}`).addEventListener('click', () => {
                    const changesSaveOperation = (e, instance) => {
                        const ethIndex = dashboardData.pnodeNICInfo[i].pnode_nic_name.substring(3);
                        const ipAddressType = instance.struct_dropdownFields.editBoxIPAddressTypeBTN[0].toUpperCase() + instance.struct_dropdownFields.editBoxIPAddressTypeBTN.substring(1).toLowerCase();
                        const changedProperties = JSON.stringify(ipAddressType.toUpperCase() == 'STATIC' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 8, 9]);
                        const newValues = JSON.stringify(ipAddressType.toUpperCase() == 'STATIC' ? [
                            instance.struct_inputFields.editBoxHostnameInput,
                            instance.struct_inputFields.editBoxDomainNameInput,
                            instance.struct_inputFields.editBoxIPAddressInput,
                            instance.struct_inputFields.editBoxSubnetMaskInput,
                            instance.struct_inputFields.editBoxDefautGatewayInput,
                            instance.struct_inputFields.editBoxFstDNSInput,
                            instance.struct_inputFields.editBoxSecDNSInput,
                            instance.struct_inputFields.editBoxTrdDNSInput,
                            ipAddressType,
                            instance.struct_dropdownFields.editBoxNICTypeBTN
                        ] : [
                            instance.struct_inputFields.editBoxHostnameInput,
                            instance.struct_inputFields.editBoxDomainNameInput,
                            ipAddressType,
                            instance.struct_dropdownFields.editBoxNICTypeBTN
                        ]);
                        
                        fspCommunicationScript.PNodeUpdateNetworkConfigs(dashboardData.pnode_full_info.pnode_id, ethIndex, changedProperties, newValues, JSON.stringify(ipAddressType), _ppoolID, _pgridID);
                    };

                    const ipAddressTypeDPDClickAction = (args) => {
                        if(document.getElementById(args.instance.dropdownFieldIDs[0]).innerHTML.split(" ")[0].toUpperCase() == 'STATIC') {
                            document.getElementById('editBoxIPAddressInput').parentElement.style.display = 'flex';
                            document.getElementById('editBoxSubnetMaskInput').parentElement.style.display = 'flex';
                            document.getElementById('editBoxDefautGatewayInput').parentElement.style.display = 'flex';
                            document.getElementById('editBoxFstDNSInput').parentElement.style.display = 'flex';
                            document.getElementById('editBoxSecDNSInput').parentElement.style.display = 'flex';
                            document.getElementById('editBoxTrdDNSInput').parentElement.style.display = 'flex';
                        }
                        else {
                            document.getElementById('editBoxIPAddressInput').parentElement.style.display = 'none';
                            document.getElementById('editBoxSubnetMaskInput').parentElement.style.display = 'none';
                            document.getElementById('editBoxDefautGatewayInput').parentElement.style.display = 'none';
                            document.getElementById('editBoxFstDNSInput').parentElement.style.display = 'none';
                            document.getElementById('editBoxSecDNSInput').parentElement.style.display = 'none';
                            document.getElementById('editBoxTrdDNSInput').parentElement.style.display = 'none';
                        }
                    };
                    
                    let networkInterfaceCardEditWizzard = new pnodeEditors.configurationEditWizzard('Edit NIC Settings', dashboardData, changesSaveOperation);
                    networkInterfaceCardEditWizzard.insertDropdownField('editBoxIPAddressTypeBTN', 'editBoxIPAddressTypeDropdownList', 'Select NIC IP Address Type:', ['STATIC', 'DYNAMIC'], dashboardData.pnodeNICInfo[i].pnode_nic_ip_address_type.toUpperCase(), [ipAddressTypeDPDClickAction, {instance : networkInterfaceCardEditWizzard}]);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxHostnameInput', 'NIC HOSTNAME:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_hostname);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxDomainNameInput', 'NIC DOMAIN NAME:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_domain_name);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxIPAddressInput', 'NIC IP ADDRESS:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_ip_address);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxSubnetMaskInput', 'NIC SUBNET MASK:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_subnet_mask);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxDefautGatewayInput', 'NIC DEFAULT GATEWAY:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_default_gateway);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxFstDNSInput', 'NIC 1ST DNS IP ADDRESS:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_first_dns_ip_address);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxSecDNSInput', 'NIC 2ND DNS IP ADDRESS:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_second_dns_ip_address);
                    networkInterfaceCardEditWizzard.insertInputField('editBoxTrdDNSInput', 'NIC 3RD DNS IP ADDRESS:', '<empty>', dashboardData.pnodeNICInfo[i].pnode_nic_third_dns_ip_address);
                    
                    ipAddressTypeDPDClickAction({instance: networkInterfaceCardEditWizzard});
                    
                    networkInterfaceCardEditWizzard.insertDropdownField('editBoxNICTypeBTN', 'editBoxDropdownList', 'Select NIC Type:', ['NORMAL', 'MANAGEMENT'], dashboardData.pnodeNICInfo[i].pnode_nic_type);
                });
            }
        });
    }
}

//=========================================================================================
/**
 * This function toggles a dropdown list box visibility, usualy when a button is clicked.
 * @param {Event} e The event object from the click event that triggered the function, used to prevent default behavior.
 * @param {String} listOBJ The ID of the dropdown list HTML element to toggle visibility on.
*/
//=========================================================================================
function toggleDropDownListVisibility(e, listOBJ){
    let dropdownDisplay = document.getElementById(listOBJ).style.display;
    document.getElementById(listOBJ).style.display = dropdownDisplay == 'block' ? 'none' : 'block';
    if(e != null && e != undefined) e.preventDefault();
}

//#endregion NETWORK INTERFACE CARDS

//#region NETWORK ACCESS POLICIES

//=========================================================================================
/**
 * This function displays an interface for viewing and editing pnode's network access policies.
 * @param {Object} dashboardData The object containing all data retrieved for the pnode, used to fill in the displayed information and provide context data for edit operations.
 * @param {String} _ppoolID The ID of the pnode's parent pool, used for edit operations.
 * @param {String} _pgridID The ID of the pnode's parent grid, used for edit operations.
*/
//=========================================================================================
function displayPNodesETHAccessPoliciesInfo(dashboardData, _ppoolID, _pgridID)
{
    let numAllowedPolicies = 0;
    let numDeniedPolicies = 0;

    for(let i = 0; i < dashboardData.pnodeETHAccessPolicies.length; i++){
        switch(dashboardData.pnodeETHAccessPolicies[i].access_policy_type){
            case 'ALLOW':
                numAllowedPolicies++;
                break;
            case 'DENY':
                numDeniedPolicies++;
                break;
        }
    }

    //Adding click event for creating new access policies, using the configurationEditWizzard
    document.getElementById("_pnodeAddAccessPolicy").addEventListener("click", () => {
        const changesSaveOperation = (e, instance) => {
            const pnodeCOMID = dashboardData.pnode_full_info.pnode_id;
            const policyIndex = instance.struct_dropdownFields.editBoxIPAddressTypeBTN == 'ALLOW' ? numAllowedPolicies + 1 : numDeniedPolicies + 1;
            fspCommunicationScript.PNodeInsertETHAccessPolicy(pnodeCOMID, instance.struct_inputFields.editBoxIPAddressInput, instance.struct_dropdownFields.editBoxIPAddressTypeBTN, policyIndex);
        };

        let ethAccessPolicyWizard = new pnodeEditors.configurationEditWizzard('Add Network Access Policy', dashboardData, changesSaveOperation);
        
        ethAccessPolicyWizard.insertInputField('editBoxIPAddressInput', 'Enter Target IP Address:', 'Enter Target IP Address', '');
        ethAccessPolicyWizard.insertDropdownField('editBoxIPAddressTypeBTN', 'editBoxIPAddressTypeDropdownList', 'Select Policy Type:', ['ALLOW', 'DENY']);
    });

    for(let i = 0; i < dashboardData.pnodeETHAccessPolicies.length; i++){
        let accessPolicyTypeBadgeBKG = dashboardData.pnodeETHAccessPolicies[i].access_policy_type == 'ALLOW' ? 'rgba(34,197,94,0.08)' : 'rgba(255,159,67,0.06)';
        let accessPolicyTypeBadgeTextColor = dashboardData.pnodeETHAccessPolicies[i].access_policy_type == 'ALLOW' ? 'var(--success)' : '#ff9f43';
        document.getElementById("_pnodeETHAccessPoliciesInfo").innerHTML += `<tr>
            <td>${dashboardData.pnodeETHAccessPolicies[i].access_policy_index_id}</td>
            <td>${dashboardData.pnodeETHAccessPolicies[i].access_policy_ip_address}</td>
            <td><span class="state-pill" style="background: ${accessPolicyTypeBadgeBKG}; color: ${accessPolicyTypeBadgeTextColor}">${dashboardData.pnodeETHAccessPolicies[i].access_policy_type}</span></td>
            <td style="display: flex; justify-content: right;"><button class="lightBTN" id="rmAccessPolicy_${i}">Remove AP</button></td>
        </tr>`;

        requestAnimationFrame(() => {
            // DOM updates applied
            if(dashboardData.pnode_full_info.pnodeActivenessState == true) {
                disableButton(`rmAccessPolicy_${i}`);
            }

            document.getElementById(`rmAccessPolicy_${i}`).addEventListener('click', () => {
                document.getElementById('fullScreenLoadingZone').style.display = 'flex';
                fspCommunicationScript.PNodeInsertETHAccessPolicy(dashboardData.pnode_full_info.pnode_id, '', dashboardData.pnodeETHAccessPolicies[i].access_policy_type, dashboardData.pnodeETHAccessPolicies[i].access_policy_index_id, _ppoolID, _pgridID);
            });
        });
    }
}

//#endregion NETWORK ACCESS POLICIES

//#region FSP LOGIN AUDITS

//=========================================================================================
/**
 * This function shows the pnode's FSP login logs, distingushing successful from failed login attempts.
*/
//=========================================================================================
function displayPNodesLoginAudits(dashboardData)
{
    document.getElementById("_pnodeLoginAuditsCount").innerText = dashboardData.pnodeLoginAudits.length;
    for(let i = 0; i < dashboardData.pnodeLoginAudits.length; i++){
        const BKG = dashboardData.pnodeLoginAudits[i].login_audit_login_status == 'SUCCESS' ? 'rgba(34,197,94,0.08)' : 'rgba(255,165,0,0.08)';
        const textColor = dashboardData.pnodeLoginAudits[i].login_audit_login_status == 'SUCCESS' ? 'var(--success)' : '#ff9f43';
        const tableRow = `<tr>
                            <td>LOG-${dashboardData.pnodeLoginAudits[i].login_audit_id}</td>
                            <td>${dashboardData.pnodeLoginAudits[i].login_audit_fsp_user}</td>
                            <td>${dashboardData.pnodeLoginAudits[i].login_audit_datetime}</td>
                            <td><span class="state-pill" style="background:${BKG};color:${textColor}">${dashboardData.pnodeLoginAudits[i].login_audit_login_status}</span></td>
                            <td>${dashboardData.pnodeLoginAudits[i].login_audit_location}</td>
                        </tr>`
        document.getElementById("_pnodeLoginAuditsLogs").innerHTML += tableRow;
    }
}

//#endregion FSP LOGIN AUDITS

//#region OPERATION HISTORY

//=========================================================================================
/**
 * This function shows the history of all operations performed on the pnode via POWERENV's web interface.
*/
//=========================================================================================
function displayPNodesOperationHistory(dashboardData)
{
    document.getElementById("_pnodeOperationLogsCount").innerText = dashboardData.pnodeSingleOperationHistory.length;
    for(let i = 0; i < dashboardData.pnodeSingleOperationHistory.length; i++){
        const operationCompletionStatusBKG = dashboardData.pnodeSingleOperationHistory[i].operationCompletionStatus == 'SUCCESS' ? 'rgba(34,197,94,0.08)' : 'rgba(255,165,0,0.08)';
        const operationCompletionStatusTextColor = dashboardData.pnodeSingleOperationHistory[i].operationCompletionStatus == 'SUCCESS' ? 'var(--success)' : '#ff9f43';
        const tableRow = `<tr>
                            <td>LOG-${dashboardData.pnodeSingleOperationHistory[i].operationID}</td>
                            <td>${dashboardData.pnodeSingleOperationHistory[i].operationCatName}</td>
                            <td>${dashboardData.pnodeSingleOperationHistory[i].operationBatchOperationName}</td>
                            <td>${dashboardData.pnodeSingleOperationHistory[i].operationAction}</td>
                            <td><span class="state-pill" style="background:${operationCompletionStatusBKG}; color:${operationCompletionStatusTextColor}">${dashboardData.pnodeSingleOperationHistory[i].operationCompletionStatus}</span></td>
                            <td>${dashboardData.pnodeSingleOperationHistory[i].operationDateTime}</td>
                            <td>${dashboardData.pnodeSingleOperationHistory[i].operationSourceUserName}</td>
                        </tr>`
        document.getElementById("_pnodesOperationLogs").innerHTML += tableRow;
    }
}

//#endregion FSP LOGIN AUDITS

//#region FSP ERROR LOGS

//=========================================================================================
/**
 * This function shows all pnode's error logs, providing detailed information for each log in a side panel.
*/
//=========================================================================================
function displayPNodesErrorLogs(dashboardData)
{
    document.getElementById("_pnodeErrorLogsOverviewCount").innerText = dashboardData.pnodeErrorLogs.length;

    for(let i = 0; i < dashboardData.pnodeErrorLogs.length; i++){
        let actionFlags = "";
        let eventSeverityBadges = "";

        for(let j = 0; j < dashboardData.pnodeErrorLogs[i].actionFlags.length - 1; j++){
            actionFlags += `${dashboardData.pnodeErrorLogs[i].actionFlags[j]} | `;
        }

        actionFlags += `${dashboardData.pnodeErrorLogs[i].actionFlags[dashboardData.pnodeErrorLogs[i].actionFlags.length - 1]}`;

        const eventSeverityFlagsArray = dashboardData.pnodeErrorLogs[i].eventSeverity.split(', ');

        for(let j = 0; j < eventSeverityFlagsArray.length; j++){
            eventSeverityBadges += `<span class="state-pill" style="background:rgba(255,165,0,0.08); color: #ff9f43">${eventSeverityFlagsArray[j]}</span>`;
        }

        const tableRow = `<tr id="ErrorLogRow-${i}">
                            <td>${dashboardData.pnodeErrorLogs[i].errorLogID}</td>
                            <td>${dashboardData.pnodeErrorLogs[i].logDate} ${dashboardData.pnodeErrorLogs[i].logTime}</td>
                            <td>${dashboardData.pnodeErrorLogs[i].driverName}</td>
                            <td>${dashboardData.pnodeErrorLogs[i].subsystem}</td>
                            <td>${eventSeverityBadges}</td>
                            <td>${actionFlags}</td>
                            <td>${dashboardData.pnodeErrorLogs[i].actionStatus}</td>
                            <td>${dashboardData.pnodeErrorLogs[i].referenceCode}</td>
                        </tr>`
        document.getElementById("_pnodeErrorLogs").insertAdjacentHTML("beforeend", tableRow);

        requestAnimationFrame(() => {
            const currentLine = document.getElementById(`ErrorLogRow-${i}`);
            currentLine.addEventListener('click', () => {
                const errorLogDetailsSidePanel = new pnodeEditors.configurationEditWizzard('Error Log Details', dashboardData, null);
                errorLogDetailsSidePanel.insertInputField('errorLogID', 'ID:', '<empty>', currentLine.children[0].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogDateTime', 'DateTime:', '<empty>', currentLine.children[1].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogDriverName', 'Driver Name:', '<empty>', currentLine.children[2].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogSubsystem', 'Subsystem:', '<empty>', currentLine.children[3].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogEventSeverity', 'Event Severity:', '<empty>', currentLine.children[4].firstElementChild.innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogActionFlags', 'Action Flags:', '<empty>', currentLine.children[5].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogActionStatus', 'Action Status:', '<empty>', currentLine.children[6].innerHTML);
                errorLogDetailsSidePanel.insertInputField('errorLogReferenceCode', 'Reference Code:', '<empty>', currentLine.children[7].innerHTML);
                errorLogDetailsSidePanel.insertTextArea('errorLogRawData', 'Raw Data', '<empty>', dashboardData.pnodeErrorLogs[i].rawData, '500px');
            });
        });
    }
}

//#endregion FSP ERROR LOGS
//#endregion PNODES