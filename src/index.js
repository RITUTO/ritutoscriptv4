const ritutoscript = require("./ritutoscript")
const args = process.argv.slice(2);
if (args[0] == "help"){
    console.log("help ヘルプを表示します")
    console.log("run \"path\"")
    return
}
if (args[0] == "run"){
    new ritutoscript({}).conpile(require("fs").readFileSync(args[1], "utf-8").split("\n"))
    return
}
const readline = require('readline');

// readline インターフェースを作成
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function runrs() {
  const rs = new ritutoscript({})
  rl.question('> ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('終了します。');
      rl.close();
      return;
    }

    // 入力された式を計算
    try {
        rs.conpile([input.toLowerCase()])
    } catch (err) {
      console.log('無効なコードです。',err);
    }
    runrs();
  });
}
console.log("ritutoscriptのコードを入れてください:")
runrs();
