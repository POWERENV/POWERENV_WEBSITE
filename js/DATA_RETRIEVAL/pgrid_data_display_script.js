import * as mainScript from "./data_handling_main_script.js"
import * as dataRetrievalScript from "./data_retrieval_script.js"
import * as ppoolDataDisplayScript from  "./ppool_data_display_script.js"

// #region PGRIDS

export async function displayPGridsList()
{
    let dashboardData = await dataRetrievalScript.getPGridsInfoList();

    for(let i = 0; i < dashboardData.length; i++){
        document.getElementById("pgridsNoDeviceSelectedWarning").style = "display: none;";
        document.getElementById("pgridsListTileGrid").innerHTML += `<div class="tile" id="PGrid-${i}">
            <div class="tile-header">
                <img class="tile-icon" src="fontawesome-free-7.0.0-web\\fontawesome-free-7.0.0-web\\svgs\\solid\\hexagon-nodes-bolt.svg" />
                <h3>${dashboardData[i].pgrid_name}</h3>
            </div>
            <div class="tile-props">
                <p><strong>PPools:</strong> ${dashboardData[i].pgrid_ppools_count}</p>
                <p><strong>PNodes:</strong> ${dashboardData[i].pgrid_pnodes_count}</p>
            </div>
        </div>`;
        
        requestAnimationFrame(() => {
            document.getElementById(`PGrid-${i}`).addEventListener('click', (e) => {
                displayPGridDashboardData(dashboardData[i].pgrid_id, e, true);
            });
        });
    }
    //Finish this method: list pgrids as rects on the tiled-grid in the hardware section
}

export async function displayPGridDashboardData(pgridID, e, generateWholeContent)
{
    let dashboardData = await dataRetrievalScript.getPGridDashboardData(pgridID);

    if(generateWholeContent == true){
        await switchCustomSection('pgrid_mgmt.html', 'main-content', '_body_');
    }
    else{
        await switchCustomSection('pgrid_mgmt.html', 'content', 'content');
        document.getElementById('content').scrollTop = 0;
    }
    

    displayPGridMainInfo(dashboardData, e);

    document.getElementById("_hardware_link").classList.add('active');

    displayPGridAccessPoliciesInfo(dashboardData);
    displayPGridAccessAuditsInfo(dashboardData);
    displayPGridLoginAuditsInfo(dashboardData);
    displayPGridErrorLogsInfo(dashboardData);
    displayPGridAttentionLedMarkedPNodesInfo(dashboardData);
    displayPGridPPoolsListInfo(dashboardData);
    if(generateWholeContent == true) mainScript.displayPGridTreeStructureInfo(dashboardData);
    mainScript.updateActiveTreeNode(dashboardData.pgridFullInfo.pgrid_name);
}

function displayPGridMainInfo(dashboardData, e)
{
    document.getElementById("_pgridName").innerText = dashboardData.pgridFullInfo.pgrid_name;
    document.getElementById("_propsPGridName").innerText = dashboardData.pgridFullInfo.pgrid_name;
    document.getElementById("_propsPGridID").innerText = dashboardData.pgridFullInfo.pgrid_id;
    document.getElementById("_propsPGridOwnerNameLink").innerText = dashboardData.pgridFullInfo.pgrid_owner;
    document.getElementById("_propsPGridPPoolsCount").innerText = dashboardData.pgridFullInfo.pgrid_ppools_count;
    document.getElementById("_propsPGridPNodesCount").innerText = dashboardData.pgridFullInfo.pgrid_pnodes_count;
    document.getElementById("_propsPGridActivePNodesCount").innerText = dashboardData.pgridFullInfo.pgrid_active_pnodes_count;
    document.getElementById("_propsPGridCreationDatetime").innerText = dashboardData.pgridFullInfo.pgrid_creation_datetime;
    document.getElementById("_propsPGridLastUpdateDatetime").innerText = dashboardData.pgridFullInfo.pgrid_last_update_datetime;
    document.getElementById("reloadSettingsBTN").addEventListener("click", async () => {
        await displayPGridDashboardData(dashboardData.pgridFullInfo.pgrid_id.substring(3), e);
    });
}

function displayPGridAccessPoliciesInfo(dashboardData)
{
    for(let i = 0; i < dashboardData.accessPolicies.length; i++)
    {
        const tableRow = `<tr>
                            <td>AP-${dashboardData.accessPolicies[i].access_policy_id}</td>
                            <td>${dashboardData.accessPolicies[i].access_policy_creation_datetime}</td>
                            <td>${dashboardData.accessPolicies[i].access_policy_last_update_datetime}</td>
                            <td>${dashboardData.accessPolicies[i].access_policy_pgrid_name}</td>
                            <td><a class="link" href="#">${dashboardData.accessPolicies[i].access_policy_target_username}</a></td>
                            <td><span class="state-pill" style="background:rgba(34,197,94,0.08);color:var(--success)">${dashboardData.accessPolicies[i].access_policy_permission_level}</span></td>
                            <td>True</td>
                        </tr>`
        document.getElementById("_pgridAccessPoliciesLogs").innerHTML += tableRow;
    }
}

