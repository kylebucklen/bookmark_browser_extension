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
                    });
            }
        });
}

authenticate();