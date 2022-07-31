

function get_cookie() {
    chrome.cookies.get({ url: 'https://www.projectonair.com', name: 'XSRF-TOKEN' },
      function (cookie) {
        if (cookie) {
          console.log(cookie.value);
        }
        else {
          console.log('Can\'t get cookie! Check the name!');
        }
    });
}

get_cookie();