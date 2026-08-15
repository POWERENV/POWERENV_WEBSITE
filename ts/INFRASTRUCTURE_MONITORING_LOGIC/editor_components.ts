//==========================================================================================
//==========================================================================================
//=====================================pnode_editors.js=====================================
//This script contains all classes and functions related to the side-panel editor wizzards,
// which are used in the PNode Dashboard to edit several properties of the machine system.
//==========================================================================================
//==========================================================================================

import * as genericScript from "../scripting.js"
import * as typeDefinitions from "../types.js"

//=========================================================================================
/**
 * This class represents a message modal box, shown when a warning, error or information should be presented to the user.
*/
//=========================================================================================
export class messageModalBox {
    actionButtons : Array<string>;

    /**
     * messageModalBox class constructor - appends all the main components related the modal box.
     * @param {String} messageBoxHeader Text to be shown in the message box header.
     * @param {String} messageBoxContent Text to be shown in the messange box content area.
     */
    constructor (messageBoxHeader : string, messageBoxContent : string) {
        document.getElementById("modalBoxZone")!.style.display = "flex";
        document.getElementById('messageModalBox')!.style.display = 'flex';
        document.getElementById("messageModalBoxContentMessage")!.innerHTML = messageBoxContent;
        document.getElementById('messageModalBoxHeading')!.innerHTML = messageBoxHeader;
        document.getElementById('messageModalBoxBTNZone')!.innerHTML = '';
        this.actionButtons = [];
    }

    /**
     * This method adds an action button in the bottom left area of the message modal box, associating it with a specific click event action.
     * @param {String} buttonTXT The text to be shown inside the button.
     * @param {Function} buttonAction The action associated with the button's click event listener.
     */
    addActionButton(buttonTXT : string, buttonAction : any) {
        document.getElementById('messageModalBoxBTNZone')!.insertAdjacentHTML('beforeend', `<button class="lightBTN" id="actionBTN_${this.actionButtons.length}">${buttonTXT}</button>`);

        requestAnimationFrame(() => {
            document.getElementById(`actionBTN_${this.actionButtons.length}`)!.addEventListener('click', buttonAction);
            this.actionButtons[this.actionButtons.length] = `actionBTN_${this.actionButtons.length}`;
        });
    }

    /**
     * This method hides the message modal box and its background overlay, effectively closing the modal.
     */
    hideMessageBox(){
        document.getElementById("messageModalBox")!.style.display = "none";
        document.getElementById("modalBoxZone")!.style.display = "none";
    }

    /**
     * This method copies the content of the message box to the user's clipboard, allowing them to easily share or save the information.
     */
    copyErrorMessage()
    {
        navigator.clipboard.writeText(document.getElementById("messageModalBoxContentMessage")!.innerText);
    }
}

//=========================================================================================
/**
 * This function displays an error message using messageModalBox class.
*/
//=========================================================================================
export function showErrorMessage(message : string) {
    let errorModalBox = new messageModalBox('ERROR MESSAGE', message);

    const okAction = () => {
        errorModalBox.hideMessageBox();
    };

    errorModalBox.addActionButton('Copy Message', errorModalBox.copyErrorMessage);
    requestAnimationFrame(() => {
        errorModalBox.addActionButton('Ok', okAction);
    });
}

//=========================================================================================
/**
 * This function displays a success message using messageModalBox class.
*/
//=========================================================================================
export function showSuccessMessage(message : string) {
    let errorModalBox = new messageModalBox('INFORMATION MESSAGE', message);

    const okAction = () => {
        errorModalBox.hideMessageBox();
    };

    errorModalBox.addActionButton('Copy Message', errorModalBox.copyErrorMessage);
    requestAnimationFrame(() => {
        errorModalBox.addActionButton('Ok', okAction);
    });
}

