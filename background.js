

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


function sign_in(user_info) {
    const formData = new FormData();

    formData.append('email', user_info.email);
    formData.append('password', user_info.pass);

    return fetch('https://www.projectonair.com/api/auth/login', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
            //'Authorization': 'Basic ' + btoa(`${user_info.email}:${user_info.pass}`)
        }
    })
    .then(res => {
        return new Promise(resolve => {
            if (res.status !== 200) resolve('fail');

            res.json().then(function(data) {
                console.log(data);
                chrome.storage.local.set({ user_info: user_info, token: data.token }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                    resolve('success');
                });
            }).catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
}



/*
function is_user_signed_in() {
    return new Promise(resolve => {
        chrome.storage.local.get(['user_info'],
            function (response) {
                if (chrome.runtime.lastError) resolve({ userStatus: false, user_info: {} });

                resolve(response.userStatus === undefined ?
                    { userStatus: false, user_info: {} } :
                    { userStatus: response.userStatus, user_info:
                    response.user_info }
                    );
            });
    });
}
*/


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
        sign_in(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === 'logout') {
        /*
        flip_user_status(null)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
         *
         */
    } else if (request.message === 'userStatus') {
        /*
        is_user_signed_in()
        .then(res => {
            sendResponse({
                message: 'success',
                userStatus: res.user_info.email
            });
        })
        .catch(err => console.log(err));
        return true;
         *
         */
    }
});


chrome.storage.local.get(['user_info', 'token'],
    function (response) {
        if (chrome.runtime.lastError) resolve({});
console.log(response);
    });

