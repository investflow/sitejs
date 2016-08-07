import mql from "./mql/mql-def";
import Highlight from "./mql/mql-highlight";
import Info from "./mql/mql-info";
import "./mql/mql4-grammar";


/** Set of utility functions */
mql.Highlight = Highlight;
mql.Info = Info;

(<any>window).$mql = mql;