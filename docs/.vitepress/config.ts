import { defineConfig } from 'vitepress'
const baseAlgorithm = '/blogs/algorithm'
const baseInterview = '/blogs/interview'
const baseNginx = '/blogs/nginx'
const baseExamination = '/blogs/examination'
const baseCss = '/blogs/css'
const baseOther = '/blogs/other'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 应用层面的配置
  lang: 'en-US',
  // 渲染为： <html lang="en-US">
  title: '滚筒洗衣机', // 网站标题
  titleTemplate: 'tyBlog', // 网站标题后缀- “VitePress | Blog” 当 titleTemplate 的内容与 title 的内容相同时，不出现后缀;
  description: 'Vite & Vue powered static site generator.', // 网站描述 
  // 渲染为：<meta name="description" content="Vite & Vue powered static site generator.">
  base: '/', // base url  // 当网站部署在 GitHub Pages 或 Gitee Pages 时会存在子路径，例如：https://username.github.io/repo/ ，需要设置 base 为 /repo/;
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // 渲染为: <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    ['link', { rel: 'icon', href: '/logo.jpg' }],
    // 渲染为: <link rel="icon" href="/logo.svg" />
  ],
  appearance: true, // 外观切换 - 深色浅色
  ignoreDeadLinks: false, // 当设置为 true 时，VitePress 不会因为死链接而导致构建失败。
  lastUpdated: true, // 显示页面最后更新时间
  cleanUrls: true, // 'without-subfolders', // 删除路径中的.html后缀

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '我的博客',
        items: [
          { text: '我的掘金', link: 'https://juejin.cn/user/1996368849145096' },
          { text: 'github', link: 'https://github.com/tywd' },
          { text: 'gitee', link: 'https://gitee.com/cjty' }
        ]
      },
      {
        text: '友情链接',
        items: [
          { text: 'vue', link: 'https://cn.vuejs.org/' },
          { text: 'vitepress', link: 'https://vitepress.vuejs.org/' }
        ]
      }
    ],
    sidebar: {
      '/blogs/': [
        {
          text: '博客目录',
          items: [
            { text: '说明', link: '/blogs/' },
            { text: '算法', collapsed: true,
              items: [
                { text: '算法复杂度', link: baseAlgorithm + '/complexity' },
                { text: '十大排序',
                  collapsed: true,
                  items: [
                    { text: '冒泡排序', link: baseAlgorithm + '/sort/sortBubble' },
                    { text: '选择排序', link: baseAlgorithm + '/sort/sortSelect' },
                    { text: '插入排序', link: baseAlgorithm + '/sort/sortInsertion' },
                    { text: '归并排序', link: baseAlgorithm + '/sort/sortMerge' },
                    { text: '快速排序', link: baseAlgorithm + '/sort/sortQuick' },
                    { text: '希尔排序', link: baseAlgorithm + '/sort/sortShell' },
                    { text: '计数排序', link: baseAlgorithm + '/sort/sortCounting' },
                    { text: '桶排序', link: baseAlgorithm + '/sort/sortBuckets' },
                    { text: '基数排序', link: baseAlgorithm + '/sort/sortRadix' },
                    { text: '堆排序', link: baseAlgorithm + '/sort/sortHeap' }
                  ] 
                },
              ]
            },
            { text: '面试必用', collapsed: true,
              items: [
                { text: '手写系列', collapsed: true,
                  items: [
                    { text: '手写-call/apply/bind', link: baseInterview + '/handwriting/callApplyBind' },
                    { text: '手写-promise', link: baseInterview + '/handwriting/promise' },
                    { text: '手写-new', link: baseInterview + '/handwriting/new' },
                    { text: '手写-防抖与节流', link: baseInterview + '/handwriting/debounceThrottle' }
                  ]
                },
              ]
            },
            { text: 'nginx', collapsed: true,
              items: [
                { text: 'nginx安装介绍', link: baseNginx + '/nginx1' },
                { text: 'nginx常用命令', link: baseNginx + '/nginx2' },
                { text: 'nginx配置', link: baseNginx + '/nginx3' },
                { text: 'nginx部署vue项目', link: baseNginx + '/nginx4' }
              ]
            },
            {
              text: '简易小测试', collapsed: true,
              items: [
                { text: '数组去重', link: baseExamination + '/question1'},
                { text: 'Object/Map/Set/Array等转换', link: baseExamination + '/question2'}
              ]
            },
            { text: 'css', link: baseCss + '/css1' },
            { text: '其他', collapsed: true,
              items: [
                { text: '好文收藏', link: baseOther + '/other1' },
                { text: 'git操作记录', link: baseOther + '/git' },
              ]
            },
            // { text: '项目实战', link: '/blogs/project' }
            {
              text: 'Examples', collapsed: true,
              items: [
                { text: 'Markdown Examples', link: '/blogs/examples/markdown-examples' },
                { text: 'Runtime API Examples', link: '/blogs/examples/api-examples' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tywd' }
    ]
  },
  markdown: { // markdown 解析配置
    // theme: 'material-palenight', // 主体配色
    lineNumbers: true // 显示行号
  }
})