//=========================================================================================
/**
 * This class represents a console modal box.
*/
//=========================================================================================
export class consoleModalBox {
    /**
     * messageModalBox class constructor - appends all the main components related the modal box.
     * @param {String} messageBoxHeader Text to be shown in the message box header.
     */
    constructor (messageBoxHeader : string, loginResponse : string, closeConsoleAction : any, commandSubmitAction : any) {
        loginResponse = loginResponse.replaceAll('\r\n\r', '\n');
        document.getElementById("modalBoxZone")!.style.display = "flex";
        document.getElementById("consoleModalBox")!.style.display = "flex";
        document.getElementById("modalBoxHeaderText")!.innerText = messageBoxHeader;
        document.getElementById("consoleModalBoxViewportContent")!.innerText = loginResponse;

        genericScript.resetElementEventListeners("consoleCloseBTN");
        genericScript.resetElementEventListeners("consoleClearBTN");
        genericScript.resetElementEventListeners("commandForm");

        document.getElementById("consoleCloseBTN")!.addEventListener("click", closeConsoleAction);
        document.getElementById("consoleClearBTN")!.addEventListener("click", this.clearConsole);
        document.getElementById("commandForm")!.addEventListener("submit", commandSubmitAction);

        document.getElementById("consoleModalBoxConsoleViewport")!.scrollTo(0, document.getElementById("consoleModalBoxConsoleViewport")!.scrollHeight);
    }

    clearConsole() {
        document.getElementById("consoleModalBoxViewportContent")!.innerText = "Console was cleared!\n";
    }

    /**
     * This method hides the message modal box and its background overlay, effectively closing the modal.
     */
    hideMessageBox() {
        document.getElementById("consoleModalBox")!.style.display = "none";
        document.getElementById("modalBoxZone")!.style.display = "none";
    }
}

export function showASMIConsoleBox(loginResponse : string, additionalCloseAction : any, commandSubmitAction : any)
{
    const _consoleModalBox = new consoleModalBox('PNODE ASMI LIVE WEB CONSOLE', loginResponse, () => {
        hideASMIConsoleBox();
        additionalCloseAction != null ? additionalCloseAction() : null;
    }, commandSubmitAction);
}

export function showOSConsoleBox(additionalCloseAction : any, commandSubmitAction : any)
{
    const _consoleModalBox = new consoleModalBox('PNODE OS LIVE WEB CONSOLE', '#', () => {
        hideASMIConsoleBox();
        additionalCloseAction != null ? additionalCloseAction() : null;
    }, commandSubmitAction);
}

export function hideASMIConsoleBox()
{
    document.getElementById("consoleModalBox")!.style.display = "none";
    document.getElementById("modalBoxZone")!.style.display = "none";
}

//=========================================================================================
/**
 * This class represents a centered settings modal box.
*/
//=========================================================================================
export class centeredSettingsModalBox {
    /**
     * messageModalBox class constructor - appends all the main components related the modal box.
     * @param {String} messageBoxHeader Text to be shown in the message box header.
     */
    constructor (_headerText : string, _contentHTML : string, settingsSaveAction : any) {
        document.getElementById("modalBoxZone")!.style.display = "flex";
        document.getElementById("centeredSettingsModalBox")!.style.display = "flex";
        document.getElementById("settingsModalBoxHeaderText")!.innerText = _headerText;
        document.getElementById("centeredSettingsModalBoxContent")!.innerHTML = _contentHTML;

        genericScript.resetElementEventListeners("settingsSaveBTN");

        document.getElementById("settingsSaveBTN")!.addEventListener("click", settingsSaveAction);
        document.getElementById("settingsCloseBTN")!.addEventListener("click", this.hideSettingsBox);
    }

    /**
     * This method hides the message modal box and its background overlay, effectively closing the modal.
     */
    hideSettingsBox() {
        document.getElementById("centeredSettingsModalBox")!.style.display = "none";
        document.getElementById("modalBoxZone")!.style.display = "none";
    }
}

