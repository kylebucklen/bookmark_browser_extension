
// Hide the div that displays errors
const errors = document.querySelector('#errors');
errors.style.display = "none";


/**
 * Create event listener for onSubmit of sign in form
 *
 * @type type
 */
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
                } else {
                    document.querySelector('#errors').style.display = "block";
                    document.querySelector('#errors').innerHTML = '<span class="danger">Invalid Login!</span>';
                }
            });
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').style.backgroundColor = '#FFCC66';
        document.querySelector('#password').style.backgroundColor = '#FFCC66';
    }
});