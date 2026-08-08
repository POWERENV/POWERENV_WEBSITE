import * as config from "../../../config.js";
import * as pnodeEditors from "../INFRASTRUCTURE_MONITORING_LOGIC/editor_components.js";

export async function getUserNotificationsData(UserID) {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/notifications/getUserNotifications`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

        switch(LOGS.statusMessage) {
          case "Notifications retrieved successfully!":
            resolve(LOGS.packetData);
            break;
          default:
            pnodeEditors.showErrorMessage(LOGS.statusMessage);
            reject(LOGS.statusMessage);
            break;
        }
      });
  });
}

export async function markNotificationAsResolved(UserID, NotificationID) {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/notifications/resolveNotification_${NotificationID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

        switch(LOGS.statusMessage) {
          case "Notification successfuly marked as resolved!":
            resolve(LOGS.packetData);
            break;
          default:
            pnodeEditors.showErrorMessage(LOGS.statusMessage);
            reject(LOGS.statusMessage);
            break;
        }
      });
  });
}

export async function getUserGlobalEventsData() {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/globalEvents/getUserGlobalEvents`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

        switch(LOGS.statusMessage) {
          case "Global Events retrieved successfully!":
            resolve(LOGS.packetData);
            break;
          default:
            pnodeEditors.showErrorMessage(LOGS.statusMessage);
            reject(LOGS.statusMessage);
            break;
        }
      });
  });
}

export async function getUserGlobalEventsCadenceStatsData(interval) {
  return new Promise((resolve, reject) => {
    const name = fetch(
      `${config.baseAPIURL}/psystems/backend/user/globalEvents/getUserGlobalEventsCadenceStats_${interval}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

        switch(LOGS.statusMessage) {
          case "Global Events Cadence Statistics retrieved successfully!":
            resolve(LOGS.packetData);
            break;
          default:
            pnodeEditors.showErrorMessage(LOGS.statusMessage);
            reject(LOGS.statusMessage);
            break;
        }
      });
  });
}