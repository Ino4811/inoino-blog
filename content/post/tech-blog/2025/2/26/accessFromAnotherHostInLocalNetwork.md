---
title: "Viteで同一ネットワークの別のHostからアクセスするまで"
date: "2025-2-26"
tags: ["network", "TCP・IP", "Hono", "Vite"]
---

環境はWindows11 + WSL2 + Vite(HonoX)です。

# 開発環境などのアクセスの詳細

## localhostでのアクセス

`localhost`はHost自身を表す特別なアドレス。デフォルトは`127.0.0.1`になっている。

Viteで作成したプロジェクトの開発環境を立ち上げる時は`pnpm run dev`とかする。

開発時には、開発しているHost(PC)でWebサーバーを立ち上げて、それにHost自身のブラウザからアクセスする。

自分のHost自身にアクセスしたい → `localhost(127.0.0.1)`にアクセスすればよい。

![accessFromLocalhost.jpg](/2025/2/26/accessFromLocalhost.jpg)

サーバーを立てる場合に、Viteはデフォルトで`localhost`をbindしてListenしている。（localhostからのアクセスを受け付けるようにサーバー設定して起動する。）

## 別のHostからアクセス

例えば同一ネットワーク内のiPhoneなりiPadなりにアクセスする場合は別の端末からWebサーバーを立てたHostのIPアドレスに対してアクセスをする必要がある。

![accessFromAnotherHost.jpg](/2025/2/26/accessFromAnotherHost.jpg)

ただ、サーバーを立てる場合、Viteはデフォルトで`localhost`をbindしてListenしていて、自身のIPアドレス（`198.168.0.1`）はbindしておらずListenしていないため、アクセス不可である。（bindとはサーバーが起動したときに）

## （補足） 0.0.0.0にアクセスする

https://qiita.com/amuyikam/items/0063df223aed40193ba9

`0.0.0.0`は住所不定のIPアドレス。0.0.0.0へブラウザがアクセスを試行すると、OSによってはカーネルが`localhost`にルーティングして、迷子にならずに自分自身へアクセスできることがある。

![accessTo0.jpg](/2025/2/26/accessTo0.jpg)

# 問題発生？

Host自身はlocalhostでアクセスできる。が、自身のIPアドレスでbindしておらずListenしていないため同一ネットワークの別のHost（iPhone・iPadとか）からのアクセスはできない。（自身のIPアドレス（`198.168.0.1`）はbindしておらずListenしていないため。）

iPadからデバッグしたい時にかなり不便。

# iPad（別のHost）からアクセスできるようにする

Webサーバーの設定とOSの二つで通信を許可する必要がある。

## ① 0.0.0.0にbindする（サーバーの設定）

`0.0.0.0`はワイルドカード的なもので、`0.0.0.0`をバインドすると、システム上のすべてのネットワークインターフェースに対してListen状態になる。すなわちHost自身のIPアドレス（`198.168.0.1`）もループバックアドレス（`localhost` = `127.0.0.1`）からもWifiのIPアドレスからもアクセスできることになる。

![allowAllAccess.jpg](/2025/2/26/allowAllAccess.jpg)

セキュリティ上の問題があるようなので、開発環境に限るらしいが…

### Viteで設定する

https://qiita.com/Junpei_Takagi/items/3615505dcabd2e97f3e1

https://ja.vite.dev/config/server-options#server-host

`vite.config.ts`の`server.host`を`true`にすると開発サーバーを立ち上げる際に`0.0.0.0`をバインドしてくれる。該当箇所は以下の通り。

```tsx
export default defineConfig(({ mode }) => {      
  server: {
    host: true,
    port: 5174,
  }
}
```

### （付録）WSLでサーバーを立てている人

https://learn.microsoft.com/ja-jp/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan

WSLを使用してる人は外部からのアクセスをWindowsPCのHostからWSLにポートフォワーディングする必要があるので注意。listenしたものをWSL側にConnectする。

すなわちWindowsHostがListenするIPとポート + WindowsHostと接続するWSL側のIPとポートを設定する。

詳細はMicrosoftを参照してほしいが、端的に以下のコマンドを実行した。

**WindowsHostのIPとポート**

`listenport`：WindowsがListenしたいポート（ブラウザがアクセスするときに指定するポート）

`listenaddress`：WindowsがListenしたいIPアドレス。iPadからアクセスしたいならiPadのアドレス。

**WSLのIPとポート**

`connectport`：WSL側につなぎたいポート（WSLで起動しているWebサーバーのポート）（今回は`5147`で起動している）

`connectaddress`：WSLのIPアドレス

```tsx
netsh interface portproxy add v4tov4 listenport=5174 listenaddress=0.0.0.0 connectport=5174 connectaddress=[wslのIPアドレス]
```

## ② Windowsのファイアーウォールの設定（OSの設定）

①で設定したサーバーへのアクセスをOS側で許可しないとOSに弾かれてしまう。

ということで、ファイアーウォールの設定で通信を許可する。

**設定項目**

- 規則の種類：ポート
- プロトコル：TCP
- ポート：WindowsHostのポート（自分の場合は`5127`）を指定
- 通信形態：保護されていない通信も許可
- プロファイル：プライベートネットワークに限定
- 規則の名前：WSL接続用設定？わかりやすい名前を付ける

## ③ 接続してみる

iPadから接続してみる。接続はWindowsのIPアドレスとポートにアクセスすればいい。（自分の環境では`http://192.168.1.161:5147`だった。PowerShellで`ipconfig`で調べればわかる。）

結果以下のようにWebサーバーとOSのファイアーウォールの設定をして同一ネットワークからのアクセスを有効にした。

![abstructAllowAllAccess.jpg](/2025/2/26/abstructAllowAllAccess.jpg)

# まとめ

いやー、`0.0.0.0`や`localhost`に始まり、長い道のりだった。bindとかport周りの知識は若干怪しいけど、開発環境を整えられたからよし。

## 参考

https://zenn.dev/shake_sanma/articles/1c6475ba73da48

https://mseeeen.msen.jp/connect-to-wsl-hosted-server-from-external-devices/