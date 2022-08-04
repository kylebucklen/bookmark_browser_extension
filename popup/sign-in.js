const button = document.querySelector('button');



// Check if token exists.  If so, redirect to bookmark page





document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {
        // send message to background script with email and password
        chrome.runtime.sendMessage({ message: 'login',
            payload: { email,    pass }},
            function (response) {
                if (response === 'success') {
                    window.location.replace('./bookmark.html');
                    //window.location.replace('./popup-sign-out.html');
                }
            });
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});