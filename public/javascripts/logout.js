document.getElementById('urbanWear_logout').addEventListener('click', logout);

function logout() {
    fetch('/logout', {
        method: 'POST'
    })
        .then(() => {
            console.log("Session destroyed and logged out.");
            window.location.href = '/';
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
}