// Listen for when the extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
  openLinksOnStartup(); // Open links marked to open on startup when the extension is installed/updated
});

// Listen for Chrome's startup event
chrome.runtime.onStartup.addListener(() => {
  openLinksOnStartup(); // Open links marked to open on startup when Chrome starts
});

// Function to open links marked to open on startup
function openLinksOnStartup() {
  chrome.storage.local.get("savedLinks", (data) => {
    const links = data.savedLinks || [];

    // Filter links that should be opened on startup
    const linksToOpen = links.filter((link) => link.openOnStartup);

    // Open each link in a new tab
    linksToOpen.forEach((link) => {
      chrome.tabs.create({ url: link.url });
    });
  });
}

// Listen for changes in saved links and open the links marked to open on startup
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.savedLinks) {
    const newLinks = changes.savedLinks.newValue || [];
    const linksToOpen = newLinks.filter((link) => link.openOnStartup);

    // Open the links that should be opened on startup
    linksToOpen.forEach((link) => {
      chrome.tabs.create({ url: link.url });
    });
  }
});
