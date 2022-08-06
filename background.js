
/**
 * Remove data stored in local chrome storage
 *
 * @returns {Boolean}
 */
function remove_storage() {
    chrome.storage.sync.set({}, function (response) {
        return true;
    });

    return false;
}

/**
 * Authenticate user using provided credentials
 *      On success, store credentials and token in chrome local storage
 *
 * @param {type} user_info
 * @returns {unresolved}
 */
function sign_in(user_info) {
    const formData = new FormData();

    formData.append('email', user_info.email);
    formData.append('password', user_info.pass);

    return fetch('https://www.projectonair.com/api/auth/login', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(res => {
        return new Promise(resolve => {
            if (res.status !== 200) resolve('fail');

            res.json().then(function(data) {
                chrome.storage.sync.set({ 'user_info': user_info, 'token': data.token }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                    resolve('success');
                });
            }).catch(function(reason) {
                remove_storage();
            });
        });
    })
    .catch(function(reason) {
        remove_storage();
    });
}

/**
 * Validate the stored token
 *
 * @param {type} token
 * @returns {unresolved}
 */
function validate_token(token) {
    return chrome.storage.sync.get('token')
        .then(res => {
            return fetch('https://www.projectonair.com/api/auth/check', {
                method: 'POST',
                body: {'body' : 'empty'},
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + res.token
                }
            })
            .then(res => {
                return new Promise(resolve => {
                    if (res.status !== 200) resolve('invalid');

                    resolve('valid');
                });
            })
            .catch(function(reason) {
                resolve('invalid');
            });
        });
}

/**
 * Return credentials in chrome local storage
 *
 * @returns {unresolved}
 */
function get_stored_credentials() {
    return chrome.storage.sync.get('user_info')
        .then(res => {
            return new Promise(resolve => {
                resolve(res.user_info);
            });
        });
}




/**
 * Create listener to respond to messages from popup scripts
 *
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        // Login using provided credentials
        sign_in(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    } else if (request.message === 're-auth') {
        // Validate stored token
        validate_token()
            .then(res => {
                if (res === 'invalid') {
                    // Get stored credentials
                    get_stored_credentials()
                        .then(res => {
                            // Login using stored credentials
                            sign_in(res)
                                .then(result => sendResponse(result))
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                } else {
                    sendResponse('success');
                }
            })
            .catch(err => console.log(err));
    } else if (request.message === 'validate') {
        validate_token()
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    }

    return true;
});







/**
function get_cookie() {
    chrome.cookies.get({ url: 'https://www.projectonair.com', name: 'XSRF-TOKEN' },
      function (cookie) {
        if (cookie) {
          //console.log(cookie.value);
        }
        else {
          //console.log('Can\'t get cookie! Check the name!');
        }
    });
}

get_cookie();
 *
 */