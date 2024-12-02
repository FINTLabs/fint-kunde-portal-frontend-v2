# FINT KUNDE PORTAL FRONTEND V2

## Setup environment

## Create a `.env` file in root directory.

```
API_URL=http://localhost:<BACKEND_API_PORT>
ZENDESK_API_URL=<BACKEND_ZENDESK_PORT>
LINKWALKER_API_URL=http://localhost:<BACKEND_LINK-WALKER_PORT>
CONSENT_API_URL=http://localhost:<BACKEND_SAMTYKE_PORT>
TEST_RUNNER_API_URL=http://localhost:<BACKEND_TEST-RUNNER_PORT>

CYPRESS_TESTS=false
LOG_LEVEL=debug
NODE_ENV=development
```

Remember to start up backends for each area you are connecting to locally. 
A bearer token is necessary for local connection to Samtykke backend.
### Environment Variables Explained

#### LOG_LEVEL

The `LOG_LEVEL` environment variable controls the verbosity of logging in the application. You can set it to one of the following levels:

| Level   | Description       |
|---------|-------------------|
| `error` | Only log errors   |
| `warn`  | Log warnings and errors |
| `info`  | Standard log messages, warnings, and errors |
| `http`  | HTTP logs along with info, warnings, and errors |
| `verbose` | More detailed logs |
| `debug` | Debug-level logs for troubleshooting |
| `silly` | Most detailed log level for in-depth analysis |

### Start locally:
1. **Start Port Forwarding**  
   Run the provided script:
   ```bash
   ./startUpForwards.sh
   ```
1. **Start React**  
   Run the provided script:
```sh
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

Tailwind, Aksel, and Novari-theme