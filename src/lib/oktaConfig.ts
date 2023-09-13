export const oktaConfig = {
    clientId: '0oab0c3ozjCkS8uhg5d7',
    issuer: 'https://dev-70715310.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    features: {
        registration: true // Enable self-service registration
    }
};
