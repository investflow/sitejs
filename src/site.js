// ES6 modules
import DOMUtils from "./api/dom-utils";
import Titles  from "./api/titles";
import Parsley from "parsleyjs";

// ES5 modules
var AddAccountFormApp = require("./app/AddAccountFormApp");
require("./api/parsley-translations");

window.$site = {
    DOMUtils: DOMUtils,
    Titles: Titles,
    Parsley: Parsley,
    AddAccountFormApp: AddAccountFormApp
};

