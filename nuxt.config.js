const axios = require('axios')
const _ = require('lodash')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css' }
    ]
  },
  css: [
    'normalize.css',
    'highlight.js/styles/hybrid.css',
    { src: '~assets/scss/main.scss', lang: 'scss' }
  ],
  // router: {
  //   routes: [
  //     { path: '/guide/:slug', component: 'pages/guide' },
  //     { path: '/api/:slug', component: 'pages/api' },
  //     { path: '/examples/:slug', component: 'pages/examples' }
  //   ]
  // },
  plugins: [
    '~plugins/ga.js',
    '~plugins/marked'
  ],
  build: {
    vendor: ['axios', 'marked', 'highlight.js'],
    extend (config, { dev, isClient }) {
      if (process.env.BUNDLE_CHECK && !dev && isClient) {
        config.plugins.push(
          new BundleAnalyzerPlugin()
        )
      }
    }
  },
  env: {
    githubToken: '4aa6bcf919d238504e7db59a66d32e78281c0ad3',
    docSearchApiKey: 'ff80fbf046ce827f64f06e16f82f1401'
  },
  loading: { color: '#41B883' },
  generate: {
    routeParams: {
      '/guide/:slug': menuToRouteParams('guide'),
      '/api/:slug': menuToRouteParams('api'),
      '/examples/:slug': menuToRouteParams('examples'),
      '/faq/:slug': menuToRouteParams('faq')
    }
  }
}

function menuToRouteParams (category) {
  return function () {
    return axios.get(`https://docs.api.nuxtjs.org/menu/en/${category}`)
    .then((res) => {
      return res.data || []
    })
    .then((menu) => {
      return _(menu)
      .map('links')
      .flatten()
      .map((m) => m.to.slice(1))
      .compact()
      .map((slug) => {
        return { slug }
      })
      .value()
    })
  }
}
