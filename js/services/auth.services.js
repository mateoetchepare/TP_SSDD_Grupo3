export const createAuthClient = (divElement) => {

    auth0.createAuth0Client({
        domain: "dev-h74gvie66akma5zh.us.auth0.com",
        clientId: "LHeNnWrtoPJVYK7vFbQnVpcf2LPzOzCu",
        authorizationParams: {
          redirect_uri: window.location.origin + '/#/login' 
        }
      }).then(async (auth0Client) => {
        //Se carga el cliente de auth0 para llamar a los metodos de login y logout
        const loginButton = divElement.getElementById("botonLogin");
      
        loginButton.addEventListener("click", (e) => {
          e.preventDefault();
          auth0Client.loginWithRedirect();
        });
      
        if (location.search.includes("state=") && 
            (location.search.includes("code=") || 
            location.search.includes("error="))) {
          await auth0Client.handleRedirectCallback();
          window.history.replaceState({}, document.title, "/");
        }
      
        // Assumes a button with id "logout" in the DOM
        const logoutButton = document.getElementById("logout");
      
        logoutButton.addEventListener("click", (e) => {
          e.preventDefault();
          auth0Client.logout();
        });
      
        const isAuthenticated = await auth0Client.isAuthenticated();
        const userProfile = await auth0Client.getUser();
      
        // Assumes an element with id "profile" in the DOM
        const profileElement = document.getElementById("profile");
      
        if (isAuthenticated) {
          profileElement.style.display = "block";
          profileElement.innerHTML = `
                  <p>${userProfile.name}</p>
                  <img src="${userProfile.picture}" />
                `;
        } else {
          profileElement.style.display = "none";
        }
      });


}