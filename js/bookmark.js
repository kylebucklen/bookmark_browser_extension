
// Hide the div that displays errors
const errors = document.querySelector('#errors');
errors.style.display = "none";


/**
 * Send a message to the background.js script to validate the token
 */
function authenticate() {
    chrome.runtime.sendMessage({ message: 're-auth',
        payload: {}},
        function (res) {
            if (res !== 'success') {
                window.location.replace('./sign-in.html');
            } else {
                /**
                 * Call API to get list of BUCKETS
                 */
                chrome.runtime.sendMessage({ message: 'get-buckets',
                    payload: {}},
                    function (res) {
                        var select = document.getElementById("link_bucket");

                        for(var i = 0; i < res.length; i++) {
                            var opt = res[i]['name'];
                            var id = res[i]['id'];
                            var el = document.createElement("option");
                            el.textContent = opt;
                            el.value = id;
                            select.appendChild(el);
                        }

                        var el = document.createElement("option");
                        el.textContent = '------------';
                        el.value = '';
                        el.disabled = true;
                        select.appendChild(el);

                        var el = document.createElement("option");
                        el.textContent = '+ New';
                        el.value = 'asdfasdfasdfasdasdf';
                        select.appendChild(el);

                    });
            }
        });
}

authenticate();


/**
 * Get current browser tab
 *
 * @returns {undefined}
 */
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
          document.getElementById("link_name").value = tabArray[0].title;
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
    const link_name = document.querySelector('#link_name').value;
    const link_url = document.querySelector('#link_url').innerText;
    const link_description = document.querySelector('#link_description').value;

    // send message to background script to save the url
    chrome.runtime.sendMessage({ message: 'bookmark',
        payload: { 'bucket': link_bucket, 'name': link_name, 'url': link_url, 'description': link_description }},
        function (response) {
            //var errors = JSON.parse(response.errors);

            if (response.errors === undefined) {
                //document.querySelector('#link_url').style.display = "none";
                document.querySelector('#display_description').style.display = "none";
                document.querySelector('#display_bucket').style.display = "none";
                document.querySelector('#display_name').style.display = "none";

                document.querySelector('#errors').style.display = "block";
                document.querySelector('#errors').innerHTML = '<h2 class="success">Bookmark Added!</h2>';
            } else {
                var output = '';
                var errors = response.errors;

                for(var key in errors) {
                   for (var key1 in errors[key]) {
                        output += errors[key][key1] + '<br/>';
                   }
                }

                document.querySelector('#errors').style.display = "block";
                document.querySelector('#errors').innerHTML = '<span class="danger">' + output + '</span>';
            }
        });

  return true;
});

/**
 * Check if user wants to add a new bucket
 *  If so, redirect them to the buckets popup
 *
 * @returns {undefined}
 */
const new_bucket = document.querySelector('#link_bucket');

new_bucket.addEventListener("change", function() {
    const link_bucket = document.querySelector('#link_bucket').value;

    // check if this is a request for a new bucket
    if (link_bucket === 'asdfasdfasdfasdasdf') {
        window.location.replace('./bucket.html');
    }


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
