# FINT KUNDE PORTAL FRONTEND V2

## Setup environment

## Create a `.env` file in root directory.

```
API_URL=http://localhost:<BACKEND_API_PORT>
PERSONALNUMBER=<YOUR PERSONAL NUMBER>
ZENDESK_API_URL=<BACKEND_ZENDESK_PORT>
CYPRESS_TESTS=true

CONSENT_API_URL=http://localhost:<BACKEND_API_PORT>
LINKWALKER_API_URL=http://localhost:<BACKEND_API_PORT>
NODE_ENV=development
PERSONALNUMBER=<PERSONALNUMBER>
BEARER_TOKEN=<Bearer token>
```

Remember to start up backends for each area you are connecting to locally. 
A bearer token is necessary for local connection to Samtykke backend.

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

-   `build/server`
-   `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
