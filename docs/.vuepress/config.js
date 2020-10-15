module.exports = {
  title: 'My blogs write by VuePress',
  description: 'My description',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  host: 'localhost',
  port: 3000,

  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Press',
      description: 'Hello VuePress from Quang Phu',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'caaa',
      description: 'cac',
    },
  },

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/guide/' },
      { text: 'Help', link: 'https://google.com' },
      {
        text: 'Product',
        items: [
          { text: 'Book', link: '/' },
          { text: 'Pen', link: '/' },
        ]
      }
    ],
    sidebar: [
      {
        title: 'Group 1',   // required
        path: '/foo/',      // optional, link of the title, which should be an absolute path and must exist
        collapsable: true, // optional, defaults to true
        sidebarDepth: 2,    // optional, defaults to 1
        children: [
          '/'
        ]
      },
      {
        title: 'Group 2',
        children: [ /* ... */ ],
        initialOpenGroupIndex: -1 // optional, defaults to 0, defines the index of initially opened subgroup
      }
    ]
  },
}
