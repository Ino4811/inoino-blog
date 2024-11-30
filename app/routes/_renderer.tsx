import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

import { Header } from '../component/layout/header'
import { Footer } from '../component/layout/footer'

const globalClass = css`
  html {
    font-family: Arial, Helvetica, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #e7e5e1;
  }
  main {
    width: min(900px, 90%);
    margin: auto;
  }
  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.17em;
  }
  h3 {
    font-size: 1em;
  }
  h4 {
    font-size: 83em;
  }
  h5 {
    font-size: 0.67em;
  }
  h6 {
    font-size: 0.5em;
  }
  a {
    word-break: break-all;
  }
`

export default jsxRenderer(({ children, title, description }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <Script src="/app/client.ts" async />
        <Style>
          {globalClass}
        </Style>
      </head>
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
})
