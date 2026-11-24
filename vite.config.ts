import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

/** Origem (esquema + host + porta) da API, usada para liberar o connect-src. */
function apiOrigin(value: string | undefined): string {
  try {
    return new URL(value?.trim() || 'http://localhost:8000').origin
  } catch {
    return 'http://localhost:8000'
  }
}

/**
 * Content-Security-Policy gerada no build, com a origem real da API (VITE_API_URL).
 *
 * - No GitHub Pages não dá para definir headers, então a política vai em <meta>.
 *   O <meta> ignora `frame-ancestors`, por isso essa diretiva só aparece no `_headers`.
 * - No Cloudflare, o arquivo `_headers` (emitido em dist/) aplica a política como header HTTP
 *   e ainda acrescenta os demais headers de segurança.
 *
 * O build do Vite não gera scripts nem estilos inline, então `script-src` e `style-src`
 * ficam em 'self'. Só roda no `vite build`: o servidor de desenvolvimento precisa de HMR.
 */
function securityHeaders(api: string): Plugin {
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${api}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  const metaPolicy = directives.join('; ')
  const headerPolicy = [...directives, "frame-ancestors 'none'"].join('; ')

  return {
    name: 'ocean-security-headers',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: () => [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: metaPolicy },
          injectTo: 'head-prepend',
        },
      ],
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: [
          '/*',
          `  Content-Security-Policy: ${headerPolicy}`,
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
          '',
        ].join('\n'),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: '/ocean-frontend/',
    plugins: [
      react(),
      tailwindcss(),
      securityHeaders(apiOrigin(env.VITE_API_URL || process.env.VITE_API_URL)),
    ],
  }
})
