---
title: "Dockerをツールとして使う"
date: "2024-12-30"
tags: ["Docker"]
---

Dockerの使い方について、本や見聞きしたことの一部をまとめてみました。

# Dockerの使用例

- 開発環境の提供
    
    Linux、Windows、Mac、環境に関係なく同じ環境をDockerを介することで用意できる。
    
- 一つの物理マシン上で、複数のサーバーを立てる
- **ツールを提供する**

最後の**ツールを提供**を目的に使用される玄人の方の話を聞いたので、それについて簡単にまとめていきます。Dockerをツールとして使用することが出来るようです。

# Dockerの基本

まずは、Dockerの基本の話を少し。

たとえば、`nginx`のサーバーを立ててみます。

`/test`ディレクトリを作って、DockerFileを作ります。

```docker
FROM nginx:1.27.3
```

DockerFileは

1. **docker build**
2. **docker run**

の順で起動します。

```bash
docker build -t inoino-v1
docker run -p 80:80 -t inoino-v1
```

`localhost:80`でnginxの画面が確認できれば、成功です。

## インストラクション

DockerFile内に書かれる、いくつかのインストラクションについて説明します。

- **FROM**： 元となるDockerファイルの名前、Defaultの取得先はDocker HUB
- **WORKDIR**：bashとかでログインした時の、最初のディレクトリの設定
- **RUN**：**docker build 時**に実行されるブロック
- **CMD**：**docker run 時**やcompose upなど、起動時に実行される

※ CMDは一つだけ

# CMDを上書きする

現状のDockerFileはこんな感じ

```docker
FROM nginx:1.27.3
```

この場合、CMDはないですが、FROMで読み込まれているファイル内で定義されています。

以下のリンクのファイル内でCMDが書かれています。

https://github.com/nginxinc/docker-nginx/blob/d21b4f2d90a1abb712a610678872e804267f4815/mainline/debian/Dockerfile

具体的には以下のように

```docker
CMD ["nginx", "-g", "daemon off;"]
```

すなわち、**docker run時**（起動時）に上の**CMD**が呼び出されてnginxが起動します。

## DockerFileで上書き

DockerFileに**CMD**を記述すれば、FROMで読み込まれているnginxのCMDは実行されません。

```docker
FROM nginx:1.27.3

CMD touch /tmp/aaa.txt
```

この状態で、DockerFileを実行してみます。

```bash
docker build -t inoino-v1
docker run -p 80:80 -v ./:/tmp -it inoino-v1
```

マウントしたディレクトリに`aaa.txt`が作成され、Dockerが終了します。

## CLIのコマンドから上書き

**docker run時**（起動時）にはDefaultではCMDが実行されますが、CMDの代わりにDockerコンテナ内で実行できるコマンドなら実行できます。

例えば、こんな風に

```bash
docker run -p 80:80 -v ./:/tmp -it inoino-v1 touch /tmp/ccc.txt
```

この方法でも、マウントしたディレクトリに`ccc.txt`が作成されます。

# ツールをDockerで使用する

上で通常のCMDでnginxを起動する代わりに`ccc.txt`や`aaa.txt`を作成できました。

この特性を使用してツールとして使用することが出来るわけです。Docker内でツールを作成して、CMDを実行する代わりに、実行時にそのツールを実行するわけです。

# 最後に

内容は薄いですが、Dockerにこんな使い方もあると知られるのはいいことだと思ったため、記事として記述してみました。誰かのなにかになりますように。