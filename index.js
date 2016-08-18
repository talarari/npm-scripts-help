var chalk = require('chalk');
var packageJson =require(process.cwd() + '/package.json');
var scripts = packageJson.scripts || {};

var scriptsHelp;
try{
    scriptsHelp = require(process.cwd() + '/.scriptshelprc.js');
}
catch (err) {
    scriptsHelp = packageJson['scriptshelp'] || {};
}


if (scriptsHelp['help-message']){
    console.log(chalk.bold.cyan('----------------------------------------------'));
    console.log(getDesc(scriptsHelp['help-message']));
    console.log(chalk.bold.cyan('----------------------------------------------'));
}
Object.keys(scripts)
    .map(getScriptHelp)
    .map(printScriptHelp)


function getScriptHelp (scriptName){
    var script = scripts[scriptName] || '';
    var currentScriptHelp = scriptsHelp[scriptName];
    return Object.assign({},{
        name: scriptName,
        script:script
    },currentScriptHelp);
}

function printScriptHelp(help){
    console.log(' ');
    console.log(chalk.cyan(help.name + ':'));
    Object.keys(help).filter(function(key){return key !== 'name';})
        .forEach(function(helpKey){
            var desc = getDesc(help[helpKey]);
            console.log(chalk.magenta(helpKey + ': ') + desc);
    });
}

function getDesc(line){
    if (!line) return '';

    if (typeof line === 'string') {
        if (fitsInConsoleWidth(line)) return line;
        return formatMultiLine(breakLine(line))
    }

    if (Array.isArray(line) && line.length > 0 && typeof line[0] === 'string'){
        return formatMultiLine(breakLinesArray(line));
    }
    return '';
}

function addPadding(str){
    return '  ' + str;
}

function fitsInConsoleWidth(line){
    return line.length < 70
}

function breakLine(line){

    var words =line.split(' ');
    var currentLine = words[0];
    var lines = [];
    line.split(' ').forEach(function(word){
        word = word.trim();
        if (fitsInConsoleWidth(currentLine + word)){
            currentLine = currentLine +' '+  word;
        }
        else{
            lines.push(currentLine);
            currentLine = word;
        }
    });
    lines.push(currentLine);
    return lines;
}

function breakLinesArray(lines){
    return lines.map(breakLine)
        .reduce(function(prev,curr){
            return prev.concat(curr)
        },[])
}


function formatMultiLine(multiline){
    return '\n' +multiline
            .map(function(s){
                return addPadding(s,2)
            })
            .join('\n');
}
