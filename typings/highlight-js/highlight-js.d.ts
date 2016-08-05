// Type definitions for loglevel 1.4.0
// Project: https://github.com/pimterry/loglevel
// Definitions by: Stefan Profanter <https://github.com/Pro/>, Florian Wagner <https://github.com/flqw/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface HighlightJS {
    BACKSLASH_ESCAPE;
    C_LINE_COMMENT_MODE;
    C_BLOCK_COMMENT_MODE;
    IDENT_RE;
    TITLE_MODE;

    inherit(p1: any, p2: any): any;

    registerLanguage(string, any): any;

    highlightAuto(string): any;
}

declare var _hljs: HighlightJS;

declare module "highlight.js" {
    export = _hljs;
}
