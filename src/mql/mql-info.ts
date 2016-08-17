const mql4KeywordsArray = <Array<Array<string>>>require("./mql4-keywords.json");
const mql4FunctionsArray = <Array<Array<string>>>require("./mql4-functions.json");
const mql4ConstantsArray = <Array<Array<string>>>require("./mql4-constants.json");
const mql4PreprocessorArray = <Array<Array<string>>>require("./mql4-preprocessor.json");

var mql4FunctionNames: string = "";
function getMql4FunctionNames(): string {
    if (mql4FunctionNames.length == 0) {
        for (let i = 0; i < mql4FunctionsArray.length; i++) {
            const functionInfo = mql4FunctionsArray[i];
            mql4FunctionNames += (i > 0 ? " " : "") + functionInfo[0];
        }
    }
    return mql4FunctionNames;
}

var mql4ConstantNames: string = "";
function getMql4ConstantNames(): string {
    if (mql4ConstantNames.length == 0) {
        for (let i = 0; i < mql4ConstantsArray.length; i++) {
            const constantInfo = mql4ConstantsArray[i];
            mql4ConstantNames += (i > 0 ? " " : "") + constantInfo[0];
        }
    }
    return mql4ConstantNames;
}

var mql4KeywordsNames: string = "";
function getMql4KeywordsNames(): string {
    if (mql4KeywordsNames.length == 0) {
        for (let i = 0; i < mql4KeywordsArray.length; i++) {
            const keywordInfo = mql4KeywordsArray[i];
            mql4KeywordsNames += (i > 0 ? " " : "") + keywordInfo[0];
        }
    }
    return mql4KeywordsNames;
}

var mql4PreprocessorNames: string = "";
function getMql4PreprocessorNames(): string {
    if (mql4PreprocessorNames.length == 0) {
        for (let i = 0; i < mql4PreprocessorArray.length; i++) {
            const keywordInfo = mql4PreprocessorArray[i];
            mql4PreprocessorNames += (i > 0 ? " " : "") + keywordInfo[0];
        }
    }
    return mql4PreprocessorNames;
}

export interface MqlEntry {
    name: string,
    description: string,
    link: string
}

function getMql4FunctionInfo(name: string) {
    return getMql4Info(name, mql4FunctionsArray);
}

function getMql4ConstantInfo(name: string): MqlEntry {
    return getMql4Info(name, mql4ConstantsArray);
}

function getMql4KeywordInfo(name: string): MqlEntry {
    return getMql4Info(name, mql4KeywordsArray);
}

function getMql4PreprocessorInfo(name: string): MqlEntry {
    return getMql4Info(name, mql4PreprocessorArray);
}

function getMql4Info(name: string, arr: Array<Array<string>>): MqlEntry {
    for (let i = 0; i < arr.length; i++) {
        let f = arr[i];
        if (name === f[0]) {
            return {
                name: name,
                description: f[1],
                link: f[2]
            }
        }
    }
    return {
        name: name,
        description: name,
        link: ""
    }
}

export default {
    getMql4KeywordsNames: getMql4KeywordsNames,
    getMql4FunctionNames: getMql4FunctionNames,
    getMql4ConstantsNames: getMql4ConstantNames,
    getMql4PreprocessorNames: getMql4PreprocessorNames,

    getMql4KeywordInfo: getMql4KeywordInfo,
    getMql4FunctionInfo: getMql4FunctionInfo,
    getMql4ConstantInfo: getMql4ConstantInfo,
    getMql4PreprocessorInfo: getMql4PreprocessorInfo,
}