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

# for

```js
//for (x in start to end)
for (i in 1 to 5) {
    log({i})
}
```

```bash
1
2
3
4
5
```

# input

```js
input test = "What's your name?"
log("hello",{test})
```

```bash
What's your name?:rituto
hello rituto
```

# runjs

```js
set js = runjs(const v1 = 5,v1+5)
log({js})
```

または

```js
runjs(const v1 = 5,v1+5)
```

```bash
10
```

※runjs は引数を eval しています

# サンプル など

deno みたいな感じに ritutoscript run https://example.com/
で実行できます
[ritutoscript サンプル 一覧](https://ritutoscript.rituto.net/samples/)
