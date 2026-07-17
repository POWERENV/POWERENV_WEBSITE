//==========================================================================================
//==========================================================================================
//=====================================pnode_editors.js=====================================
//This script contains all classes and functions related to the side-panel editor wizzards,
// which are used in the PNode Dashboard to edit several properties of the machine system.
//==========================================================================================
//==========================================================================================

import * as genericScript from "../scripting.js"

//=========================================================================================
/**
 * This class represents a message modal box, shown when a warning, error or information should be presented to the user.
*/
//=========================================================================================
export class messageModalBox {
    actionButtons;

    /**
     * messageModalBox class constructor - appends all the main components related the modal box.
     * @param {String} messageBoxHeader Text to be shown in the message box header.
     * @param {String} messageBoxContent Text to be shown in the messange box content area.
     */
    constructor (messageBoxHeader, messageBoxContent){
        document.getElementById("modalBoxZone").style.display = "flex";
        document.getElementById('messageModalBox').style.display = 'flex';
        document.getElementById("messageModalBoxContentMessage").innerText = messageBoxContent;
        document.getElementById('messageModalBoxHeading').innerHTML = messageBoxHeader;
        document.getElementById('messageModalBoxBTNZone').innerHTML = '';
        this.actionButtons = [];
    }

    /**
     * This method adds an action button in the bottom left area of the message modal box, associating it with a specific click event action.
     * @param {String} buttonTXT The text to be shown inside the button.
     * @param {Function} buttonAction The action associated with the button's click event listener.
     */
    addActionButton(buttonTXT, buttonAction) {
        document.getElementById('messageModalBoxBTNZone').insertAdjacentHTML('beforeend', `<button class="lightBTN" id="actionBTN_${this.actionButtons.length}">${buttonTXT}</button>`);

        requestAnimationFrame(() => {
            document.getElementById(`actionBTN_${this.actionButtons.length}`).addEventListener('click', buttonAction);
            this.actionButtons[this.actionButtons.length] = `actionBTN_${this.actionButtons.length}`;
        });
    }

    /**
     * This method hides the message modal box and its background overlay, effectively closing the modal.
     */
    hideMessageBox(){
        document.getElementById("messageModalBox").style.display = "none";
        document.getElementById("modalBoxZone").style.display = "none";
    }

    /**
     * This method copies the content of the message box to the user's clipboard, allowing them to easily share or save the information.
     */
    copyErrorMessage()
    {
        navigator.clipboard.writeText(document.getElementById("messageModalBoxContentMessage").innerText);
    }
}