//=========================================================================================
/**
 * This class represents a side-panel editor wizzard, enabling the user to edit multiple properties of several domains of the machine systems.
*/
//=========================================================================================
export class sideConfigurationEditWizzard {
    inputFieldIDs : Array<string>;
    textAreaIDs : Array<string>;
    dropdownFieldIDs : Array<string>;
    struct_inputFields : any;
    struct_dropdownFields : any;

    /**
     * This method gets the values of all input fields and saves them in struct objects, waiting to be processed or set to the server API later.
     */
    getFieldStructValues() {
        this.struct_inputFields = {};
        this.struct_dropdownFields = {};
        for(let i = 0; i < this.inputFieldIDs.length; i++){
            const iptVAL = (document.getElementById(this.inputFieldIDs[i]!)! as HTMLTextAreaElement).value;
            this.struct_inputFields[this.inputFieldIDs[i]!] = iptVAL;
        }

        for(let i = 0; i < this.dropdownFieldIDs.length; i++){
            const iptVAL = document.getElementById(this.dropdownFieldIDs[i]!)!.innerHTML.split(" ")[0];
            this.struct_dropdownFields[this.dropdownFieldIDs[i]!] = iptVAL;
        }
    }
    
    /**
     * sideConfigurationEditWizzard class constructor - Makes initial setup to all components related with the editor wizzard, making it ready for the user to use it.
     * @param {String} wizzardHeadding Text to be shown in the edit wizzard header.
     * @param {Function|null} changesSaveOperation A function that will be executed when the user clicks the save button, responsible for processing the changes made by the user and send them to the server API. If null, the save button will be hidden, making the wizzard only a viewer.
     */
    constructor(wizzardHeadding : string, changesSaveOperation : ((e : Event, selfInstance : sideConfigurationEditWizzard) => void) | null) {
        document.getElementById("editBoxZone")!.style.display = "block";

        document.getElementById("editBoxHeaderHeading")!.innerText = wizzardHeadding;

        document.getElementById("editBoxContentArea")!.innerHTML = `<form id="editBoxForm"></form>`;

        this.inputFieldIDs = [];
        this.textAreaIDs = [];
        this.dropdownFieldIDs = [];
        
        document.getElementById("editBoxCloseBTN")!.addEventListener("click", closeEditBox);
        genericScript.resetElementEventListeners("editBoxSaveBTN");

        if(changesSaveOperation != null) {
            document.getElementById("editBoxSaveBTN")!.style.display = 'block';
            (document.getElementById("editBoxSaveBTN") as HTMLButtonElement)!.disabled = false;
            document.getElementById("editBoxSaveBTN")!.style.cursor = "pointer";
            document.getElementById("editBoxSaveBTN")!.addEventListener("click", (e) => {
                this.getFieldStructValues();
                changesSaveOperation(e, this);
                document.getElementById("fullScreenLoadingZone")!.style.display = "flex";
                genericScript.resetElementEventListeners("editBoxSaveBTN");
                closeEditBox();
            });
        } else {
            (document.getElementById("editBoxSaveBTN") as HTMLButtonElement)!.disabled = true;
            document.getElementById("editBoxSaveBTN")!.style.cursor = "default";
        }
    }

    /**
     * This method appends an input field element to the editor wizzard form.
     * @param {String} inputFieldID ID string to be assigned to the input field element, making it accessible in the DOM model.
     * @param {String} inputFieldLabel Text to be shown as a label for the input field, describing the property to be edited.
     * @param {String} inputFieldPlaceholder Text to be shown as a placeholder inside the input field.
     * @param {String} inputFieldStandardValue Text to be set as standard value for the input field, normally being the current assigned value (registered in the Data Base).
     */
    insertInputField(inputFieldID : string, inputFieldLabel : string, inputFieldPlaceholder : string, inputFieldStandardValue : string, isPassword : Boolean = false) {
        this.inputFieldIDs[this.inputFieldIDs.length] = inputFieldID;
        const inputType = isPassword ? "password" : "text";

        document.getElementById("editBoxForm")!.innerHTML += `
        <div class = "editBoxInputGroup">
            <label>${inputFieldLabel}</label>
            <input type="${inputType}" class="editBoxTextInput" id="${inputFieldID}" placeholder="${inputFieldPlaceholder}" value="${inputFieldStandardValue}" />
        </div>`;
    }

