import * as mainScript from "./data_handling_main_script.js"
import * as dataRetrievalScript from "./data_retrieval_script.js"
import * as pgridDataDisplayScript from  "./pgrid_data_display_script.js"
import * as pnodeDataDisplayScript from  "./pnode_data_display_script.js"

//#region PPOOLS

export async function displayPPoolDashboardData(pgridID, ppoolID, e)
{
    let dashboardData = await dataRetrievalScript.getPPoolDashboardData(pgridID, ppoolID);
    await switchCustomSection('ppool_mgmt.html', 'content', 'content');
    document.getElementById('content').scrollTop = 0;

    displayPPoolMainInfo(dashboardData, pgridID, e);
    resetElementEventListeners('_singleOperationBTN');

    //Assign Event Listeners to single/batch Operations View Switch Buttons
    document.getElementById('_singleOperationBTN').addEventListener('click', () => {
        toggleSingleNBatchOperationsTableView('_singleOperationBTN')
    });
    document.getElementById('_batchOperationBTN').addEventListener('click', () => {
        toggleSingleNBatchOperationsTableView('_batchOperationBTN')
    });

    //Make the current PNode the active node in the navigation tree
    mainScript.updateActiveTreeNode(dashboardData.ppoolFullInfo.ppool_name);

    document.getElementById("_hardware_link").classList.add('active');
    document.getElementById("_backToGridBTN").addEventListener("click", async () => {
        await pgridDataDisplayScript.displayPGridDashboardData(pgridID, e, false);
    });

    displayPPoolsPnodesListInfo(dashboardData);
    displayPPoolPNodesLoginAudits(dashboardData);
    displayPPoolAttentionLEDMarkedPNodes(dashboardData);
    displayPPoolErrorLogsInfo(dashboardData);
    displayPPoolOperationHistory(dashboardData);
}

function displayPPoolMainInfo(dashboardData, _pgridID, e)
{
    document.getElementById("_ppoolName").innerText = dashboardData.ppoolFullInfo.ppool_name;
    document.getElementById("_propsPPoolName").innerText = dashboardData.ppoolFullInfo.ppool_name;
    document.getElementById("_propsPPoolID").innerText = dashboardData.ppoolFullInfo.ppool_id;
    document.getElementById("_propsPPoolParentPGridName").innerText = dashboardData.ppoolFullInfo.ppool_parent_pgrid_name;
    document.getElementById("_propsPPoolCreationDatetime").innerText = dashboardData.ppoolFullInfo.ppool_creation_datetime;
    document.getElementById("_propsPPoolLastUpdateDatetime").innerText = dashboardData.ppoolFullInfo.ppool_last_update_datetime;
    document.getElementById("_propsPPoolTag").innerText = dashboardData.ppoolFullInfo.ppool_tag;
    document.getElementById("_propsPPoolPNodesCount").innerText = dashboardData.ppoolFullInfo.ppool_pnodes_count;
    document.getElementById("_propsPPoolActivePNodesCount").innerText = dashboardData.ppoolFullInfo.ppool_active_pnodes_count;
    document.getElementById("_pnodeReadmeTextParagraph").innerText = dashboardData.ppoolFullInfo.ppool_readme_text;
    document.getElementById("reloadSettingsBTN").addEventListener("click", async () => {
        await displayPPoolDashboardData(_pgridID, dashboardData.ppoolFullInfo.ppool_id, e);
    });
}

function displayPPoolsPnodesListInfo(dashboardData)
{
    for(let i = 0; i < dashboardData.ppoolPNodesFullList.length; i++){
        document.getElementById("pnodesNoDeviceSelectedWarning").style = "display: none;";
        const gridTile = `<div class="tile" id="PNode-${i}">
                                <div class="tile-header">
                                    <img class="tile-icon" style="width: 50%;" src="fontawesome-free-7.0.0-web\\fontawesome-free-7.0.0-web\\svgs\\solid\\server.svg" />
                                    <h3>${dashboardData.ppoolPNodesFullList[i].pnodeName}</h3>
                                </div>
                                <div class="tile-props">
                                    <p><strong>Logical Partitions:</strong> ${dashboardData.ppoolPNodesFullList[i].pnodeLparsCount}</p>
                                </div>
                            </div>`
        document.getElementById("_ppoolPNodesTiledList").innerHTML += gridTile;

        requestAnimationFrame((e) => {
            document.getElementById(`PNode-${i}`).addEventListener('click', (e) => {
                pnodeDataDisplayScript.displayPNodesDashboardData(dashboardData.ppoolPNodesFullList[i].pnodeID, dashboardData.ppoolFullInfo.ppool_id, 1, e);
            });
        });
    }
}

function displayPPoolPNodesLoginAudits(dashboardData)
{
    document.getElementById("_ppoolPnodesLoginAuditsCount").innerText = dashboardData.ppoolLoginAudits.length;
    for(let i = 0; i < dashboardData.ppoolLoginAudits.length; i++){
        const tableRow = `<tr>
                            <td>LOG-${dashboardData.ppoolLoginAudits[i].login_audit_id}</td>
                            <td>${dashboardData.ppoolLoginAudits[i].login_audit_pnode_nickname}</td>
                            <td>${dashboardData.ppoolLoginAudits[i].login_audit_fsp_user}</td>
                            <td>${dashboardData.ppoolLoginAudits[i].login_audit_datetime}</td>
                            <td><span class="state-pill" style="background:rgba(34,197,94,0.08);color:var(--success)">${dashboardData.ppoolLoginAudits[i].login_audit_login_status}</span></td>
                            <td>${dashboardData.ppoolLoginAudits[i].login_audit_location}</td>
                        </tr>`
        document.getElementById("_ppoolLoginAuditsLogs").innerHTML += tableRow;
    }
}

