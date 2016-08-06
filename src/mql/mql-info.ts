const mql4FunctionsArray = <Array<Array<string>>>require("./mql4-functions.json");
const mql4ConstantsArray = <Array<Array<string>>>require("./mql4-constants.json");

var mql4FunctionNames: string = "";
for (let i = 0; i < mql4FunctionsArray.length; i++) {
    const functionInfo = mql4FunctionsArray[i];
    mql4FunctionNames += " " + functionInfo[0];
}

var mql4ConstantNames: string = "";
for (let i = 0; i < mql4ConstantNames.length; i++) {
    const constantInfo = mql4ConstantsArray[i];
    mql4ConstantNames += " " + constantInfo[0];
}

function getMql4FunctionNames(): string {
    return mql4FunctionNames;
}

function getMql4ConstantNames(): string {
    return mql4ConstantNames;
}

export default {
    getMql4FunctionNames: getMql4FunctionNames,
    getMql4ConstantsNames: getMql4ConstantNames
}