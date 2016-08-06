import mql from "./mql/mql-def";
import MqlHighlight from "./mql/mql-highlight";
import "./mql/mql4-grammar";


/** Set of utility functions */
mql.Highlight = MqlHighlight;

(<any>window).$mql = mql;