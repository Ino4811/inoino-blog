// vite.config.ts
import ssg from '@hono/vite-ssg'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

const entry = './app/server.ts'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()],
    }
  } else {
    return {
      build: {
        emptyOutDir: false,
      },
      plugins: [
        honox(),
        ssg({ entry }),

      ],
      ssr: {
        external: [
          'debug',
          'micromark',
          'mdast-util-from-markdown',
          'remark-parse',
          'extend',
          'shiki',
          'jsdom',
        ],
      }
    }
  }
})