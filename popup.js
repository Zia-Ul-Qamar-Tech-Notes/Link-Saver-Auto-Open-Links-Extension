document.getElementById("addLink").addEventListener("click", () => {
  const newLink = document.getElementById("newLink").value.trim();
  if (newLink) {
    chrome.storage.local.get("savedLinks", (data) => {
      const links = data.savedLinks || [];
      if (!links.some((link) => link.url === newLink)) {
        // Add new link to the list and update storage
        links.push({ url: newLink, openOnStartup: false });
        chrome.storage.local.set({ savedLinks: links }, () => {
          document.getElementById("newLink").value = ""; // Clear input field
          loadLinks(); // Reload the links to display the updated list
        });
      } else {
        alert("This link is already saved.");
      }
    });
  }
});

// Save the current tab's URL
document.getElementById("saveCurrentTab").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabUrl = tabs[0].url;
    chrome.storage.local.get("savedLinks", (data) => {
      const links = data.savedLinks || [];
      if (!links.some((link) => link.url === currentTabUrl)) {
        links.push({ url: currentTabUrl, openOnStartup: false });
        chrome.storage.local.set({ savedLinks: links }, () => {
          loadLinks(); // Reload the links to display the updated list
        });
      } else {
        alert("This tab's link is already saved.");
      }
    });
  });
});

// Delete link function
function deleteLink(linkToDelete) {
  chrome.storage.local.get("savedLinks", (data) => {
    let links = data.savedLinks || [];
    links = links.filter((link) => link.url !== linkToDelete); // Remove the selected link
    chrome.storage.local.set({ savedLinks: links }, () => {
      loadLinks(); // Reload the links after deletion
    });
  });
}

// Toggle the "open on startup" state
function toggleOpenOnStartup(linkToToggle) {
  chrome.storage.local.get("savedLinks", (data) => {
    let links = data.savedLinks || [];
    links = links.map((link) => {
      if (link.url === linkToToggle.url) {
        link.openOnStartup = !link.openOnStartup;
      }
      return link;
    });
    chrome.storage.local.set({ savedLinks: links }, () => {
      loadLinks(); // Reload the links after toggle
    });
  });
}

// Load links into the list
function loadLinks() {
  chrome.storage.local.get("savedLinks", (data) => {
    const links = data.savedLinks || [];
    const list = document.getElementById("linkList");
    list.innerHTML = ""; // Clear the existing list before reloading
    links.forEach((link) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${link.url}</span>
        <label>
          <input type="checkbox" class="startup-checkbox" ${
            link.openOnStartup ? "checked" : ""
          } data-url="${link.url}">
          Open on Startup
        </label>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => deleteLink(link.url));

      li.appendChild(deleteButton);
      list.appendChild(li);
    });

    // Add event listeners for the checkboxes
    const checkboxes = document.querySelectorAll(".startup-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const url = e.target.getAttribute("data-url");
        toggleOpenOnStartup({ url });
      });
    });
  });
}

// Initial load of links when the popup opens
loadLinks();
