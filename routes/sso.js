// This is /routes/sso.js
const saml = require('samlify');
const validator = require('@authenio/samlify-xsd-schema-validator');

const fs = require('fs');
const express = require('express');
const router = express.Router();
const ServiceProvider = saml.ServiceProvider;
const IdentityProvider = saml.IdentityProvider;

// Configure your endpoint for IdP-initiated / SP-initiated SSO
const sp = ServiceProvider({
    metadata: fs.readFileSync('./metadata.xml'),
});
const idp = IdentityProvider({
  metadata: fs.readFileSync('./idp_metadata.xml'),
});

saml.setSchemaValidator(validator);


// Release the metadata publicly
router.get('/metadata', (req, res) => res.header('Content-Type','text/xml').send(sp.getMetadata()));

// Access URL for implementing SP-init SSO
router.get('/spinitsso-redirect', (req, res) => {
    const { id, context } = sp.createLoginRequest(idp, 'redirect');
    return res.redirect(context);
});

// If your application only supports IdP-initiated SSO, just make this route is enough
// This is the assertion service url where SAML Response is sent to
router.post('/acs', (req, res) => {
    sp.parseLoginResponse(idp, 'post', req)
        .then((parseResult) => {
            console.log(parseResult);
            res.send(parseResult.extract.attributes);
        })
        .catch((err) => {
            res.status(400).send('Error');
        });
});

module.exports = router;