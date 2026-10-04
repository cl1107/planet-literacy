# 星球识字

以星球与宇宙为兴趣场景，为 5 岁儿童设计的识字网页。本轮完成完整功能规划与项目初始化。

## 启动

需要 Node.js 22.12+，推荐 Node.js 24 LTS。

```sh
npm ci
npm run dev
```

Vite 默认地址为 http://localhost:5173。端口被占用时以终端输出为准。

```sh
npm run typecheck
npm run build
npm run preview
```

## 技术栈

React 与 React DOM 19.3.0、TypeScript 7.0.2、Adobe React Spectrum 3.47.5、Vite 8.3.2。使用正式版本，精确版本与依赖树保存在 package-lock.json。

## 已初始化

- React Spectrum 中文 Provider、响应式页面骨架及七个模块入口。
- 六个探索主题、18 个不重复的示例汉字，可切换主题、浏览前后字、从字库打开字卡。
- 用户触发的设备中文朗读；声音和拼音开关。设置只在本次打开期间生效。
- 未实现的模块展示对应规划说明，不生成虚构进度。

## 规划与后续实现

详见 [完整功能规划](docs/功能规划.md)、[产品约定](PRODUCT.md)、[界面约定](DESIGN.md)。首阶段完成看图识字、听音选字、配对、掌握评估、真实本地记录与复习；后续扩展词语、笔顺和完整字库。

当前不是完整教学产品：尚无答题评估、学习记录持久化、真人音频、笔顺素材和离线缓存。朗读依赖系统中文语音，部分设备语音可能需要联网；字体目前从 Google Fonts 加载并提供系统字体回退。初始化的 planet SVG 是主题标识，不表示天体真实比例或外观。

## 目录

```text
docs/功能规划.md       功能、流程、内容分级、数据与分期验收
src/content/themes.ts  初始化内容种子与领域类型
src/components/       可复用主题图形
src/App.tsx           当前页面骨架和浏览状态
src/styles.css        视觉约定和响应式布局
```

后续达到首阶段范围后再拆分 features/learning、review、collection 等模块。当前没有后端，不收集儿童身份信息，不向外上传学习记录。
