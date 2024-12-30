import { css, Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

import { Header } from '../component/layout/header'
import { Footer } from '../component/layout/footer'

const globalClass = css`
  html {
    font-family: Arial, Helvetica, sans-serif;
    -webkit-text-size-adjust: 100%; /* Safari向けに文字サイズ調整を無効化 */
    text-size-adjust: 100%; /* 他のブラウザ向け */
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
  }
  main {
    width: min(900px, 90%);
    margin: auto;
  }
  h1 {
    font-size: 1.5em;
    margin-top: 1.75em;
  }
  h2 {
    font-size: 1.17em;
    margin-top: 1.5em;
  }
  h3 {
    font-size: 1em;
    margin-top: 1.17em;
  }
  h4 {
    font-size: 0.83em;
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
  p {
    line-height: 1.7;
    margin: 0.5em 10px;
  }
  table {
    margin: 1.2rem 16px;
    font-size: 0.95em;
  }
`

export default jsxRenderer(({ children, title, description, canonical }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonical} />
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
