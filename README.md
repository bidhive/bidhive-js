
<p align="center" width="100%">
  <img src="https://static.bidhive.com/bidhive-icon.png" alt="Bidhive"></img>
</p>

<h1 align="center" width="100%">Bidhive JS</h1>

<p align="center" width="100%">A JavaScript library to query Bidhive from your own platform</p>

<p align="center" width="100%">NPM link can be found here: https://www.npmjs.com/package/@bidhive/bidhive</p>

### Overview

This library is built to work within an ES6 module environment. It can be used with plain JavaScript, but also contains TypeScript definitions.

### Installation

Install via either of the following, dependening on your project's package manager:

```sh
npm i @bidhive/bidhive
or
yarn add @bidhive/bidhive
```

### Getting Started

The first thing you'll need to do is register an application from your Bidhive profile:

![Empty applications](https://static.bidhive.com/documentation/register_application_empty.png)

Click "Register Application"

![Application registration](https://static.bidhive.com/documentation/register_application_modal.png)


Which should result in this:

![My Application](https://static.bidhive.com/documentation/register_application_my_application.png)

Once registered, take the client ID, client secret and redirect URI values and embed them somewhere in your own application (environment variables, pulled via API, hardcoded etc.).

**Environment Variable Example**

```sh
export CLIENT_ID=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
export CLIENT_SECRET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
export REDIRECT_URI=https://my-site.com/redirect 
```

```ts
/* At some entry point in your program */
import { initClient, AuthAPI } from "@bidhive/bidhive";

initClient({
    clientId: process.env.CLIENT_ID || "broken",
    clientSecret: process.env.CLIENT_SECRET || "broken",
    redirectUri: process.env.REDIRECT_URI || "broken"
});

AuthAPI.promptForLogin();
```

This will open a window which prompts you to login to Bidhive, if you aren't already logged in.

![Login window](https://static.bidhive.com/documentation/register_application_public_login.png)

Assuming the values you passed to ```initClient``` were correct. You will then be asked to authorise your application with the permissions selected when registering.

![Application authorisation](https://static.bidhive.com/documentation/register_application_authorisation.png)

After clicking "Allow", you're all set to start making requests on behalf of your Bidhive user!

Try a few examples:

```ts
import { BidAPI, DashboardAPI } from "@bidhive/bidhive";

async function loadBidhiveData() {
    const bids = await BidAPI.loadBids();
    console.log(`Loaded ${bids.length} bids`);

    
    const dateFrom = new Date(2021, 1, 1);
    const dateTo = new Date();
    const aggregations = await DashboardAPI.loadAggregations({
      date_from: dateFrom.toISOString(),
      date_to: dateTo.toISOString(),
    });
    console.log(aggregations);
}

loadBidhiveData();
```

Have fun!
