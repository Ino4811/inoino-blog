---
title: "mapやfilter関数のcallbackで非同期処理を行う"
date: "2025-1-2"
tags: ["Frontend", "TypeScript"]
---

mapやfilter関数のcallbackに非同期関数を設定してうまく動かないという事案があったので、Tipsとしてまとめます。

# 非同期処理を定義する

とりあえず非同期処理を行う関数を作成してみます。3000msの間、ブロッキングをして`100`を返す非同期関数です。

```tsx
const returnPromise = async () => {
    return new Promise<number>(
        (resolve) => {
            setTimeout(() => {
                resolve(100);
            }, 3000);
        }
    );
}

const main = async () => {
    const num = await returnPromise();
    console.log(num);
}

main();
```

# 配列の各要素に対してfilter関数を適用してみる

`[1, 35, 100]`からretrunPromiseの返り値`100`を比較して同じものだけを返そうとしてみます。

理論通り動くなら、`[1, 35, 100]` が`[100]` となって出力されるはず、、、

```tsx
const returnPromise = async () => {
    return new Promise<number>(
        (resolve) => {
            setTimeout(() => {
                resolve(100);
            }, 3000);
        }
    );
}

const main = async () => {
    const array = [1,35,100];
    const filteredArray = array.filter(async (value) => {
        const num = await returnPromise();
        if (value === num) {
            return true;
        }else{
            return false;
        }
    })
    console.log(filteredArray);
}

main();
```

しかしながら、consoleに出力されるのは`[1, 35, 100]` 。

# filter関数は同期的な処理しか想定しない

```tsx
async (value) => {
    const num = await returnPromise();
    if (value === num) {
        return true;
    }else{
        return false;
    }
}
```

filter関数のcallback関数が非同期関数になっています。よって、この関数の返り値は`Promise<boolean>`が返ってきます。JSにおいて、`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`を除くすべての値は真値となるので、`Promise<boolean>`は真値になります。

https://developer.mozilla.org/ja/docs/Glossary/Truthy

そうすると、配列の各要素に対しては必ず真値（`Promise<boolean>`）が返るのでfilterされず、そのまま結果が返されてしまうわけです。

# 解決策

## Promiseをちゃんと集める

map関数を使用してPromiseを集めて、それをPromise.allで解決するまで待てば、きちんとfilterできます。

まず、Promiseを集めます。そのあと、trueになったindexに対してfilterします。

```tsx
const main = async () => {
    const array = [1,35,100];
    const promiseOfArray = array.map(async (value) => {
        const num = await returnPromise();
        if (value === num) {
            return true;
        }else{
            return false;
        }
    })
    const results = await Promise.all(promiseOfArray);
    const filteredArray = array.filter((_, index) => results[index])
    console.log(filteredArray);
}
```

このQiitaの記事を参考にしてみました。

https://qiita.com/hnw/items/f104a1079906fc5c2a96

## for文で実装する

非同期処理を使わずに行うとこうなります。

```tsx
const main = async () => {
    const array = [1,35,100];
    const filteredArray = [];
    for (const value of array){
        const num = await returnPromise();
        if(value === num){
            filteredArray.push(value);
        }
    }

    console.log(filteredArray);
}
```

## Promise.all VS for文

同じように見えて実行時間に大きな差があります。

`Promise.all`を使用する場合は`returnPromise()`が非同期で実行されるので、`returnPromise()`が並列に3つ実行されます。実行時間は約3秒です。

一方、`for文`は、`returnPromise()`が同期的に順に3つ実行されます。実行時間は3秒×3=約9秒です。

3倍時間がかかるわけで、`for文`での実装は実行時間の面で大きく劣ると考えられます。

# さいごに

Promiseで実装すれば、実行時間が短縮されるということで、非同期処理ってすごいんだなと実感できました。