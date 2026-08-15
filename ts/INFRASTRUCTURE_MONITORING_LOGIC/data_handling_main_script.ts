import * as genericScript from "../scripting.js";
import * as pgridDataDisplayScript from  "./PGRID/pgrid_data_display_script.js"
import * as ppoolDataDisplayScript from  "./PPOOL/ppool_data_display_script.js"
import * as pnodeDataDisplayScript from  "./PNODE/pnode_data_display_script.js"
import * as dataRetrievalScript from "./data_retrieval_script.js"
import * as userDataRetrieval from "../USER_LOGIC/user_data_retrieval_script.js"
import * as typeDefinitions from "../types.js"

var tree = new typeDefinitions.navigationTreeNode("", "", "", []);

// #region dataDisplayMethods

export function displayPGridTreeStructureInfo(dashboardData : typeDefinitions.PGridDashboardData)
{
    document.getElementById("grid-tree")!.innerHTML += `<div class="nav-item" id="treePGridObj" state="open">
        <i id="treePGridObj-Chevron" class="fa-solid fa-chevron-down"></i>
        <div>
            <span>${dashboardData.pgridFullInfo.pgrid_name}</span>
            <span class="state-pill" style="background:rgba(255,206,84,0.06);color:#ffd166">PGrid</span>
        </div>
    </div>`;

    requestAnimationFrame(() => {
        document.getElementById("treePGridObj-Chevron")!.addEventListener('click', () => {
            toggleTreeBreadcrumb('treePGridObj', tree);
        });
        document.getElementById("treePGridObj")!.getElementsByTagName('div')[0]!.addEventListener('click', (e) => {
            pgridDataDisplayScript.displayPGridDashboardData(Number(dashboardData.pgridFullInfo.pgrid_id.substring(3)), e, false)
        });
    });

    tree.objName = "treePGridObj";
    tree.tag = "grid";
    tree.state = "opened"

    if(dashboardData.ppoolsInfoList.length == 0) {
        document.getElementById("grid-tree")!.innerHTML += `<div class="nav-item" id="treePPool-0">
            <div style="margin-left: 10px;">
                <span>Empty list</span>
            </div>
        </div>`;
    }

    for(let i = 0; i < dashboardData.ppoolsInfoList.length; i++){
        document.getElementById("grid-tree")!.innerHTML += `<div class="nav-item" id="treePPool-${i}">
            <i id="treePPool-${i}-Chevron" class="fa-solid fa-chevron-right" style="margin-left: 10px;"></i>
            <div style="margin-left: 10px;">
                <span>${dashboardData.ppoolsInfoList[i]!.ppool_name}</span>
                <span class="state-pill" style="background:rgba(255,206,84,0.06);color:#ffd166">PPool</span>
            </div>
        </div>`;

        requestAnimationFrame(() => {
            document.getElementById(`treePPool-${i}-Chevron`)!.addEventListener('click', () => {
                toggleTreeBreadcrumb(`treePPool-${i}`, tree);
            });
            document.getElementById(`treePPool-${i}`)!.getElementsByTagName('div')[0]!.addEventListener('click', (e) => {
                ppoolDataDisplayScript.displayPPoolDashboardData(Number(dashboardData.pgridFullInfo.pgrid_id.substring(3)), dashboardData.ppoolsInfoList[i]!.ppoolID, e);
            });
        });

        let treePool = new typeDefinitions.navigationTreeNode(`treePPool-${i}`, "pool", "closed", []);

        if(dashboardData.ppoolsInfoList[i]!.pnodesList.length == 0) {
            document.getElementById("grid-tree")!.innerHTML += `<div class="nav-empty-item" id="treePPool-${i}-PNode0" style="display: none;">
                <div style="margin-left: 30px;">
                    <span>Empty list</span>
                </div>
            </div>`;

            treePool.children[0] = new typeDefinitions.navigationTreeNode(
                `treePPool-${i}-PNode0`,
                "node",
                "closed",
                []
            );
        }
        
        for(let j = 0; j < dashboardData.ppoolsInfoList[i]!.pnodesList.length; j++){
            document.getElementById("grid-tree")!.innerHTML += `<div class="nav-item" id="treePPool-${i}-PNode${j}" style="display: none;">
                <i id="treePPool-${i}-PNode${j}-Chevron" class="fa-solid fa-chevron-right" style="margin-left: 30px;"></i>
                <div style="margin-left: 30px;">
                    <span>${dashboardData.ppoolsInfoList[i]!.pnodesList[j]!.pnodeName}</span>
                    <span class="state-pill" style="background:rgba(255,206,84,0.06); color:#ffd166">PNode</span>
                </div>
            </div>`;

            requestAnimationFrame(() => {
                document.getElementById(`treePPool-${i}-PNode${j}-Chevron`)!.addEventListener('click', () => {
                    toggleTreeBreadcrumb(`treePPool-${i}-PNode${j}`, tree);
                });
                document.getElementById(`treePPool-${i}-PNode${j}`)!.addEventListener('click', (e) => {
                    pnodeDataDisplayScript.displayPNodesDashboardData(dashboardData.ppoolsInfoList[i]!.pnodesList[j]!.pnodeID, dashboardData.ppoolsInfoList[i]!.ppoolID, Number(dashboardData.pgridFullInfo.pgrid_id.substring(3)));
                });
            });

            let treeNode = new typeDefinitions.navigationTreeNode(
                `treePPool-${i}-PNode${j}`,
                "node",
                "closed",
                []
            );

            document.getElementById("grid-tree")!.innerHTML += `<div class="nav-empty-item" id="treePPool-${i}-PNode${j}-LPAR0" style="display: none;">
                <div style="margin-left: 50px;">
                    <span>Empty list</span>
                </div>
            </div>`;

            treeNode.children[0] = new typeDefinitions.navigationTreeNode(
                `treePPool-${i}-PNode${j}-LPAR0`,
                "lpar",
                "closed",
                []
            );

            treePool.children[j] = treeNode;
        }

        tree.children[i] = treePool;
    }
}


