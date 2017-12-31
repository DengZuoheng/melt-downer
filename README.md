# Melt Downer

## 这是什么

Melt Downer是一个简单的omnibox搜索扩展, 主要目的是在使用不同搜索引擎时, 可以直接在omnibox输入关键词及参数, 而不用打开该搜索引擎然后再输入关键词. 

比如, 在必应中搜索`手办`:
    
    $ 手办 @bing

再比如, 在百度中搜索`维生素`:

    $ 维生素 @baidu

并且, 对于谷歌高级搜索的某些参数进行缩写:

比如, 日常使用的 `c++ vector push_back site:stackoverflow.com` :

    $ c++ vertor push_back s:so

再比如, github又被墙了(过去24小时的结果):

    $ github 被墙 last:24h

## 如何安装

目前并没有上传到chrome应用商店, 要使用, 需要:

1. 打开chrome://extensions/
2. 勾上`开发者模式`
3. 加载已解压的扩展程序
4. 选择此代码所在的目录(manifest.json所在目录)
5. 测试一下

## 如何使用

1. 清空地址栏
2. 输入`$`, 空格, 进入Melt Downer
3. 输入关键词及参数, 回车
4. 没反应? 报bug吧

## 目前支持的

- google : 基本搜索以及部分高级搜索的参数
- baidu : 基本搜索
- bing : 基本搜索

## 谷歌高级搜索

### site
   
    - c++ s:so
    - c++ site:so
    - c++ site:stacjoverflow.com

被缩写的网站可以`GoogleSearchURLGenerater.getParamAlias()["values"]["as_sitesearch"]`找到和修改.

### lang(仅显示某个语言的结果)

    - 手办 lang:jp // 日语
    - c++ lang:chs // 简体中文

被缩写的语言代码可以再`GoogleSearchURLGenerater.getParamAlias()["values"]["lr"]`

### time/last(仅显示最近的结果)

    - github 被墙 last:week

`GoogleSearchURLGenerater.getParamAlias()["values"]["as_qdr"]`

### filetpye

    - xxx-233 file:bt
    - xxx-233 filetype:torrent

`GoogleSearchURLGenerater.getParamAlias()["values"]["as_filetype"]`