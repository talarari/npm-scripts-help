#!/usr/bin/env node

var chalk = require('chalk');

var packageJson =require(process.cwd() + '/package.json');
var scripts = packageJson.scripts || {};
var scriptsHelpConfig = getScriptsHelpConfig();
var search = specificScript = process.argv[2];

if (scriptsHelpConfig['help-message']){
    console.log(chalk.bold.cyan('----------------------------------------------'));
    console.log(getDesc(scriptsHelpConfig['help-message']));
    console.log(chalk.bold.cyan('----------------------------------------------'));
}
Object.keys(scripts)
    .filter(function(scriptName){
        if (!search) return true;
        return new RegExp(search).test(scriptName)
    })
    .map(getScriptHelp)
    .map(printScriptHelp)


function getScriptHelp (scriptName){
    var script = scripts[scriptName] || '';
    var currentScriptHelp = scriptsHelpConfig[scriptName];
    if (typeof currentScriptHelp === 'string' || Array.isArray(currentScriptHelp)) {
        currentScriptHelp = {
            "Description":getDesc(currentScriptHelp)
        }
    }
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
        return line;
    }

    if (Array.isArray(line) && line.length > 0 && typeof line[0] === 'string'){
        return formatMultiLine(line);
    }
    return '';
}


function formatMultiLine(multiline){
    return '\n' +multiline.join('\n');
}

function getScriptsHelpConfig(){
    try{
        return require(process.cwd() + '/.scriptshelprc.js');
    }
    catch (err) {
        return packageJson['scriptshelp'] || {};
    }

}
