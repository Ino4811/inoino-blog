// vite.config.ts
import ssg from '@hono/vite-ssg'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

const entry = './app/server.ts'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      server: {
        host: true,
        port: 5174,
      },
      plugins: [client()],
    }
  } else {
    return {
      server: {
        host: true,
        port: 5174,
      },
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
          'playwright',
          "axios",
        ],
      }
    }
  }
})