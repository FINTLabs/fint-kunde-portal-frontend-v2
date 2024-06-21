import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import "@navikt/ds-css";
import {Box, Page} from "@navikt/ds-react";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

      <Page
          footer={
              <Box background="surface-neutral-moderate" padding="8" as="footer">
                  <Page.Block gutters width="lg">
                      Footer
                  </Page.Block>
              </Box>
          }
      >
          <Box background="surface-neutral-moderate" padding="8" as="header">
              <Page.Block gutters width="lg">
                  Header
              </Page.Block>
          </Box>
          <Box
              background="surface-alt-3-moderate"
              padding="8"
              paddingBlock="16"
              as="main"
          >
              <Page.Block gutters width="lg">
                  {children}
              </Page.Block>
          </Box>
      </Page>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
