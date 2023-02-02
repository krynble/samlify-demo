# samlify-demo
Demo for SSO SAML using SAMLIFY lib.

To run, simply fetch the XML Metadata file from your identity provider and replace the `idp_metadata.xml` in the root folder.

Then run `npm start` in your terminal and browse `http://localhost:3000/sso/spinitsso-redirect`

You should be redirected to your idP and then back to localhost.

### Callback URL

The callback URL is `http://localhost:3000/sso/acs` and we're using POST.