function displayPPoolAttentionLEDMarkedPNodes(dashboardData)
{
    document.getElementById("_ppoolAttentionLedSignedNodesCount").innerText = dashboardData.ppoolAttentionLEDMarkedPNodes.length;
    for(let i = 0; i < dashboardData.ppoolAttentionLEDMarkedPNodes.length; i++){
        const tableRow = `<tr>
                            <td>
                                <span class="state-pill" style="background:rgba(255,206,84,0.06);color:#ffd166">
                                    LOG-${dashboardData.ppoolAttentionLEDMarkedPNodes[i].pnode_nickname}
                                </span>
                            </td>
                        </tr>`
        document.getElementById("_ppoolAttentionLedSignedNodesList").innerHTML += tableRow;
    }
}

function displayPPoolErrorLogsInfo(dashboardData)
{
    document.getElementById("_ppoolPnodesErrorLogsOverviewCount").innerText = dashboardData.ppoolErrorLogs.length;

    for(let i = 0; i < dashboardData.ppoolErrorLogs.length; i++)
    {
        let ActionFlags = "";
        for(let j = 0; j < dashboardData.ppoolErrorLogs[i].actionFlags.length; j++)
        {
            ActionFlags += j == 0 ? `${dashboardData.ppoolErrorLogs[i].actionFlags[j]}` : `, ${dashboardData.ppoolErrorLogs[i].actionFlags[j]}`
        }

        const tableRow = `<tr>
                            <td>${dashboardData.ppoolErrorLogs[i].errorLogID}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].pNodeNickname}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].pPoolName}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].logDate} ${dashboardData.ppoolErrorLogs[i].LogTime}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].driverName}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].subsystem}</td>
                            <td><span class="state-pill" style="background:rgba(255,159,67,0.06);color:#ff9f43">${dashboardData.ppoolErrorLogs[i].eventSeverity}</span></td>
                            <td>${ActionFlags}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].actionStatus}</td>
                            <td>${dashboardData.ppoolErrorLogs[i].referenceCode}</td>
                        </tr>`
        document.getElementById("_ppoolErrorLogs").innerHTML += tableRow;
    }
}

function displayPPoolPNodesSingleOperationHistory(dashboardData)
{
    let ppoolOperationLogsData = dashboardData.ppoolOperationLogs;

    document.getElementById("_ppoolPNodesSingleOperationLogsCount").innerText = ppoolOperationLogsData.pnodesSingleOperationHistory.length;
    for(let i = 0; i< ppoolOperationLogsData.pnodesSingleOperationHistory.length; i++){
        let completionStatusBadgeBKG = ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationCompletionStatus == "SUCCESS" ? "rgba(34,197,94,0.08)" : "rgba(255,159,67,0.06)";
        let completionStatusBadgeTextColor = ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationCompletionStatus == "SUCCESS" ? "var(--success)" : "#ff9f43";
        
        document.getElementById("_ppoolPNodesSingleOperationLogs").innerHTML += `<tr>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationID}</td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationCatName}</td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationSourcePNodeName}</td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationBatchOperationName}</td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationAction}</td>
                            <td><span class="state-pill" style="background:${completionStatusBadgeBKG};color:${completionStatusBadgeTextColor}">${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationCompletionStatus}</span></td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationDateTime}</td>
                            <td>${ppoolOperationLogsData.pnodesSingleOperationHistory[i].operationSourceUserName}</td>
                        </tr>`;
    }
}

function displayPPoolBatchOperationHistory(dashboardData)
{
    let ppoolOperationLogsData = dashboardData.ppoolOperationLogs;
    
    document.getElementById("_ppoolBatchOperationLogsCount").innerText = ppoolOperationLogsData.ppoolsBatchOperationHistory.length;
    for(let i = 0; i< ppoolOperationLogsData.ppoolsBatchOperationHistory.length; i++){
        document.getElementById("_ppoolBatchOperationLogs").innerHTML += `<tr>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationID}</td>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationCatName}</td>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationSourcePPoolName}</td>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationAction}</td>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationDateTime}</td>
                            <td>${ppoolOperationLogsData.ppoolsBatchOperationHistory[i].batchOperationSourceUserName}</td>
                        </tr>`;
    }
}

function displayPPoolOperationHistory(dashboardData)
{
    displayPPoolPNodesSingleOperationHistory(dashboardData);
    displayPPoolBatchOperationHistory(dashboardData);
}

function toggleSingleNBatchOperationsTableView(_clickedBTNID)
{
    switch(_clickedBTNID){
        case '_singleOperationBTN':
            document.getElementById("ppoolPNodesSingleOperationHistory").style.display = 'block';
            document.getElementById("ppoolBatchOperationHistory").style.display = 'none';
            break;
        case '_batchOperationBTN':
            document.getElementById("ppoolBatchOperationHistory").style.display = 'block';
            document.getElementById("ppoolPNodesSingleOperationHistory").style.display = 'none';
            break;
    }
    
    toggle2SideBTN(['_singleOperationBTN', '_batchOperationBTN'], _clickedBTNID);
}

//#endregion PPOOLS