    /**
     * **Inserts a textarea element into the editBoxForm with the specified properties.
     * Adds the textarea ID to the textAreaIDs array and appends the HTML to the form.
     * If max_height is provided, sets the height style; otherwise, uses default styling.**
     * @param {string} textAreaID - The unique ID for the textarea element.
     * @param {string} textAreaLabel - The label text displayed above the textarea.
     * @param {string} textAreaPlaceholder - The placeholder text shown in the textarea when empty.
     * @param {string} textAreaStandardValue - The initial value pre-filled in the textarea.
     * @param {string|null} max_height - The maximum height CSS value (e.g., "200px") for the textarea; if null, no height is set.
     */
    insertTextArea(textAreaID : string, textAreaLabel : string, textAreaPlaceholder : string, textAreaStandardValue : string, max_height : String | null) {
        this.textAreaIDs[this.textAreaIDs.length] = textAreaID;
        if(max_height != null){
            document.getElementById("editBoxForm")!.innerHTML += `<label>${textAreaLabel}:</label>
            <textarea class="editBoxTextAreaInput" id="${textAreaID}" placeholder="${textAreaPlaceholder}" style="height: ${max_height}; overflow: auto;">${textAreaStandardValue}</textarea>`;
        }
        else{
            document.getElementById("editBoxForm")!.innerHTML += `<label>${textAreaLabel}:</label>
            <textarea class="editBoxTextAreaInput" id="${textAreaID}" placeholder="${textAreaPlaceholder}">${textAreaStandardValue}</textarea>`;
        }
        
    }

    /**
     * **This method appends a dropdown field element to the editor wizzard form, along with its options and associated click events.**
     * @param {string} dropdownBTNID ID string to be assigned to the dropdown button element, making it accessible in the DOM model.
     * @param {string} dropdownID ID string to be assigned to the dropdown list container element, making it accessible in the DOM model.
     * @param {string} dropdownLabel Text to be shown as a label for the dropdown field, describing the property to be edited.
     * @param {string[]} optionStrings An array of strings, each one representing an option to be added to the dropdown list.
     * @param {string} defaultValue A string that should be one of the elements in optionStrings, used to set the default value shown in the dropdown button.
     * @param {typeDefinitions.FunctionObject} customClickEventAction An array where the first element is a function and the second element is a parameter for that function, used to assign a custom click event action to each option in the dropdown list. If empty, no custom click event will be assigned to the options.
     */
    insertDropdownField(dropdownBTNID : string, dropdownID : string, dropdownLabel : string, optionStrings : Array<string>, defaultValue = optionStrings[0], customClickEventAction : typeDefinitions.FunctionObject | null = null) {
        this.dropdownFieldIDs[this.dropdownFieldIDs.length] = dropdownBTNID;
        //Adding the DropDown Field HTML snippet to the DOM
        document.getElementById("editBoxForm")!.innerHTML += `
            <div class="editBoxInputGroup">
                <label style="align-self: baseline; margin-top: 7px;">${dropdownLabel}</label>
                <div>
                    <button class="lightBTN" id="${dropdownBTNID}">${defaultValue} <i class="fas fa-chevron-down"></i></button>
                    <div class="editBoxDropdownList" id="${dropdownID}">
                        <ul id="${dropdownID}UL"></ul>
                    </div>
                </div>
            </div>`

        requestAnimationFrame(() => {
            //Adding click event listener to dropdown button
            document.getElementById(dropdownBTNID)!.addEventListener("click", (e) => {
                toggleDropDownListVisibility(e, dropdownID);
            });

            //Adding options to dropdown list and assigning them click events (only when the DOM has been changed - requestAnimationFrame())
            for(let i = 0; i < optionStrings.length; i++){
                document.getElementById(`${dropdownID}UL`)!.innerHTML += `<li id="editBoxDropdown${optionStrings[i]!.toLowerCase()}">${optionStrings[i]}</li>`;

                requestAnimationFrame(() => {
                    document.getElementById(`editBoxDropdown${optionStrings[i]!.toLowerCase()}`)!.addEventListener('click', (e) => {
                        document.getElementById(dropdownBTNID)!.innerHTML = `${optionStrings[i]} <i class="fas fa-chevron-down"></i>`;
                        toggleDropDownListVisibility(e, dropdownID);
                        if(customClickEventAction != null) customClickEventAction.function(customClickEventAction.args);
                    });
                });
            }
        });
    }

