// Register event listeners on document load
$(document).ready(() => firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        const url = new URL(window.location);

        // Redirect if already logged in
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Notify user they are signed in
                toastr.success(user.email, "Successfully signed in");

                // Redirect after 2.5 seconds so they can see it
                setTimeout(() => window.location.href = (url.searchParams.get("next") !== null) ? url.searchParams.get("next") : "/", 2500);

            // Display sign in button if not logged in
            } else toggleLoading(false);
        });

        // Setup provider
        let provider = new firebase.auth.GoogleAuthProvider();

        let googleButton = $("#googleBtn");

        // Register sign-in callback
        googleButton.on("click", () => {
            toggleLoading(true);

            // Start the sign in process
            firebase.auth().signInWithPopup(provider)
                .catch(err => {
                    // Stop the loading
                    toggleLoading(false);

                    // Display error message
                    if (err.code !== "auth/popup-closed-by-user") toastr.error(err.message, "Failed to login");
                });
            }
        );
    })
    .catch(console.error)
);

/**
 * Toggle the loading spinner
 *
 * @param on {boolean} whether the page is loading or not
 */
function toggleLoading(on) {
    $("#loading-spinner")[on ? "show" : "hide"]();
    $("#googleBtn")[on ? "hide" : "show"]();
}