//=========================================================================================
/**
 * This function displays an error message using messageModalBox class.
*/
//=========================================================================================
export function showErrorMessage(message) {
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
export function showSuccessMessage(message) {
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
 * This class represents a side-panel editor wizzard, enabling the user to edit multiple properties of several domains of the machine systems.
*/
//=========================================================================================
export class configurationEditWizzard {
    inputFieldIDs;
    textAreaIDs;
    dropdownFieldIDs;
    struct_inputFields;
    struct_dropdownFields;

    /**
     * This method gets the values of all input fields and saves them in struct objects, waiting to be processed or set to the server API later.
     */
    getFieldStructValues() {
        this.struct_inputFields = {};
        this.struct_dropdownFields = {};
        for(let i = 0; i < this.inputFieldIDs.length; i++){
            const iptVAL = document.getElementById(this.inputFieldIDs[i]).value;
            this.struct_inputFields[this.inputFieldIDs[i]] = iptVAL;
        }

        for(let i = 0; i < this.dropdownFieldIDs.length; i++){
            const iptVAL = document.getElementById(this.dropdownFieldIDs[i]).innerHTML.split(" ")[0];
            this.struct_dropdownFields[this.dropdownFieldIDs[i]] = iptVAL;
        }
    }
    
    /**
     * configurationEditWizzard class constructor - Makes initial setup to all components related with the editor wizzard, making it ready for the user to use it.
     * @param {String} wizzardHeadding Text to be shown in the edit wizzard header.
     * @param {Object} dashboardData The dashboardData object related to the current machine, used to fill the editor with the current values of the properties to be edited.
     * @param {Function|null} changesSaveOperation A function that will be executed when the user clicks the save button, responsible for processing the changes made by the user and send them to the server API. If null, the save button will be hidden, making the wizzard only a viewer.
     */
    constructor(wizzardHeadding, dashboardData, changesSaveOperation) {
        document.getElementById("editBoxZone").style.display = "block";

        document.getElementById("editBoxHeaderHeading").innerText = wizzardHeadding;

        document.getElementById("editBoxContentArea").innerHTML = `<form id="editBoxForm"></form>`;

        this.inputFieldIDs = [];
        this.textAreaIDs = [];
        this.dropdownFieldIDs = [];
        
        document.getElementById("editBoxCloseBTN").addEventListener("click", genericScript.closeEditBox);
        genericScript.resetElementEventListeners("editBoxSaveBTN");

        if(changesSaveOperation != null) {
            document.getElementById("editBoxSaveBTN").style.display = 'block';
            document.getElementById("editBoxSaveBTN").addEventListener("click", (e) => {
                this.getFieldStructValues();
                changesSaveOperation(e, this);
                document.getElementById("fullScreenLoadingZone").style.display = "flex";
                genericScript.resetElementEventListeners("editBoxSaveBTN");
                genericScript.closeEditBox();
            });
        } else {
            document.getElementById("editBoxSaveBTN").style.display = 'none';
        }
    }

    /**
     * This method appends an input field element to the editor wizzard form.
     * @param {String} inputFieldID ID string to be assigned to the input field element, making it accessible in the DOM model.
     * @param {String} inputFieldLabel Text to be shown as a label for the input field, describing the property to be edited.
     * @param {String} inputFieldPlaceholder Text to be shown as a placeholder inside the input field.
     * @param {String} inputFieldStandardValue Text to be set as standard value for the input field, normally being the current assigned value (registered in the Data Base).
     */
    insertInputField(inputFieldID, inputFieldLabel, inputFieldPlaceholder, inputFieldStandardValue) {
        this.inputFieldIDs[this.inputFieldIDs.length] = inputFieldID;
        document.getElementById("editBoxForm").innerHTML += `
            <div class = "editBoxInputGroup">
                <label>${inputFieldLabel}</label>
                <input type="text" class="editBoxTextInput" id="${inputFieldID}" placeholder="${inputFieldPlaceholder}" value="${inputFieldStandardValue}" />
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
    insertTextArea(textAreaID, textAreaLabel, textAreaPlaceholder, textAreaStandardValue, max_height) {
        this.textAreaIDs[this.textAreaIDs.length] = textAreaID;
        if(max_height != null){
            document.getElementById("editBoxForm").innerHTML += `<label>${textAreaLabel}:</label>
            <textarea class="editBoxTextAreaInput" id="${textAreaID}" placeholder="${textAreaPlaceholder}" style="height: ${max_height}; overflow: auto;">${textAreaStandardValue}</textarea>`;
        }
        else{
            document.getElementById("editBoxForm").innerHTML += `<label>${textAreaLabel}:</label>
            <textarea class="editBoxTextAreaInput" id="${textAreaID}" placeholder="${textAreaPlaceholder}">${textAreaStandardValue}</textarea>`;
        }
        
    }

    /**
     * **This method appends a dropdown field element to the editor wizzard form, along with its options and associated click events.**
     * @param {String} dropdownBTNID ID string to be assigned to the dropdown button element, making it accessible in the DOM model.
     * @param {String} dropdownID ID string to be assigned to the dropdown list container element, making it accessible in the DOM model.
     * @param {String} dropdownLabel Text to be shown as a label for the dropdown field, describing the property to be edited.
     * @param {String[]} optionStrings An array of strings, each one representing an option to be added to the dropdown list.
     * @param {String} defaultValue A string that should be one of the elements in optionStrings, used to set the default value shown in the dropdown button.
     * @param {Function[]} customClickEventAction An array where the first element is a function and the second element is a parameter for that function, used to assign a custom click event action to each option in the dropdown list. If empty, no custom click event will be assigned to the options.
     */
    insertDropdownField(dropdownBTNID, dropdownID, dropdownLabel, optionStrings, defaultValue = optionStrings[0], customClickEventAction = []) {
        this.dropdownFieldIDs[this.dropdownFieldIDs.length] = dropdownBTNID;
        //Adding the DropDown Field HTML snippet to the DOM
        document.getElementById("editBoxForm").innerHTML += `
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
            document.getElementById(dropdownBTNID).addEventListener("click", (e) => {
                toggleDropDownListVisibility(e, dropdownID);
            });

            //Adding options to dropdown list and assigning them click events (only when the DOM has been changed - requestAnimationFrame())
            for(let i = 0; i < optionStrings.length; i++){
                document.getElementById(`${dropdownID}UL`).innerHTML += `<li id="editBoxDropdown${optionStrings[i].toLowerCase()}">${optionStrings[i]}</li>`;

                requestAnimationFrame(() => {
                    document.getElementById(`editBoxDropdown${optionStrings[i].toLowerCase()}`).addEventListener('click', (e) => {
                        document.getElementById(dropdownBTNID).innerHTML = `${optionStrings[i]} <i class="fas fa-chevron-down"></i>`;
                        toggleDropDownListVisibility(e, dropdownID);
                        if(customClickEventAction.length != 0) customClickEventAction[0](customClickEventAction[1]);
                    });
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
export function toggleDropDownListVisibility(e, listOBJ) {
    let dropdownDisplay = document.getElementById(listOBJ).style.display;
    document.getElementById(listOBJ).style.display = dropdownDisplay == 'block' ? 'none' : 'block';
    if(e != null && e != undefined) e.preventDefault();
}