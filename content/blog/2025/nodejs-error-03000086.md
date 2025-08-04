---
date: 2025-06-07
description: "本文解决了Node.js v17及以上版本中因OpenSSL 3.0兼容性问题导致的`error:0308010C:digital envelope routines::unsupported`错误。文章提供了三种解决方法：设置`NODE_OPTIONS=--openssl-legacy-provider`环境变量、修改`package.json`脚本或降级Node.js版本。"
tags: ["Node.js", "OpenSSL", "Webpack"]
---

# nodejs opensslErrorStack 错误

报错信息如下

```bash
❯ npm run build

> script-server@1.18.0 build
> vue-cli-service build

Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme

⠹  Building for production...Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:471:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:503:5
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:358:12
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:236:3
    at runSyncOrAsync (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:130:11)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:232:2)
    at Array.<anonymous> (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:205:4)
    at Storage.finished (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:471:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:503:5
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:358:12
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:236:3
    at runSyncOrAsync (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:130:11)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:232:2)
    at Array.<anonymous> (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:205:4)
    at Storage.finished (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:471:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:503:5
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:358:12
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:236:3
    at runSyncOrAsync (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:130:11)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:232:2)
    at Array.<anonymous> (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:205:4)
    at Storage.finished (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9
⠙  Building for production...Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
⠦  Building for production.../home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:114
                        throw e;
                        ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:69:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:471:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:503:5
    at /home/frey/workspace/project/script-manager/web-src/node_modules/webpack/lib/NormalModule.js:358:12
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:236:3
    at context.callback (/home/frey/workspace/project/script-manager/web-src/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /home/frey/workspace/project/script-manager/web-src/node_modules/cache-loader/dist/index.js:147:7
    at /home/frey/workspace/project/script-manager/web-src/node_modules/graceful-fs/graceful-fs.js:61:14
    at FSReqCallback.oncomplete (node:fs:192:23) {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v18.20.5
```

## 主要原因

这通常是由于 Nodejs 版本与 OpenSSL 3.0 (默认禁用了某些加密功能) 不兼容导致的，这个错误通常出现在 Node.js 17 版本及更高版本中。

## 解决方法一

设置环境变量，告诉 Node.js 使用 OpenSSL 3.0 的传统加密功能。

**在 Windows 上(CMD)**

```cmd
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

**在 Windows 上(PowerShell)**

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run build
```

**在 macOs 或 Linux 上**

```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

## 解决方法二

修改`package.json`, 运行命令前设置环境变量

```json
{
  "scripts": {
    "serve": "NODE_OPTIONS=--openssl-legacy-provider vue-cli-service serve",
    "build": "NODE_OPTIONS=--openssl-legacy-provider vue-cli-service build"
  }
}
```

## 解决方法三

将 Nodejs 降级到 v16.x 版本
