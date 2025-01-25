const ritutoscript = require("./ritutoscript")
const https = require('https');
const http = require('http');
const args = process.argv.slice(2);
if (args[0] == "help"){
    console.log("help ヘルプを表示します")
    console.log("run \"path\" or run \"url\"")
    return
}
if (args[0] == "run") {
  let inputData;

  const urlPattern = /^(http|https):\/\/[^\s]+$/;
  if (urlPattern.test(args[1])) {
      const protocol = args[1].startsWith('https') ? https : http;

      protocol.get(args[1], (res) => {
          let data = '';

          res.on('data', chunk => {
              data += chunk;
          });

          res.on('end', () => {
              new ritutoscript({}).conpile(data.split("\n"));
          });
      }).on('error', (err) => {
          console.error('Error fetching URL:', err);
      });

  } else {
      inputData = fs.readFileSync(args[1], "utf-8");
      new ritutoscript({}).conpile(inputData.split("\n"));
  }

  return;
}
const readline = require('readline');

// readline インターフェースを作成

function runrs() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const rs = new ritutoscript({})
  rl.question('> ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('終了します。');
      rl.close();
      return;
    }

    // 入力された式を計算
    try {
      rl.close();
        await rs.conpile(input.toLowerCase().split("\\n"))
    } catch (err) {
      console.log('無効なコードです。',err);
    }
    runrs();
  });
}
console.log("ritutoscriptのコードを入れてください:")
runrs();
