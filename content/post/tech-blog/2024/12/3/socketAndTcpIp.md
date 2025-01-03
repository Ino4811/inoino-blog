---
title: "SocketはTCP/IPの何なのか"
date: "2024-12-3"
tags: ["network", "socket", "TCP・IP"]
---

最近のネットワークの本を読んでネットワークを勉強しています。

本を読んでいて、Socketを使用してネットワークに接続する話が出てきました。

ここで、以下の点で引っかかったので、その詳細内容を記したいと思います。

- Socketとは
- SocketとTCP/IPとの関係
- TCP/IPモデルの中でSocketの役割

# Socketとは？

Socketと一緒に出てくるキーワードにPipeという言葉があります。

計算機同士の通信の際に使用する通り道のことをPipeと呼びます。そして、その口の部分をSocketと呼ぶわけです。

すなわち、通信路のトンネルの口がSocket、トンネル本体がPipeにあたります。

イメージは掴めたでしょうか。

ただネットワーク内で通り道を作るなんてイメージがわかっても、具体的に何をしているのかわかりずらい…。そもそも通り道なんてどーやって作るんだと思うわけです。

# じゃあ、Socketって具体的に何なのか？

ズバリ、Socketとは通信したい相手のIPアドレス・Port・通信状態(LISTEN?)等の情報のこと、Socketを作成するとは、その情報をもとにOS側に通信の準備をさせることです。

「通信路の口であり情報である」というとわかりづらいですが、「Socketを作る」 = 「計算機（OS）がこれから通信するための情報を整理してメモリに保存する」ことを意味します。OS側に、「これから通信します、相手はIP~~~のPort~~~にこのプロトコル(TCP?UDP?)です。メモリ準備して！」って教えるわけです。準備することが通信路の口を作ることと同義となります。

ここで注意したいのは、通信したいブラウザ等のアプリケーションはOSの機能を使って通信を行うということです。あくまでOSの機能です。

ちなみにSocketを使用した通信はSocket通信と言います。

## 例：アプリがSocketを使って通信するまで

例えば、ブラウザ等のWebアプリケーションが、サーバーと通信を行うことを考えます。

Webアプリケーションは通信したいサーバーの情報を持っています。Webアプリケーションはサーバーと通信を行いたいのですが、通信はOSの機能です。そこで、OSの機能を使用するためSocketライブラリを介してOS側にSocketを作成し接続を試みます。

アプリケーションはSocketライブラリを使用してOSの機能を使用、通信を実現します。

## Socket通信の全体像

すなわちSocketなんてしゃれた名前？を使っていますが、通信に必要な情報をOSに与え準備させることで、通信行うだけです。この情報を教え準備させることがSocketを作成することに対応します。

データの送受信は以下の手順で行われます。

1. Socketを作成
    - 通信のために必要な情報をOSに教える
    - OSはメモリ等に必要な情報を書き込み接続準備をする（このポート開けまーす的な準備）
2. 接続を試みる
    - 詳細は省きますが、ACKなんて言葉が出てきますね
3. データをやり取りする
    - Requestを送りResponseを受け取ります
4. 接続を閉じる
    - Socketを削除する（少し時間が経ってからだったりする）

# SocketとTCP/IPの関係

ここまで読んで、疑問に思うわけです。え、通信ってTCP/IPじゃないの？TCP/IPと関係ないの？と。

## どうやって通信する

TCP/IPプロトコルは相手のIPまでデータを送る規則のことです。

IP、Portを用いて相手方にデータを渡すのですが、そのデータを送り届けるための方法を決めているのがTCP/IPなわけです。

OSがデータを送る際にどこからどんなパケットにして送ろうかということを決めなければならないわけで、この時に使うのがSocketです。

|  | |
| --- | --- |
| Socket | パケットを作って送り出すための情報 |
| TCP/IP | パケットを相手方まで届ける方法の定義 |

## SocketはTCP/IPに準拠する

Socketの情報をもとにOSはパケットを作成します。Socketの情報をもとに、IPヘッダーを付けてMACヘッダーを付けてと何重にもヘッダーでくるんで送り出す形にパケットを仕上げていきます。これをSocketライブラリがやってくれるということです。

ということで、Socektライブラリが作るパケットはTCP/IP等の通信プロトコルの決められた形に加工されるわけで、Socketの情報にはこれからどんな通信プロトコルで通信するかの情報が必要になります。

Socektはパケットを作るためになんのプロトコルで送信するかの情報を含んでおり、このプロトコルの一つこそTCP/IPになります。

# TCP/IPモデルとSocket

TCP/IPモデルにおけるSocketはアプリケーション層を補完します。アプリケーション層（ブラウザ等）から通信を始めたい時の便利ツールと思えばいいです。そして、TCP/IPの通信をより簡単に出来るようなライブラリがSocketライブラリなわけです。

# まとめ

TCP/IPとSocketの関係を理解できましたでしょうか。初学者にとってはつまずきやすい部分であり、意外とあやふや理解の人も多いと思います。役に立てると幸いです。大学の授業で扱った、OSSのプロキシサーバーのプログラムが何を意味していたのか、当時わからなかった部分が分かった気がしました。