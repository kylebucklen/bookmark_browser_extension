/*
* Get the current URL of the selected Chrome tab.
*
*/

function init() {

  // reset the extension state
  tabs = [];
  closedTabs = [];
  bookmarks = [];

  // count and record all the open tabs for all the windows
  chrome.windows.getAll({populate: true}, function(windows) {

    // set the current tab as the first item in the tab list
    chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
      document.getElementById("link_url").value = tabArray[0].url;
    });
  });

}

init();
