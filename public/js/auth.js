// General helper functions for authentication

/**
 * Sign out a user and kick them back to the sign in page
 */
function signOutCallback() {
    firebase.auth().signOut()
        .then(() => window.location.href = "/")
        .catch(() => toastr.error("Failed to sign out"));
}

/**
 * Ensure a user is already logged in
 */
function checkUserLoggedIn() {
    // Send the user back to sign in if not logged in
    firebase.auth().onAuthStateChanged(user => {
        if (!user) window.location.href = "/signin/";
    });
}
