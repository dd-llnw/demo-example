import { Router } from '@layer0/core'
import { isProductionBuild } from '@layer0/core/environment'
import { API_CACHE_HANDLER, EDGE_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

const router = new Router()

// Regex to catch multiple hostnames
// Any deployment will have a L0 permalink
// Don't allow Google bot to crawl it, read more on:
// https://docs.layer0.co/guides/cookbook#blocking-search-engine-crawlers
router.noIndexPermalink()

// Serve the old Layer0 predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__layer0__/:path*', 301)
})

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

// Image caching
router.match('/l0-opt', IMAGE_CACHE_HANDLER)

// Service Worker
router.match('/service-worker.js', ({ serviceWorker }) => {
  return serviceWorker('dist/service-worker.js')
})

if (isProductionBuild()) {
  // Cache but not in 0 dev mode
  router.match('/', EDGE_CACHE_HANDLER)
  router.match('/about', EDGE_CACHE_HANDLER)
  router.match('/commerce', EDGE_CACHE_HANDLER)
  router.match('/product/:name', EDGE_CACHE_HANDLER)
  router.match('/commerce/:name', EDGE_CACHE_HANDLER)
  router.static('build')
  router.fallback(({ serveStatic }) => {
    serveStatic('build/index.html')
  })
} else {
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
}

export default router