// #endregion dataDisplayMethods

// #region dataDOMElementsControlMethods

function toggleTreeBreadcrumb(id : string, currTreeNode : typeDefinitions.navigationTreeNode)
{
    if(currTreeNode.objName != id){
        for(let i = 0; i < currTreeNode.children.length; i++){
            toggleTreeBreadcrumb(id, currTreeNode.children[i]!);
        }
    }
    else
    {
        const _newVisibility = currTreeNode.state == "opened" ? "none" : "flex";
        document.getElementById(`${currTreeNode.objName}-Chevron`)!.classList = _newVisibility == "flex" ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right";
        toggleTreeBreadcrumbChildrenVisibility(currTreeNode, _newVisibility);
    }
}

function toggleTreeBreadcrumbChildrenVisibility(currTreeNode : typeDefinitions.navigationTreeNode, _visibility : string)
{
    document.getElementById(`${currTreeNode.objName}-Chevron`)!.classList = _visibility == "flex" ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-right";
    for(let i = 0; i < currTreeNode.children.length; i++) {
        document.getElementById(currTreeNode.children[i]!.objName)!.style = `display: ${_visibility};`;

        if(currTreeNode.children[i]!.children.length != 0 && _visibility == "none"){
            toggleTreeBreadcrumbChildrenVisibility(currTreeNode.children[i]!, _visibility);
        }
    }
    currTreeNode.state = _visibility == "flex" ? "opened" : "closed";
}

export function updateActiveTreeNode(_nodeName_ : string)
{
    const treeNodes = document.getElementById("grid-tree")!.children;
    for(let i = 0; i < treeNodes.length; i++){
        treeNodes[i]!.classList.remove("active");
    }
    for(let i = 0; i < treeNodes.length; i++){
        const nodeName = treeNodes[i]!.getElementsByTagName("div")[0]!.getElementsByTagName("span")[0]!.innerText;
        if(nodeName == _nodeName_){
            treeNodes[i]!.classList.add("active");
            break;
        }
    }
}

// #endregion dataDOMElementsControlMethods