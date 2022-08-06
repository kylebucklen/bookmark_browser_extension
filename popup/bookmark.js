
window.addEventListener('load', event => {
    event.preventDefault();

    // send message to background script to validate token
    chrome.runtime.sendMessage({ message: 're-auth',
        payload: {}},
        function (res) {
            if (res !== 'success') {
                window.location.replace('./sign-in.html');
            }
        });
});


function init() {

  // reset the extension state
  tabs = [];
  closedTabs = [];
  bookmarks = [];

  // count and record all the open tabs for all the windows
  chrome.windows.getAll({populate: true}, function(windows) {

    // set the current tab as the first item in the tab list
    chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
        let tab_url = tabArray[0].url;
        document.getElementById("link_url").innerHTML = '<h3>' + tabArray[0].title + '</h3>' + tab_url;
    });
  });

}

init();
