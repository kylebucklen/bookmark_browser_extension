
function getTabs() {


    /**
     * Get current browser tab
     */
    tabs = [];
    closedTabs = [];
    bookmarks = [];

    // count and record all the open tabs for all the windows
    chrome.windows.getAll({populate: true}, function(windows) {

      // set the current tab as the first item in the tab list
      chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
          let tab_url = tabArray[0].url;
          document.getElementById("link_name").innerHTML = tabArray[0].title;
          document.getElementById("link_url").innerHTML = tab_url;
      });
    });
}

getTabs();


/**
 * Add event listener for on click of COPY button
 *
 * @type Element
 */
const copy_button = document.querySelector('#copy_bookmark');

copy_button.addEventListener("click", function() {
  var copyText = document.getElementById('link_url').innerText;

  navigator.clipboard.writeText(copyText);
  return true;
});


/**
 * Add event listener for post of bookmark saving
 *
 * @type Element
 */
const add_button = document.querySelector('#add_bookmark');

add_button.addEventListener("click", function() {
    const link_bucket = document.querySelector('#link_bucket').value;
    const link_name = document.querySelector('#link_name').innerText;
    const link_url = document.querySelector('#link_url').innerText;

    // send message to background script to save the url
    chrome.runtime.sendMessage({ message: 'bookmark',
        payload: { 'bucket': link_bucket, 'name': link_name, 'url': link_url }},
        function (response) {
            if (response === 'success') {
                //
            }
        });


  return true;
});


/**
 * Add event listener for logout
 *
 * @type Element
 */
const logout = document.querySelector('#logout');

logout.addEventListener("click", function() {
    // send message to background script to logout
    chrome.runtime.sendMessage({ message: 'logout',
        payload: {}},
        function (res) {
            window.location.replace('./sign-in.html');
        });

  return true;
});