function displayPGridAccessAuditsInfo(dashboardData)
{
    document.getElementById("_pgridAccessAuditsCount").innerText = dashboardData.accessAudits.length;

    for(let i = 0; i < dashboardData.accessAudits.length; i++)
    {
        const tableRow = `<tr>
                            <td>LOG-${dashboardData.accessAudits[i].access_audit_id}</td>
                            <td>${dashboardData.accessAudits[i].access_audit_datetime}</td>
                            <td>${dashboardData.accessAudits[i].access_audit_performed_by_username}</td>
                        </tr>`
        document.getElementById("_pgridAccessAuditsLogs").innerHTML += tableRow;
    }
}

function displayPGridLoginAuditsInfo(dashboardData)
{
    document.getElementById("_pgridPnodesLoginAuditsCount").innerText = dashboardData.pnodesLoginAudits.length;

    for(let i = 0; i < dashboardData.pnodesLoginAudits.length; i++)
    {
        const tableRow = `<tr>
                            <td>LOG-${dashboardData.pnodesLoginAudits[i].login_audit_id}</td>
                            <td>${dashboardData.pnodesLoginAudits[i].login_audit_pnode_nickname}</td>
                            <td>${dashboardData.pnodesLoginAudits[i].login_audit_pnode_ppool_name}</td>
                            <td>${dashboardData.pnodesLoginAudits[i].login_audit_fsp_user}</td>
                            <td>${dashboardData.pnodesLoginAudits[i].login_audit_datetime}</td>
                            <td><span class="state-pill" style="background:rgba(34,197,94,0.08);color:var(--success)">${dashboardData.pnodesLoginAudits[i].login_audit_login_status}</span></td>
                            <td>${dashboardData.pnodesLoginAudits[i].login_audit_location}</td>
                        </tr>`
        document.getElementById("_pgridLoginAuditsLogs").innerHTML += tableRow;
    }
}

function displayPGridErrorLogsInfo(dashboardData)
{
    document.getElementById("_pgridPnodesErrorLogsOverviewCount").innerText = dashboardData.pnodesErrorLogs.length;

    for(let i = 0; i < dashboardData.pnodesErrorLogs.length; i++)
    {
        let ActionFlags = "";
        for(let j = 0; j < dashboardData.pnodesErrorLogs[i].actionFlags.length; j++)
        {
            ActionFlags += j == 0 ? `${dashboardData.pnodesErrorLogs[i].actionFlags[j]}` : `, ${dashboardData.pnodesErrorLogs[i].actionFlags[j]}`
        }

        const tableRow = `<tr>
                            <td>${dashboardData.pnodesErrorLogs[i].errorLogID}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].pNodeNickname}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].pPoolName}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].logDate} ${dashboardData.pnodesErrorLogs[i].LogTime}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].driverName}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].subsystem}</td>
                            <td><span class="state-pill" style="background:rgba(255,159,67,0.06);color:#ff9f43">${dashboardData.pnodesErrorLogs[i].eventSeverity}</span></td>
                            <td>${ActionFlags}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].actionStatus}</td>
                            <td>${dashboardData.pnodesErrorLogs[i].referenceCode}</td>
                        </tr>`
        document.getElementById("_pgridErrorLogs").innerHTML += tableRow;
    }
}

function displayPGridAttentionLedMarkedPNodesInfo(dashboardData)
{
    document.getElementById("_pgridAttentionLedSignedNodesCount").innerText = dashboardData.attentionLEDMarkedPNodes.length;
    
    for(let i = 0; i < dashboardData.attentionLEDMarkedPNodes.length; i++){
        const tableRow = `<tr>
                            <td>${dashboardData.attentionLEDMarkedPNodes[i].pnode_nickname}</td>
                            <td>${dashboardData.attentionLEDMarkedPNodes[i].ppool_name}</td>
                        </tr>`
        document.getElementById("_pgridAttentionLedSignedNodesList").innerHTML += tableRow;
    }
}

function displayPGridPPoolsListInfo(dashboardData)
{
    for(let i = 0; i < dashboardData.ppoolsInfoList.length; i++){
        document.getElementById("ppoolsNoDeviceSelectedWarning").style = "display: none;";
        const gridTile = `<div class="tile" id="PPool-${i}" onclick="">
                                <div class="tile-header">
                                    <img class="tile-icon" src="fontawesome-free-7.0.0-web\\fontawesome-free-7.0.0-web\\svgs\\solid\\circle-nodes.svg" />
                                    <h3>${dashboardData.ppoolsInfoList[i].ppool_name}</h3>
                                </div>
                                <div class="tile-props">
                                    <p><strong>PNodes:</strong> ${dashboardData.ppoolsInfoList[i].ppoolPnodesCount}</p>
                                </div>
                            </div>`
        document.getElementById("_pgridPNodesTiledList").innerHTML += gridTile;

        requestAnimationFrame((e) => {
            document.getElementById(`PPool-${i}`).addEventListener('click', (e) => {
                ppoolDataDisplayScript.displayPPoolDashboardData(dashboardData.pgridFullInfo.pgrid_id.substring(3), dashboardData.ppoolsInfoList[i].ppoolID, e);
            });
        });
    }
}

// #endregion PGRIDS