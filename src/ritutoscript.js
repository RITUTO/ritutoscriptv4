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
    forv={}
    constructor(context = {}) {
        this.values = { ...context }; 
    }

    async conpile(expression) {
        return new Promise(async r => {for (let i = 0; i < expression.length; i++) {
            let line = expression[i];
            line = line.trim();
            if (this.functionmode === 1) {
                if (line === "}") {
                    this.functionmode = 0;
                    this.functions[this.functiondummyname] = { code: this.functiondummy, arg: this.functionarg };
                    this.functiondummy = [];
                    this.functiondummyname = "";
                    continue;
                }
                this.functiondummy.push(line);
                continue;
            }

            if (this.functionmode === 2) {
                if (line === "}") {
                    this.functionmode = 0;
                    globalfunctions[this.functiondummyname] = { code: this.functiondummy, arg: this.functionarg };
                    this.functiondummy = [];
                    this.functiondummyname = "";
                    continue;
                }
                this.functiondummy.push(line);
                continue;
            }
            if (this.functionmode == 3){
                if (line === "}") {
                    for (let i=this.forv.start; i<this.forv.end+1;i++){
                        const obj = {}
                        obj[this.forv.loopVer] = i
                        await new ritutoscript(obj).conpile(this.functiondummy)
                    }
                    
                    this.functionmode = 0;
                    this.functiondummy = [];
                    this.forv = {
                    }
                    continue;
                }
                this.functiondummy.push(line);
                continue;
            }
            if (line.startsWith("log(")) {
                const match = line.match(/\((.*)\)/);
                if (match) {
                    const logContent = match[1];
                    const expressions = logContent.split(",").map(expr => expr.trim()); // Split by commas
                    const results = expressions.map(expr => this.evaluateExpression(expr, i)); // Evaluate each expression
                    console.log(...results); // Log all results
                }
            }else
            if (line.startsWith("runjs(")) {
                const match = line.match(/\((.*)\)/);
                if (match) {
                    const logContent = match[1];
                    const expressions = logContent.split(",").map(expr => expr.trim()); // Split by commas
                    const r =await eval(expressions.join("\n"))
                    console.log(r)
                }
            }
            else if (line.startsWith("set")) {
                const match = line.match(/set\s+(\w+)\s*=\s*(.*)/);
                if (match) {
                    if (match[2].startsWith("runjs(")) {
                        const match2 = match[2].match(/\((.*)\)/);
                        if (match2) {
                            const logContent = match2[1];
                            const expressions = logContent.split(",").map(expr => expr.trim());
                            // 
                            const result = await eval( expressions.join("\n"))
                            this.values[match[1]] = result; // 値をセット
                            continue;
                        }
                    }
                    const value = this.evaluateExpression(match[2], i);
                    this.values[match[1]] = value;
                }
            }
            else if (line.startsWith("global set")) {
                const match = line.match(/global\s+set\s+(\w+)\s*=\s*(.*)/);
                if (match) {
                    const value = this.evaluateExpression(match[2], i);
                    globalvalues[match[1]] = value;
                }
            }  else if (line.startsWith("input")) {
                const match = line.match(/input\s+(\w+)\s*=\s*(.*)/);
                if (match) {
                    const v = await this.input(this.evaluateExpression(match[2], i))
                    this.values[match[1]] = '"'+v+'"'
                }
            } 
            else if (line.startsWith("function")) {
                const match = line.match(/function\s+(\w+)\s*\(\s*(\w*)\s*\)\s*\{/);
                if (match) {
                    this.functiondummyname = match[1];
                    this.functionarg = match[2];
                    this.functionmode = 1;
                }
            }
            else if (line.startsWith("global function")) {
                const match = line.match(/global\s+function\s+(\w+)\s*\(\s*(\w*)\s*\)\s*\{/);
                if (match) {
                    this.functiondummyname = match[1];
                    this.functionarg = match[2];
                    this.functionmode = 2;
                }else {
                    console.error(`global function 文の書き方がちがいますがあります at line: ${i + 1}`);
                }
            } else if (line.startsWith("for")) {
                const matchFor = line.match(/for\s+\((\w+)\s+in\s+(\d+)\s+to\s+(\d+)\)\s*\{/);
                if (matchFor) {
                    const start = parseInt(matchFor[2], 10); 
                    const end = parseInt(matchFor[3], 10);
                    this.forv.loopVer = matchFor[1]
                    this.forv.start = start
                    this.forv.end = end
                    this.functionmode = 3
                }else {
                    console.error(`for文の書き方が違いますが at line: ${i + 1}`);
                }
            
            }
            else {
                const match = line.match(/(\w+)\s*\(\s*(.*?)\s*\)/);
                if (match) {
                    const funcName = match[1];
                    const funcArg = match[2];

                    if (this.functions[funcName]) {
                       await new ritutoscript({ [this.functions[funcName].arg]: this.evaluateExpression(funcArg, i) }).conpile(this.functions[funcName].code);
                    } else if (globalfunctions[funcName]) {
                       await new ritutoscript({ [globalfunctions[funcName].arg]: this.evaluateExpression(funcArg, i) }).conpile(globalfunctions[funcName].code);
                    } else {
                        console.error(`エラー: 関数 ${funcName} が定義されていません at line: ${i + 1}`);
                    }
                }  else {
                    console.error(`エラー: 不明な文字があります at line: ${i + 1}`);
                }
            }
        };
        r();
    })
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

input(prompt) {
    const readline = require('readline');
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(prompt+":", (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}
};

