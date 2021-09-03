const stylesheetId = "extension-style-1";

const updateStylesheet = (apply: boolean) => {
  let style = document.getElementById(stylesheetId) as unknown as StyleSheet;
  // create if stylesheet does not exists
  if (!style && apply) {
    var link = document.createElement("link");
    link.href = chrome.extension.getURL("./contents.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = stylesheetId;
    document.getElementsByTagName("head")[0].appendChild(link);
  } else {
    style = document.getElementById(stylesheetId) as unknown as StyleSheet;
    if (style) {
      style.disabled = apply ? false : true;
    }
  }
};

const updateMaskBasedOnState = () => {
  chrome.storage.sync.get("state", (data) => {
    updateStylesheet(data.state === "on" ? true : false);
  });
};

// receives any changes from the backgrounds script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action == "on_state_change") {
    updateMaskBasedOnState();
  }
});

// observe for dynamic nodes
const observer = new MutationObserver(() => {
  updateMaskBasedOnState();
});
observer.observe(document, { childList: true, subtree: true });
