const onStateChangeMessage = {
  action: "on_state_change",
};

const toggleState = (tabId: number) => {
  chrome.storage.sync.get("state", (data) => {
    let newState = data.state === "on" ? "off" : "on";
    chrome.storage.sync.set({ state: newState });
    chrome.browserAction.setIcon({ path: "icon_" + newState + ".png" });
    chrome.tabs.sendMessage(tabId, onStateChangeMessage);
  });
};

chrome.browserAction.onClicked.addListener((tab) => {
  toggleState(tab.id ?? 0);
});

chrome.tabs.onUpdated.addListener((tabId) => {
  chrome.storage.sync.get("state", (data) => {
    let state = data.state ?? "off";
    chrome.browserAction.setIcon({ path: "icon_" + state + ".png" });
    chrome.tabs.sendMessage(tabId ?? 0, onStateChangeMessage);
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.sendMessage(activeInfo.tabId, onStateChangeMessage);
});
