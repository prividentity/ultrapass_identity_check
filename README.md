# UltraPass Verified Identity - PreBuilt Webpages

This repository includes the front-end code for pre-built web pages used in the Identity Verification module, which can be accessed at https://cams.ultrapass.id/. 
These pages are built with React.js, Material UI, TypeScript.

The repository also contains code examples for React.js and Node.js/Express that demonstrate how to call these pre-built web pages and perform identity verification.

The [env.example](env.example) file contains the environment variables that are need to configure the application. Add your API key
under REACT_APP_API_KEY.

To customize the verification session for your specific use case, you can update the configuration in [src/config.ts](src/config.ts). This file contains the configuration used to create the verification session and can be adjusted as needed.

## Testcases
https://docs.google.com/document/d/1uY8ByiiWvXWRNp02wtQAoJqqINNoRR9p2M9znsApV3Q/edit#bookmark=id.bmhpnf16t9l4


## Code examples

### Frontend

#### Install dependencies
```javascript
npm i react
```

```javascript
import React from 'react';

function IdentityVerificationButton() {
  const handleVerify = () => {
    // this is going to be a POST request to your server(example down below)
    await fetch("https://my-server.com/session", { method: "POST" });
  };

  return <button onClick={handleVerify}>Verify your identity</button>;
}

export default IdentityVerificationButton;
```

### Backend

#### Install dependencies
```javascript
npm i express @privateid/cryptonets-web-sdk
```

```javascript
import express from "express";
import { createVerificationSession } from "@privateid/cryptonets-web-sdk";

const app = express();
const PORT = process.env.PORT;

app.post("/session", async (req, res) => {
  const result = await createVerificationSession({
    //(The URL to redirect to on success),
    successUrl: "https://www.success.com",
    // (The URL to redirect to on failure),
    failureUrl: "https://www.failure.com",
    // The type of session to create. Can be "IDENTITY" or "AGE"
    type: "IDENTITY",
    //(This is the API value for the product group associated with this session)
    // We already have test product group built on the orchestration layer with an ID of intergalactic
    productGroupId: "process.env.MY_PRODUCT_GROUP_ID" || "intergalactic",

    // Details about the transmittal of user details back to the client
    // After the user completes the verification process,
    // the orchestration layer will transmit the user details back to this URL
    transmitUserDetails: {
      // url to transmit user details to
      url: "https://www.transmituserdetails.com",
      // HTTP method to use when transmitting user details
      method: "POST",
      // HTTP headers to use when transmitting user details
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 1234",
        //... any other headers included in the request
      },
    },
  });
  //result will be an object with the following structure {
  // url:”https://cams.ultrapass.id?token=1223”,
  // token:”1223”
  // }

  res.redirect(result.url);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
