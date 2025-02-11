---
title: "Docker imageの選択基準"
date: "2025-2-11"
tags: ["Docker", "Linux"]
---


この記事は以下の記事の内容を改変・追記し自分なりにまとめたものです。

https://levelup.gitconnected.com/alpine-slim-stretch-bookworm-bullseye-buster-jessie-which-docker-image-should-i-choose-500f8c15c8cf

# DockerとLinuxのimage

DockerFileを作る時は、imageのもととなるimageを指定します。以下のようにbaseはnodeのimageをもとに、deployは`nginx-alipine`をもとに新しいimageを作成しています。

```docker
FROM node:22 AS base
WORKDIR /app
FROM base AS build
COPY ./vite-project /app
RUN npm install && npm run build

FROM nginx:1.27.3-alpine AS deploy
COPY --from=build /app/dist /usr/share/nginx/html
```

nodeとnginxとか便利なimageがたくさんあります。しかし、単なるLinuxディストリビューションを使用しようとするとその選択肢の多さに驚かされます。

`alpine`, `slim`, `bookworm`, `bullseye`, `stretch`, `buster`, `jessie`, `slim-bookworm`などなど。どれだけあんだ！

これらのLinux達はOSの仕組みや初期にインストールされているライブラリが異なるわけで、不要なライブラリを多く含んだものを選択するとimageは大きくなるし、逆にRUNでimage作成中に大量のライブラリをインストールする羽目になる可能性がある。

結局はOSに何ができるのかを知らないと選択すらできないということになる。

# Linuxディストリビューションの基本知識

そもそもLinuxディストリビューションに何があるかは知るべきなので、必要なものだけまとめる。

![GNULinuxuTree.jpg](/2025/2/11/GNULinuxTree.jpg)

こんな感じでたくさんのバージョンがある。

Dockerの場合は

`Debian` `alpine`等が使われることが多そう。（経験談）

これらのLinuxを基本のimageとして、NodeとかWordpressとか公式のDockerFileが作られてる。

## alpine

https://qiita.com/ryuichi1208/items/6020cfabc92bd8153654

`alpine Linux`は軽量なLinuxとして知られている。パッケージ管理はapkで行われる。

軽量なのでDockerのimageに採用されることがある。

## Debian

https://ja.wikipedia.org/wiki/Debian%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E5%B1%A5%E6%AD%B4

`Debian`はDebian Projectらによって作成されているオペレーティングシステム。

`Debian`の各Versionには名前が付けられている。以下の通り.

Dockerのimageはこの名前がよく出てくるので最新のものが`bookworm`であることぐらいは知るべきだろう。

| Version | name |
| --- | --- |
| 8 | jessie |
| 9 | stretch |
| 10 | buster |
| 11 | bulleye |
| 12 | bookworm |

# Simple Tags と Shared Tags

docker の元imageを指定する際は、`Simple Tags`と`Shared Tags`の二つがある。

これを詳しく理解するなら、`Multi-pratform image`について知る必要がある。

## Multi-platform image

https://docs.docker.com/build/building/multi-platform/

### コンテナとホストの互換性問題

コンテナはDocker Engineが動いているホストのカーネルを共有する。そのため、コンテナ内で実行されるコードはホストのOS・アーキテクチャとの互換性がある必要がある。

`windows/amd64`のホストから`linux/amd64`のコンテナを実行することはできない。

また、`linux/amd64`のコンテナを`linux/386`で動かすことはできない。

互換性のあるimageじゃないと動かないので、適したimageを選択する必要がある。

> WindowsでDockerを使う場合、Docker DesktopとWSLで環境構築するとLinuxカーネルで実行される。どうやらWindowsカーネルで実行する方法もあるらしい…
> 

### Multi-platform imageで互換性の問題を解決する

`Multi-platform image`は複数のOS・アーキテクチャで動かせるimage。dockerはimageをPullするとレジストリからホストのOS・アーキテクチャに合わせたimageが取得される。

ちなみに**`Multi-platform image`**に対して、一つのOS・アーキテクチャで動かすimageは**`single-platform image`**という

これをうまく使うことで、**異なるタイプのハードウェアで同じイメージを実行**できる。

## Simple Tags

単一プラットフォーム専用のイメージ。Linux専用のイメージなど…

アーキテクチャの違いは吸収されていることに注意

## Shared Tags

複数のプラットフォームやアーキテクチャ向けにビルドされたイメージの集合体

## Docker Hubで様子を見てみる

pythonの公式イメージを見てみる。

https://hub.docker.com/_/python

Simple TagsとShared Tagsの一覧がOverviewから見れる。該当するTagについてTagsの情報を見てみる

### Simple Tagsの中身

https://hub.docker.com/_/python/tags?name=3.14.0a4-bookworm

![SimpleTags.png](/2025/2/11/simpleTags.png)

 `3.14.0a4-bookworm` を見てみるとlinuxの複数のアーキテクチャに対応した`Multi-platform image`が見れる。`Simple Tags`だから`Single-platform image`であるわけではない。

### Shared Tagsの中身

https://hub.docker.com/_/python/tags?name=3.14.0a4&ordering=-name

![sharedTags.png](/2025/2/11/sharedTags.png)

 `3.14.0a4` を見てみると、`3.14.0a4-bookworm` と比較してWindows用のimageも追加で確認できる。

WindowsとLinuxの両方で使用できることがわかる。

## 選定基準

ビルド対象のプラットフォームが決まっている場合

→ `Simple Tags`

複数のプラットフォームで動作させる必要がある場合

→ `Shared Tags`

# Full official image

`python:3.11.4`のような必要なツールやライブラリが全て揃っているもの。他のイメージはこのFull imageのサブセットで、後から不足しているツールを自前でインストールする必要がある可能性がある。

例えば、`python:3.11.4-slim`とか。

## 問題点

- Full official imageは大きなimageになるので、ビルド時間が長くなりがちである。
- 不要なファイルやパッケージにも脆弱性を含む可能性がある。

## 選定基準

開発環境でプロジェクトを素早く立ち上げる場合 → `Full official image`

prd環境にデプロイする場合 → その他のサブセットのimage

# -bookworm / -bullseye / -stretch / -jessie

DebianのVersionが指定されている。

`-[name]`で Debian の各リリースのコードネームを示す。

- **Bookworm**: 2025/2/11現在の安定版（Debian 12）
- **Bullseye**: Debian 11
- **Buster**: Debian 10
- **Stretch**: Debian 9
- **Jessie**: Debian 8

## 選定基準

特定のVersionのDebianが実行環境として必要な場合 → Debianのリリース別イメージ

# -slim image

フルイメージから不要な部分を削ぎ落としたバージョン。

Python や Node.js の場合、実行に必要な最低限のパッケージのみを含み、サイズが大幅に小さくなる。

動作中に不足しているツールが原因でエラーが発生する場合があるので十分なテストが必要になる。

## 選定基準

スペースに制約がある場合 → `-slim image`

# -slim-bookworm / -slim-bullseys

Slim イメージと特定の Debian リリース（例：Bookworm, Bullseye）を組み合わせたもの。

# -alpine image

とても小さいサイズのイメージ。ただ、Debianベースのパッケージとの互換性問題があり、Pythonの一部Wheelは再コンパイルが必要な場合がある。apkコマンドでパッケージを管理する。

# -windowsservercore image

 Windows や Windows Server 専用で動作するimage

# イメージサイズの比較

![imageSize.png](/2025/2/11/imageSize.png)

`alpine`、`-slim-bookworm`、`-bookworm`の順でサイズが大きくなっていることがわかる。