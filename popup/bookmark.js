
function init() {

    // send message to background script to validate token
    chrome.runtime.sendMessage({ message: 're-auth',
        payload: {}},
        function (res) {
            if (res !== 'success') {
                window.location.replace('./sign-in.html');
            }
        });


    // reset the extension state
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


    // get buckets
    chrome.runtime.sendMessage({ message: 'get-buckets',
        payload: {}},
        function (res) {
            var select = document.getElementById("select_bucket");

            for(var i = 0; i < res.length; i++) {
                var opt = res[i]['name'];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
        });
}

init();


/**
 * Add event listener for on click of COPY button
 *
 * @type Element
 */
const button = document.querySelector('#copy_bookmark');

button.addEventListener("click", function() {
  var copyText = document.getElementById('link_url').innerText;

  navigator.clipboard.writeText(copyText);
console.log("Text " + copyText);
  return true;
});


