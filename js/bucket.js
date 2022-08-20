
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
            }
        });
}

authenticate();



/**
 * Add event listener for post of bucket saving
 *
 * @type Element
 */
const add_button = document.querySelector('#add_bucket');

add_button.addEventListener("click", function() {
    const link_name = document.querySelector('#bucket_name').value;
    const bucket_description = document.querySelector('#bucket_description').value;

    // send message to background script to save the url
    chrome.runtime.sendMessage({ message: 'bucket',
        payload: { 'name': link_name, 'description': bucket_description }},
        function (response) {
            //var errors = JSON.parse(response.errors);

            if (response.errors === undefined) {
                //document.querySelector('#link_url').style.display = "none";
                document.querySelector('#display_description').style.display = "none";
                document.querySelector('#display_name').style.display = "none";
                document.querySelector('#display_bucket').style.display = "none";

                document.querySelector('#errors').style.display = "block";
                document.querySelector('#errors').innerHTML = '<h2 class="success">Bucket Added!</h2>';

                setTimeout(function(){
                    window.location.replace('./bookmark.html');
                }, 2000);

                //window.location.replace('./bookmark.html');
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
