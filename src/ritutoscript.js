const math = require('mathjs');
const globalvalues = {};

module.exports = class ritutoscript {
    values = {};

    constructor() {}

    /** @param {string[]} expression  */
    conpile(expression) {
        expression.forEach((line,i) => {
            if (line.startsWith("log(")) {
                const match = line.match(/\((.*)\)/);  // ここを修正
                if (match) {
                    const logContent = match[1];  // 括弧内の内容を取得
                    console.log(this.tostringnumber(logContent,i));  // その内容を処理
                }
            }
            if (line.startsWith("set")){//set str = strnum
                const match = line.match(/set\s+(\w+)\s*=\s*(\w+)/);
                if (match) {
                    this.values[match[1]] = this.tostringnumber(match[2], i);
                }
            }
        });
    }

    tostringnumber(str,i) {
        try {
            // mathjsのevaluateを使って式を評価
            return math.evaluate(this.replacevalue2(this.replacevalue1(str, this.values), globalvalues));
        } catch (error) {
            if (error.message.includes("Undefined symbol "))
            console.error('式を実行する際にエラーが出ました 不明な文字があります:at line:+' +i+1);
            return undefined;
        }
    }

    replacevalue1(str, obj) {
        return str.replace(/{(.*?)}/g, (match, key) => {
            if (obj[key] !== undefined) {
                return obj[key];
            }
            return undefined;
        });
    }

    replacevalue2(str, obj) {
        return str.replace(/\[(.*?)\]/g, (match, key) => {  // 正規表現を修正
            if (obj[key] !== undefined) {
                return obj[key];
            }
            return undefined;
        });
    }
    
}
