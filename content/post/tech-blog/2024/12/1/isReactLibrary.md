---
title: "React, Vue, Next, NuxtはFrameworkなのかLibraryなのか"
date: "2024-12-1"
tags: ["Frontend", "react"]
---

勉強していく中で、ReactってFrameworkなのかLibraryなのかよくわからなくなったので調べてみた。

# そもそもFrameworkとLibraryの違いとは

結論は、単体で完結するかしないか

- Framework
    - 単体で完結する。
    - アプリケーションに必要な機能が一通り実装されているもの
    - カレーを作る時に、全ての具材がそろっている状態？
    - 主導権はFramework：Frameworkのルールにのっとってコードを記述する。
- Library
    - 単体で開発に必要な機能を全て賄うことはできない
    - カレーを作る時に、カレー粉を一から作らず、カレールーを使うみたいな状態？
    - 主導権はプログラマー：コードを書く際に、プログラマーはライブラリを決定し、使用する。
    

# 分類

分類分けすると以下のようになるらしい

（そもそもFrameworkとLibraryの境界は曖昧な気もするので諸説あるかも…）

| Framework | Library |
| --- | --- |
| Nuxt.js , Vue.js |  |
| Next.js | **React.js** |

# 結論

ReactはFrameworkではない！ReactはFacebookが提供するLibraryというのが結論かな。