const math = require('mathjs');
const globalvalues = {};
const globalfunctions = {};

module.exports = class ritutoscript {
    values = {};
    functions = {};
    functiondummy = [];
    functionarg = "";
    functiondummyname = "";
    functionmode = 0;

    constructor(context = {}) {
        this.values = { ...context }; // 引数で初期化可能
    }

    conpile(expression) {
        expression.forEach((line, i) => {
            if (line == ""){
                return;
            }
            line = line.trim();

            if (this.functionmode === 1) {
                if (line === "}") {
                    this.functionmode = 0;
                    this.functions[this.functiondummyname] = { code: this.functiondummy, arg: this.functionarg };
                    this.functiondummy = [];
                    this.functiondummyname = "";
                    return;
                }
                this.functiondummy.push(line);
                return;
            }

            if (this.functionmode === 2) {
                if (line === "}") {
                    this.functionmode = 0;
                    globalfunctions[this.functiondummyname] = { code: this.functiondummy, arg: this.functionarg };
                    this.functiondummy = [];
                    this.functiondummyname = "";
                    return;
                }
                this.functiondummy.push(line);
                return;
            }

            if (line.startsWith("log(")) {
                const match = line.match(/\((.*)\)/);
                if (match) {
                    const logContent = match[1];
                    console.log(this.evaluateExpression(logContent, i));
                }
            } else if (line.startsWith("set")) {
                const match = line.match(/set\s+(\w+)\s*=\s*(.*)/);
                if (match) {
                    const value = this.evaluateExpression(match[2], i);
                    this.values[match[1]] = value;
                }
            } else if (line.startsWith("global set")) {
                const match = line.match(/global\s+set\s+(\w+)\s*=\s*(.*)/);
                if (match) {
                    const value = this.evaluateExpression(match[2], i);
                    globalvalues[match[1]] = value;
                }
            } else if (line.startsWith("function")) {
                const match = line.match(/function\s+(\w+)\s*\(\s*(\w*)\s*\)\s*\{/);
                if (match) {
                    this.functiondummyname = match[1];
                    this.functionarg = match[2];
                    this.functionmode = 1;
                }
            } else if (line.startsWith("global function")) {
                const match = line.match(/global\s+function\s+(\w+)\s*\(\s*(\w*)\s*\)\s*\{/);
                if (match) {
                    this.functiondummyname = match[1];
                    this.functionarg = match[2];
                    this.functionmode = 2;
                }
            } else {
                const match = line.match(/(\w+)\s*\(\s*(.*?)\s*\)/);
                if (match) {
                    const funcName = match[1];
                    const funcArg = match[2];

                    if (this.functions[funcName]) {
                        new ritutoscript({ [this.functions[funcName].arg]: this.evaluateExpression(funcArg, i) }).conpile(this.functions[funcName].code);
                    } else if (globalfunctions[funcName]) {
                        new ritutoscript({ [globalfunctions[funcName].arg]: this.evaluateExpression(funcArg, i) }).conpile(globalfunctions[funcName].code);
                    } else {
                        console.error(`エラー: 関数 ${funcName} が定義されていません at line: ${i + 1}`);
                    }
                } else {
                    console.error(`エラー: 不明な文字があります at line: ${i + 1}`);
                }
            }
        });
    }

    evaluateExpression(str, i) {
        const replacedStr = this.replacevalue2(this.replacevalue1(str, this.values), globalvalues);
        try {
            return math.evaluate(replacedStr);
        } catch (error) {
            return replacedStr;
        }
    }

    replacevalue1(str, obj) {
        return str.replace(/{(.*?)}/g, (match, key) => obj[key] ?? undefined);
    }

    replacevalue2(str, obj) {
        return str.replace(/\[(.*?)\]/g, (match, key) => obj[key] ?? undefined);
    }
};
