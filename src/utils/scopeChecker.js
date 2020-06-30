export function hasPermissions(scopes) {
    const userScopes = localStorage.getItem("scopes");
    if (userScopes) {
        const parsedScopes = JSON.parse(userScopes);
        const isAuthorized = scopes.some(element => {
            return parsedScopes.includes(element);
        });
        return isAuthorized;
    }
    return false;
}