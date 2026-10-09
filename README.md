# 星球识字

以星球与宇宙为兴趣场景，为 5 岁儿童设计的识字网页。已有完整功能规划、可运行骨架和 600 个可选常用字。

## 在线访问与部署

在线地址：https://cl1107.github.io/planet-literacy/

GitHub 仓库：https://github.com/cl1107/planet-literacy

推送到 `main` 后，GitHub Actions 自动安装依赖、运行测试、构建并部署到 GitHub Pages。也可在 Actions 中手动运行 `Deploy to GitHub Pages`。Pages 发布源使用 GitHub Actions；构建资源采用相对路径，支持仓库子目录访问。

## 启动

需要 Node.js 22.12+，推荐 Node.js 24 LTS。

```sh
npm ci
npm run dev
```

Vite 默认地址为 http://localhost:5173。端口被占用时以终端输出为准。

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## 技术栈

React 与 React DOM 19.3.0、TypeScript 7.0.2、Adobe React Spectrum 3.47.5、Vite 8.3.2。使用正式版本，精确版本与依赖树保存在 package-lock.json。

## 当前可用

- React Spectrum 中文 Provider、响应式页面骨架及七个模块入口。
- 六个探索主题、600 个不重复的常用汉字，分为初识、进阶、继续探索各 200 字，每字都有词境拼音、例词和短句。
- 首页按主题和分级浏览，每组最多 3 字，可继续换组；完整字库可按汉字、词语或带/不带声调拼音搜索，并按分级和主题筛选。
- 字库每页 24 字，字卡可直接打开对应主题的识字页面；清空查询和更换筛选时回到第一页。
- 点击大字或“读这个字”朗读单个汉字；“读给我听”朗读词语和例句。声音和拼音开关只在本次打开期间生效。单字由系统中文语音读出，多音字的单字读音可能与例词拼音不同，可通过词语和例句确认词境读音。
- 未实现的模块展示对应规划说明，不生成虚构进度。

## 规划与后续实现

详见 [完整功能规划](docs/功能规划.md)、[学前识字依据](docs/学前识字依据.md)、[产品约定](PRODUCT.md)、[界面约定](DESIGN.md)。字库是作者整理的生活词汇素材池，三组分级是产品编排；教育部没有规定幼儿园统一必认字表或识字数量，孩子无需完成全部 600 字。
后续完成看图识字、听音选字、配对、掌握评估、真实本地记录与复习，再扩展词语游戏与规范笔顺。

当前不是完整教学产品：尚无答题评估、学习记录持久化、真人音频、笔顺素材和离线缓存。朗读依赖系统中文语音，部分设备语音可能需要联网；字体目前从 Google Fonts 加载并提供系统字体回退。初始化的 planet SVG 是主题标识，不表示天体真实比例或外观。

## 目录

```text
docs/功能规划.md       功能、流程、内容分级、数据与分期验收
src/content/types.ts   汉字、主题与分级类型
src/content/growing.ts 进阶内容
src/content/exploring.ts 继续探索内容
src/content/starter.ts 初识内容
src/content/themes.ts 唯一汉字条目与六主题索引
src/content/learning.ts 分级、搜索与每组三字浏览规则
scripts/*-characters.txt 分级维护清单（各200字）
src/components/       可复用主题图形
src/App.tsx           当前页面骨架和浏览状态
src/styles.css        视觉约定和响应式布局
```

`npm test` 校验 600 字完整性、唯一性、拼音、词句关系，以及搜索组合和完整换组遍历。pinyin-pro 仅用作开发期词境读音交叉检查，不进入网页运行依赖；工具已知的“跑得快”助词误读按有来源的词典释义核对。它不代表所有内容已经过教师专业审校。

当前没有后端，不收集儿童身份信息，不向外上传学习记录。
