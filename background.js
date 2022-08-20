
/**
 * Remove data stored in local chrome storage
 *
 * @returns {Boolean}
 */
function logout() {
    return chrome.storage.sync.clear()
        .then(function(data) {
            return data;
        })
        .catch(err => console.log(err));

    return true;
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

    if (user_info === undefined || !user_info.hasOwnProperty('email') || !user_info.hasOwnProperty('pass')) {
        return new Promise(resolve => {
            resolve('fail');
        });
    }

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

            res.json()
                .then(function(data) {
                    chrome.storage.sync.set({ 'user_info': user_info, 'token': data.token }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');
                        resolve('success');
                    });
                })
                .catch(function(reason) {
                    logout();
                });
        });
    })
    .catch(function(reason) {
        logout();
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
            .catch(err => console.log(err));
        });
}

/**
 * Return credentials in chrome local storage
 *
 * @returns {unresolved}
 */
function get_stored_credentials(key) {
    return chrome.storage.sync.get(key)
        .then(res => {
            return new Promise(resolve => {
                resolve(res[key]);
            });
        });
}


/**
 * Get buckets for authenticated user
 *
 * @returns {unresolved}
 */
function get_buckets() {
    return chrome.storage.sync.get('token')
        .then(res => {
            return fetch('https://www.projectonair.com/api/buckets', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + res.token
                }
            })
            .then(res => {
                return new Promise(resolve => {
                    if (res.status !== 200) resolve({});

                    res.json()
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => console.log(err));
                });
            })
            .catch(err => console.log(err));
        });
}


/**
 * Send api request to bookmark url
 *
 * @param {type} info
 * @returns {Promise}
 */
function bookmark_url(info) {
    const formData = new FormData();

    if (info === undefined || !info.hasOwnProperty('name') || !info.hasOwnProperty('url')) {
        return new Promise(resolve => {
            resolve('fail');
        });
    }

    formData.append('bucket', info.bucket);
    formData.append('name', info.name);
    formData.append('url', info.url);
    formData.append('description', info.description);

    return chrome.storage.sync.get('token')
        .then(res => {
            return fetch('https://www.projectonair.com/api/link', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + res.token
                }
            })
            .then(res => {
                return new Promise(resolve => {
                    res.json()
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => console.log(err));
                });
            })
            .catch(err => console.log(err));
        });
}


/**
 * Send api request to create new bucket
 *
 * @param {type} info
 * @returns {Promise}
 */
function save_bucket(info) {
    const formData = new FormData();

    if (info === undefined || !info.hasOwnProperty('name')) {
        return new Promise(resolve => {
            resolve('fail');
        });
    }

    formData.append('name', info.name);
    formData.append('description', info.description);

    return chrome.storage.sync.get('token')
        .then(res => {
            return fetch('https://www.projectonair.com/api/bucket', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + res.token
                }
            })
            .then(res => {
                return new Promise(resolve => {
                    res.json()
                        .then(res => {
                            resolve(res);
                        })
                        .catch(err => console.log(err));
                });
            })
            .catch(err => console.log(err));
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
                    get_stored_credentials('user_info')
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
        // Validate user token
        validate_token()
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    } else if (request.message === 'logout') {
        // Logout and remove token
        logout()
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    } else if (request.message === 'get-buckets') {
        // Get list of available buckets
        get_buckets()
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    } else if (request.message === 'bookmark') {
        // Save bookmark
        bookmark_url(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
    } else if (request.message === 'bucket') {
        // Save bucket
        save_bucket(request.payload)
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