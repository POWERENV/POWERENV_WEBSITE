import * as config from "../../config.js"
import * as userAuth from "./USER_LOGIC/user_auth.js"

//#region dynamicContentManagement

(async () => {
    
    if(window.location.href.includes("index.html") || window.location.href[window.location.href.length - 1] == '/' || window.location.href[window.location.href.length - 1] == '\\') {
        const _whoami_ = await userAuth.whoami();
        if(_whoami_.statusMessage == "User is authenticated."){
            document.getElementById("usernameSpan").innerText = _whoami_.packetData.username.toUpperCase();
            document.getElementById("userEmail").innerText = _whoami_.packetData.email.toUpperCase();

            if(_whoami_.packetData.profilePicture != null && _whoami_.packetData.profilePicture != "") {
                document.getElementById("userProfileButton").style.backgroundImage = `url(../USER_DATA/user_1/PROFILE_PICS/${_whoami_.packetData.profilePicture}?r=${Math.random()})`;
            }
            else {
                document.getElementById("userProfileButton").innerHTML += '<i class="fa-solid fa-user fa-2x" style="margin: 0px; color: var(--accent);"></i>';
            }
            
            document.getElementById("userProfileButton").addEventListener("click", () => {
                document.getElementById("transparentModalBoxZone").style.display = "flex";
                document.getElementById("profileModalBox").style.display = "flex";
            });

            document.getElementById("transparentModalBoxZone").addEventListener("click", (e) => {
                if(e.target != document.getElementById("transparentModalBoxZone")) return;
                document.getElementById("transparentModalBoxZone").style.display = "none";
            });

            document.getElementById("logoutBTN").addEventListener("click", async () => {
                await userAuth.logout();
            });
        }
    }
})();

export function switchDIVContent(_targetDIVObjID, _newDIVContentOBJ)
{
    document.getElementById(_targetDIVObjID).innerHTML = _newDIVContentOBJ;
}

export function switchSection(page, e) {
    return new Promise((resolve, reject) => {
        const response = fetch(page, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            }
        }).then(res => {
            return res.text();
        }).then(data => {
            // when fetch-api gets the data from the requested html file, we parse it to html code and replace the main-content div with the new content
            const el = ((e.currentTarget || e.target).classList != undefined) ? (e.currentTarget || e.target) : (document.getElementById('nav-overview'));
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            
            const pageContent = doc.getElementsByTagName("body")[0].innerHTML;
            document.getElementById("main-content").innerHTML = pageContent;

            const navItems = document.getElementsByClassName('nav-item');
            for(let i = 0; i < navItems.length; i++){
                navItems[i].classList.remove('active');
            }
            el.classList.add('active');

            resolve("SUCCESS");
        });
    });
}

export function switchCustomSection(_targetPage, _targetObjID, _newContentID)
{
    return new Promise((resolve, reject) => {
        const response = fetch(_targetPage, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            }
        }).then(res => {
            return res.text();
        }).then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            
            switchDIVContent(_targetObjID, doc.getElementById(_newContentID).innerHTML);

            resolve("SUCCESS");
        });
    });
}

export function toggle2SideBTN(_btnList, _clickedBTNID)
{
    let btnList = [];
    let clickedBTNID = document.getElementById(_clickedBTNID);

    for(let i = 0; i < _btnList.length; i++){
        btnList[i] = document.getElementById(_btnList[i]);
        if(btnList[i].classList.contains('sbActive')){
            btnList[i].classList.remove('sbActive');
        }
    }

    clickedBTNID.classList.add('sbActive');
}

//#endregion dynamicContentManagement

//#region ModalBoxes

/*function showErrorMessage(errorMessage)
{
    document.getElementById("modalBoxZone").style.display = "flex";
    document.getElementById("errorModalBox").style.display = "flex";
    document.getElementById("errorModalBoxContentMessage").innerText = errorMessage;
}*/

export function hideErrorMessage()
{
    document.getElementById("errorModalBox").style.display = "none";
    document.getElementById("modalBoxZone").style.display = "none";
}

export function showASMIConsoleBox(loginResponse)
{
    loginResponse = loginResponse.replaceAll('\r\n\r', '\n');
    document.getElementById("modalBoxZone").style.display = "flex";
    document.getElementById("consoleModalBox").style.display = "flex";
    document.getElementById("modalBoxHeaderText").innerText = "PNODE ASMI LIVE WEB CONSOLE";
    document.getElementById("consoleModalBoxViewportContent").innerText = loginResponse;
}

export function showOSConsoleBox(dashboardData)
{
    document.getElementById("modalBoxZone").style.display = "flex";
    document.getElementById("consoleModalBox").style.display = "flex";
    document.getElementById("modalBoxHeaderText").innerText = "PNODE OS LIVE WEB CONSOLE";
    document.getElementById("consoleModalBoxViewportContent").innerText = "#";
}

export function hideASMIConsoleBox()
{
    document.getElementById("consoleModalBox").style.display = "none";
    document.getElementById("modalBoxZone").style.display = "none";
}

export function clearConsole()
{
    document.getElementById("consoleModalBoxViewportContent").innerText = "Console was cleared!\n";
}

export function closeEditBox()
{
    document.getElementById("editBoxZone").style.display = "none";
    if(document.getElementById('editBoxIPAddressTypeDropdownList') != (undefined && null)) document.getElementById('editBoxIPAddressTypeDropdownList').style.display = 'none';
    document.getElementById("editBoxCloseBTN").removeEventListener("click", closeEditBox);
}

export function disableButton(buttonID){
    document.getElementById(buttonID).disabled = true;
    document.getElementById(buttonID).style.opacity = '70%';
    document.getElementById(buttonID).style.cursor = 'default';
}

export function resetElementEventListeners(targetOBJID) {
    const element = document.getElementById(targetOBJID);
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
}

//#endregion ModalBoxes

export function performAction(name){
    alert('Action: ' + name + ' initiated (demo)');
}

export function performPower(action){
    const ok = confirm('Confirm ' + action + ' for selected device?');
    if(ok) alert('Power action: ' + action + ' queued (demo)');
}

export function addHardware(){
    alert('Open add-hardware dialog (demo)');
}

export function openSettings(){
    alert('Open Settings (demo)');
}

if (typeof window !== "undefined") {
    window.switchSection = switchSection;
    window.clearConsole = clearConsole;
    window.openSettings = openSettings;
    window.performAction = performAction;
    window.performPower = performPower;
    window.addHardware = addHardware;
    window.toggle2SideBTN = toggle2SideBTN;
    window.hideErrorMessage = hideErrorMessage;
    window.showASMIConsoleBox = showASMIConsoleBox;
    window.showOSConsoleBox = showOSConsoleBox;
    window.hideASMIConsoleBox = hideASMIConsoleBox;
    window.closeEditBox = closeEditBox;
    window.disableButton = disableButton;
    window.resetElementEventListeners = resetElementEventListeners;
}