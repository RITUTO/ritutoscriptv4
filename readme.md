## 導入方法

まずリリースから最新のバージョンを入れます
そして適当なフォルダーを作って入れましょうこれで導入は完了です

## 実行

exe を実行するだけでも起動できます exe を直接実行すると node を起動した時みたいに直接書き込んで実行できます

## 導入方法

まずリリースから最新のバージョンを入れます
そして適当なフォルダーを作って入れましょうこれで導入は完了です

## 実行

exe を実行するだけでも起動できます exe を直接実行すると node を起動した時みたいに直接書き込んで実行できます

## ファイルを指定して実行

まず ritutoscript.exe が入ってるフォルダーでターミナル(コマンドプロテクト)を開きます
そして

```bash
 ritutoscript.exe run ファイルのパス
```

で実行できます

# code の説明

```rs
log(stringornumber);
//いつもおなじみのログ
```

# 変数

```js
//こっちはローカル
set test = "hello"
log({test})
//こっちがグローバル
global set test = "world"
log([test])
```

ローカル変数はその関数ないなどでしか使えなくて
グローバルはプログラム全体で使えます
