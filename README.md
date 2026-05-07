# FINT Kundeportal Frontend v2

## Local setup

### 1) Install dependencies

```sh
npm install
```

### 2) Create `.env` in project root

Use these values for local development:

```env
API_URL=http://localhost:<BACKEND_API_PORT>
LINKWALKER_API_URL=http://localhost:<BACKEND_LINKWALKER_PORT>
CONSENT_API_URL=http://localhost:<BACKEND_CONSENT_PORT>
TEST_RUNNER_API_URL=http://localhost:<BACKEND_TEST_RUNNER_PORT>
ACCESS_URL=http://localhost:<BACKEND_ACCESS_PORT>

# Optional
ANALYTICS_URL=http://localhost:<ANALYTICS_PORT>
VITE_MOCK_CYPRESS=false
```

### 3) Start port forwarding (optional but common locally)

```sh
./setUpLocalForwards.sh start
```

Stop forwarding:

```sh
./setUpLocalForwards.sh stop
```

### 4) Start app

```sh
npm run dev
```

### 5) Required request header for backend calls

The app forwards `x-nin` to backend APIs. For local testing, ensure requests include:

```txt
x-nin: YOUR_XNIN
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - build production artifacts
- `npm start` - run built server (`build/server/index.js`)
- `npm run lint` - run ESLint
- `npm run typecheck` - generate route types and run TypeScript
- `npm run test:unit` - run Vitest
- `npm run test:e2e` - run Cypress
- `npm run coverage` - run unit tests with coverage

## Production build output

Deploy output from:

- `build/server`
- `build/client`

## Styling

This project uses Tailwind CSS, Aksel, and Novari theme styles.