    /**
     * This method appends a button element to the editor wizzard form.
     * @param {String} buttonID ID string to be assigned to the button, making it accessible in the DOM model.
     * @param {String} buttonLabel Text to be shown as a label for the button, describing the property to be edited.
     * @param {typeDefinitions.FunctionObject} onClickAction Function object that executes on button click event triggered.
     */
    insertButton(buttonID : string, buttonLabel : string, onClickAction : typeDefinitions.FunctionObject) {
        document.getElementById("editBoxForm")!.innerHTML += `
        <div class = "editBoxInputGroup">
            <button type="button" id="${buttonID}" class="lightBTN">${buttonLabel}</button>
        </div>`;

        requestAnimationFrame(() => {
            document.getElementById(buttonID)!.addEventListener("click", () => {
                onClickAction.function(onClickAction.args);
            });
        });
    }

    resetSubmitButtonClickELAction(changesSaveOperation : ((e : Event, selfInstance : sideConfigurationEditWizzard) => void) | null) {
        genericScript.resetElementEventListeners("editBoxSaveBTN");

        if(changesSaveOperation != null){
            (document.getElementById("editBoxSaveBTN") as HTMLButtonElement)!.disabled = false;
            document.getElementById("editBoxSaveBTN")!.style.cursor = "pointer";

            document.getElementById("editBoxSaveBTN")!.addEventListener("click", (e) => {
                this.getFieldStructValues();
                changesSaveOperation(e, this);
                document.getElementById("fullScreenLoadingZone")!.style.display = "flex";
                genericScript.resetElementEventListeners("editBoxSaveBTN");
                closeEditBox();
            });
        }
        else {
            (document.getElementById("editBoxSaveBTN") as HTMLButtonElement)!.disabled = true;
            document.getElementById("editBoxSaveBTN")!.style.cursor = "default";
        }
    }
}

export function closeEditBox()
{
    document.getElementById("editBoxZone")!.style.display = "none";
    if(document.getElementById('editBoxIPAddressTypeDropdownList')) document.getElementById('editBoxIPAddressTypeDropdownList')!.style.display = 'none';
    document.getElementById("editBoxCloseBTN")!.removeEventListener("click", closeEditBox);
}

//=========================================================================================
/**
 * This function toggles a dropdown list box visibility, usualy when a button is clicked.
 * @param {Event} e The event object from the click event that triggered the function, used to prevent default behavior.
 * @param {String} listOBJ The ID of the dropdown list HTML element to toggle visibility on.
*/
//=========================================================================================
export function toggleDropDownListVisibility(e : Event, listOBJ : string) {
    let dropdownDisplay = document.getElementById(listOBJ)!.style.display;
    document.getElementById(listOBJ)!.style.display = dropdownDisplay == 'block' ? 'none' : 'block';
    if(e != null && e != undefined) e.preventDefault();
}