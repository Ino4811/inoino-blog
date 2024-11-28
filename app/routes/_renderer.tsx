import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

import { Header } from '../component/layout/header'
import { Footer } from '../component/layout/footer'

const globalClass = css`
  :-hono-global {
    html {
      font-family: Arial, Helvetica, sans-serif;
      body {
        margin: 0;
        padding: 0;
        main {
          width: min(900px, 90%);
          margin: auto;
        }
      }
    }
  }
`

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <Script src="/app/client.ts" async />
        <Style />
      </head>
      <body class={globalClass}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
})
