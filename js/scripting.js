//#region dynamicContentManagement

function switchDIVContent(_targetDIVObjID, _newDIVContentOBJ)
{
    document.getElementById(_targetDIVObjID).innerHTML = _newDIVContentOBJ;
}

function switchSection(page, e){
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

function switchCustomSection(_targetPage, _targetObjID, _newContentID)
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

function toggle2SideBTN(_btnList, _clickedBTNID)
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

function hideErrorMessage()
{
    document.getElementById("errorModalBox").style.display = "none";
    document.getElementById("modalBoxZone").style.display = "none";
}

function showASMIConsoleBox(loginResponse)
{
    loginResponse = loginResponse.replaceAll('\r\n\r', '\n');
    document.getElementById("modalBoxZone").style.display = "flex";
    document.getElementById("consoleModalBox").style.display = "flex";
    document.getElementById("modalBoxHeaderText").innerText = "PNODE ASMI LIVE WEB CONSOLE";
    document.getElementById("consoleModalBoxViewportContent").innerText = loginResponse;
}

function showOSConsoleBox(dashboardData)
{
    document.getElementById("modalBoxZone").style.display = "flex";
    document.getElementById("consoleModalBox").style.display = "flex";
    document.getElementById("modalBoxHeaderText").innerText = "PNODE OS LIVE WEB CONSOLE";
    document.getElementById("consoleModalBoxViewportContent").innerText = "testOS>_";
}

function hideASMIConsoleBox()
{
    document.getElementById("consoleModalBox").style.display = "none";
    document.getElementById("modalBoxZone").style.display = "none";
}

function clearConsole()
{
    document.getElementById("consoleModalBoxViewportContent").innerText = "Console was cleared!\n";
}

function closeEditBox()
{
    document.getElementById("editBoxZone").style.display = "none";
    if(document.getElementById('editBoxIPAddressTypeDropdownList') != (undefined && null)) document.getElementById('editBoxIPAddressTypeDropdownList').style.display = 'none';
    document.getElementById("editBoxCloseBTN").removeEventListener("click", closeEditBox);
}

function disableButton(buttonID){
    document.getElementById(buttonID).disabled = true;
    document.getElementById(buttonID).style.opacity = '70%';
    document.getElementById(buttonID).style.cursor = 'default';
}

function resetElementEventListeners(targetOBJID) {
    const element = document.getElementById(targetOBJID);
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
}

//#endregion ModalBoxes

function performAction(name){
    alert('Action: ' + name + ' initiated (demo)');
}

function performPower(action){
    const ok = confirm('Confirm ' + action + ' for selected device?');
    if(ok) alert('Power action: ' + action + ' queued (demo)');
}

function addHardware(){
    alert('Open add-hardware dialog (demo)');
}

function openSettings(){
    alert('Open Settings (demo)');
}