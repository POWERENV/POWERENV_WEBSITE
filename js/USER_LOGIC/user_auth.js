import * as config from "../../../config.js";
import * as pnodeEditors from "../DATA_RETRIEVAL/editor_components.js";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function login(email, password) {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `{
                    "Email": "${email}",
                    "Password": "${password}"
                }`,
      },
    )
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        return JSON.parse(data);
      })
      .then((json) => {
        var LOGS = json;

        if (
          LOGS.statusMessage == "Login successful. Session backed by Redis."
        ) {
          resolve(LOGS.packetData);
          window.location.href = "index.html";
        } else {
          pnodeEditors.showErrorMessage(LOGS.statusMessage);
          reject(LOGS.statusMessage);
        }
      });
  });
}

export async function logout() {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        return JSON.parse(data);
      })
      .then((json) => {
        var LOGS = json;

        if (LOGS.statusMessage == "Logged out successfully!") {
          console.log("sdgfasdf");
          resolve(LOGS.statusMessage);
          window.location.href = "login_page.html";
        } else {
          pnodeEditors.showErrorMessage(LOGS.statusMessage);
          reject(LOGS.statusMessage);
        }
      });
  });
}

export async function whoami() {
    return new Promise((resolve, reject) => {
      const name = fetch(`${config.baseAPIURL}/psystems/backend/user/auth/whoami`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
          }).then(res => {
            return res.text();
          } ).then(data => {
            return JSON.parse(data);
          } ).catch(error => {
            const escaped = escapeHtml(error.message);
            const errorMessage = `Contact with POWERENV's backend API failed!!! Full error message: <i>${escaped}</i>.`;
            pnodeEditors.showErrorMessage(errorMessage);
            return Promise.reject(errorMessage);
          }).then(json => {
            var LOGS = json;

            if(LOGS.statusMessage == "User is authenticated.")
            {
                console.log(LOGS.statusMessage);
                resolve(LOGS);
            }
            else {
                reject(LOGS.statusMessage);
                window.location.href = "login_page.html";
            }
          });
    });
}