import * as pgridDataDisplayScript from  "./pgrid_data_display_script.js"
import * as ppoolDataDisplayScript from  "./ppool_data_display_script.js"
import * as pnodeDataDisplayScript from  "./pnode_data_display_script.js"

var tree = {
    objName: "",
    tag: "",
    state: "",
    children: []
}

// #region dataDisplayMethods

export function openHardwareSection(event){
    switchSection('hardware.html', event);
    pgridDataDisplayScript.displayPGridsList();
}

window.openHardwareSection = openHardwareSection;

export function displayPGridTreeStructureInfo(dashboardData)
{
    document.getElementById("grid-tree").innerHTML += `<div class="nav-item" id="treePGridObj" state="open">
        <i id="treePGridObj-Chevron" class="fa-solid fa-chevron-down"></i>
        <div>
            <span>${dashboardData.pgridFullInfo.pgrid_name}</span>
            <span class="state-pill" style="background:rgba(255,206,84,0.06);color:#ffd166">PGrid</span>
        </div>
    </div>`;

    requestAnimationFrame(() => {
        document.getElementById("treePGridObj-Chevron").addEventListener('click', () => {
            toggleTreeBreadcrumb('treePGridObj', tree);
        });
        document.getElementById("treePGridObj").getElementsByTagName('div')[0].addEventListener('click', (e) => {
            pgridDataDisplayScript.displayPGridDashboardData(dashboardData.pgridFullInfo.pgrid_id.substring(3), e, false)
        });
    });

    tree.objName = "treePGridObj";
    tree.tag = "grid";
    tree.state = "opened"

    for(let i = 0; i < dashboardData.ppoolsInfoList.length; i++){
        document.getElementById("grid-tree").innerHTML += `<div class="nav-item" id="treePPool-${i}">
            <i id="treePPool-${i}-Chevron" class="fa-solid fa-chevron-right" style="margin-left: 10px;"></i>
            <div style="margin-left: 10px;">
                <span>${dashboardData.ppoolsInfoList[i].ppool_name}</span>
                <span class="state-pill" style="background:rgba(255,206,84,0.06);color:#ffd166">PPool</span>
            </div>
        </div>`;

        requestAnimationFrame(() => {
            document.getElementById(`treePPool-${i}-Chevron`).addEventListener('click', () => {
                toggleTreeBreadcrumb(`treePPool-${i}`, tree);
            });
            document.getElementById(`treePPool-${i}`).getElementsByTagName('div')[0].addEventListener('click', (e) => {
                ppoolDataDisplayScript.displayPPoolDashboardData(dashboardData.pgridFullInfo.pgrid_id.substring(3), dashboardData.ppoolsInfoList[i].ppoolID, e)
            });
        });

        let treePool = {
            objName: `treePPool-${i}`,
            tag: "pool",
            state: "closed",
            children: []
        }
        
        for(let j = 0; j < dashboardData.ppoolsInfoList[i].pnodesList.length; j++){
            document.getElementById("grid-tree").innerHTML += `<div class="nav-item" id="treePPool-${i}-PNode${j}" style="display: none;">
                <i id="treePPool-${i}-PNode${j}-Chevron" class="fa-solid fa-chevron-right" style="margin-left: 30px;"></i>
                <div style="margin-left: 30px;">
                    <span>${dashboardData.ppoolsInfoList[i].pnodesList[j].pnodeName}</span>
                    <span class="state-pill" style="background:rgba(255,206,84,0.06); color:#ffd166">PNode</span>
                </div>
            </div>`;

            requestAnimationFrame(() => {
                document.getElementById(`treePPool-${i}-PNode${j}-Chevron`).addEventListener('click', () => {
                    toggleTreeBreadcrumb(`treePPool-${i}-PNode${j}`, tree);
                });
                document.getElementById(`treePPool-${i}-PNode${j}`).addEventListener('click', (e) => {
                    pnodeDataDisplayScript.displayPNodesDashboardData(dashboardData.pgridFullInfo.pgrid_id.substring(3), dashboardData.ppoolsInfoList[i].ppoolID, dashboardData.ppoolsInfoList[i].pnodesList[j].pnodeID, e)
                });
            });

            treePool.children[j] = {
                objName: `treePPool-${i}-PNode${j}`,
                tag: "node",
                state: "closed",
                children: []
            }
        }

        tree.children[i] = treePool;
    }
}


// #endregion dataDisplayMethods

// #region dataDOMElementsControlMethods

function toggleTreeBreadcrumb(id, currTreeNode)
{
    if(currTreeNode.objName != id){
        for(let i = 0; i < currTreeNode.children.length; i++){
            toggleTreeBreadcrumb(id, currTreeNode.children[i]);
        }
    }
    else
    {
        const _newVisibility = currTreeNode.state == "opened" ? "none" : "flex";
        document.getElementById(`${currTreeNode.objName}-Chevron`).classList = _newVisibility == "flex" ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right";
        toggleTreeBreadcrumbChildrenVisibility(currTreeNode, _newVisibility);
    }
}

function toggleTreeBreadcrumbChildrenVisibility(currTreeNode, _visibility)
{
    document.getElementById(`${currTreeNode.objName}-Chevron`).classList = _visibility == "flex" ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right";
    for(let i = 0; i < currTreeNode.children.length; i++){
        document.getElementById(currTreeNode.children[i].objName).style = `display: ${_visibility};`;        

        if(currTreeNode.children[i].children.length != 0 && _visibility == "none"){
            toggleTreeBreadcrumbChildrenVisibility(currTreeNode.children[i], _visibility);
        }
    }
    currTreeNode.state = _visibility == "flex" ? "opened" : "closed";
}

export function updateActiveTreeNode(_nodeName_)
{
    const treeNodes = document.getElementById("grid-tree").children;
    for(let i = 0; i < treeNodes.length; i++){
        treeNodes[i].classList.remove("active");
    }
    for(let i = 0; i < treeNodes.length; i++){
        const nodeName = treeNodes[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerText;
        if(nodeName == _nodeName_){
            treeNodes[i].classList.add("active");
            break;
        }
    }
}

// #endregion dataDOMElementsControlMethods