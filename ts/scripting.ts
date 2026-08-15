import * as config from "../../config.js"
import * as userAuth from "./USER_LOGIC/user_auth.js"
import * as userDataRetrieval from "./USER_LOGIC/user_data_retrieval_script.js"
import * as typeDefinitions from "./types.js"

//#region dynamicContentManagement

(async () => {    
    if(window.location.href.includes("index.html") || window.location.href[window.location.href.length - 1] == '/' || window.location.href[window.location.href.length - 1] == '\\') {
        const _whoami_ : typeDefinitions.WhoamiReturnPacket = await userAuth.whoami() as typeDefinitions.WhoamiReturnPacket;
        if(_whoami_.statusMessage == "User is authenticated.") {
            document.getElementById("usernameSpan")!.innerText = _whoami_.packetData.username.toUpperCase();
            document.getElementById("userEmail")!.innerText = _whoami_.packetData.email.toUpperCase();

            if(_whoami_.packetData.profilePicture != null && _whoami_.packetData.profilePicture != "") {
                document.getElementById("userProfileButton")!.style.backgroundImage = `url(../USER_DATA/user_1/PROFILE_PICS/${_whoami_.packetData.profilePicture}?r=${Math.random()})`;
            }
            else {
                document.getElementById("userProfileButton")!.innerHTML += '<i class="fa-solid fa-user fa-2x" style="margin: 0px; color: var(--accent);"></i>';
            }
            
            document.getElementById("userProfileButton")!.addEventListener("click", () => {
                document.getElementById("transparentModalBoxZone")!.style.display = "flex";
                document.getElementById("profileModalBox")!.style.display = "flex";
            });

            document.getElementById("transparentModalBoxZone")!.addEventListener("click", (e) => {
                if(e.target != document.getElementById("transparentModalBoxZone")) return;
                document.getElementById("transparentModalBoxZone")!.style.display = "none";
                document.getElementById("profileModalBox")!.style.display = "none";
                document.getElementById("inboxModalBox")!.style.display = "none";
            });

            document.getElementById("logoutBTN")!.addEventListener("click", async () => {
                await userAuth.logout();
            });

            document.getElementById("inboxButton")!.addEventListener("click", () => {
                document.getElementById("transparentModalBoxZone")!.style.display = "flex";
                document.getElementById("inboxModalBox")!.style.display = "flex";
            });

            const notificationsData : Array<typeDefinitions.NotificationInfo> = await userDataRetrieval.getUserNotificationsData(_whoami_.packetData.userId) as Array<typeDefinitions.NotificationInfo>;

            if(notificationsData.length == 0){
                document.getElementById("inboxModalBoxNotificationsList")!.innerHTML += "<u>Inbox empty!</u><br>";
            }
            else {
                for(let i = 0; i < notificationsData.length; i++) {
                    document.getElementById("inboxModalBoxNotificationsList")!.innerHTML += `<li class="inboxModalBoxNotificationItem" id="notification_${i}">
                        <div>
                            <span>${notificationsData[i]!.title}</span>
                            <p>${notificationsData[i]!.description}</p>
                        </div>
                        <div style="display: flex; flex-direction: row; gap: 10px; align-items: start; margin-top: 15px; width: 100%;">
                            <button class="ghost-btn" id="notificationResolve_${i}"><i class="fa-solid fa-check fa-xl"></i> RESOLVE</button>
                        </div>
                    </li>`;

                    requestAnimationFrame(() => {
                        document.getElementById(`notificationResolve_${i}`)!.addEventListener("click", async () => {
                            userDataRetrieval.markNotificationAsResolved(_whoami_.packetData.userId, notificationsData[i]!.notificationId);
                            
                            document.getElementById("inboxModalBoxNotificationsList")!.removeChild(document.getElementById(`notification_${i}`)!);

                            if(notificationsData.length - 1 == 0) {
                                document.getElementById("inboxModalBoxNotificationsList")!.innerHTML += "<u>Inbox empty!</u><br>";
                            }
                        });
                    });
                }
            }
        }
    }
})();

export function switchDIVContent(_targetDIVObjID : string, _newDIVContentOBJ : string)
{
    document.getElementById(_targetDIVObjID)!.innerHTML = _newDIVContentOBJ;
}

export function switchSection(page : string, e : Event | null | undefined) {
    return new Promise((resolve, reject) => {
        const response = fetch(page, {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            }
        }).then(res => {
            return res.text();
        }).then(data => {            
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const pageContent = doc.getElementsByTagName("body")[0]!.innerHTML;

            document.getElementById("main-content")!.innerHTML = pageContent;
            
            const pageSidebarLinkName = pageToSidebarTabMap.get(page);
            const navItems = document.getElementsByClassName('nav-item');
            
            for(let i = 0; i < navItems.length; i++) {
                if((navItems[i] as HTMLElement)!.innerText == pageSidebarLinkName) {
                    navItems[i]!.classList.add('active');
                }
                else {
                    navItems[i]!.classList.remove('active');
                }
            }

            resolve("SUCCESS");
        });
    });
}

export function switchCustomSection(_targetPage : string, _targetObjID : string, _newContentID : string)
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
            
            switchDIVContent(_targetObjID, doc.getElementById(_newContentID)!.innerHTML);

            resolve("SUCCESS");
        });
    });
}

export function toggle2SideBTN(_btnList : Array<string>, _clickedBTNID : string)
{
    let btnList = [];
    let clickedBTNID = document.getElementById(_clickedBTNID)!;

    for(let i = 0; i < _btnList.length; i++){
        btnList[i] = document.getElementById(_btnList[i]!);
        if(btnList[i]!.classList.contains('sbActive')){
            btnList[i]!.classList.remove('sbActive');
        }
    }

    clickedBTNID.classList.add('sbActive');
}

//#endregion dynamicContentManagement

//#region ModalBoxes

export function disableButton(buttonID : string){
    (document.getElementById(buttonID) as HTMLButtonElement)!.disabled = true;
    document.getElementById(buttonID)!.style.opacity = '70%';
    document.getElementById(buttonID)!.style.cursor = 'default';
}

export function resetElementEventListeners(targetOBJID : string) {
    const element = document.getElementById(targetOBJID)!;
    const clone = element.cloneNode(true);
    element.parentNode!.replaceChild(clone, element);
}

export function showScreenLoadingPane() {
    document.getElementById("fullScreenLoadingZone")!.style.display = "flex";
}

export function hideScreenLoadingPane() {
    document.getElementById("fullScreenLoadingZone")!.style.display = "none";
}

//#endregion ModalBoxes

export function performAction(name : string){
    alert('Action: ' + name + ' initiated (demo)');
}

export function performPower(action : string){
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
    window.openSettings = openSettings;
    window.performAction = performAction;
    window.performPower = performPower;
    window.addHardware = addHardware;
}

const pageToSidebarTabMap = new Map([
    ["overview.html", "Dashboard"],
    ["hardware.html", "Hardware"],
    ["tasks.html", "Events & Logging"],
    ["power.html", "Power"]
]);