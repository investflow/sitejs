import * as hljs from "highlight.js";
import mqlInfo from "./mql-info";

hljs.registerLanguage("mql4", mql4_grammar);

function mql4_grammar() {
    var PRIMITIVE_TYPES = {
        className: 'keyword',
        begin: '\\b[a-z\\d_]*_t\\b'
    };

    var STRINGS = {
        className: 'string',
        variants: [
            {
                begin: '(u8?|U)?L?"', end: '"',
                illegal: '\\n',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: '(u8?|U)?R"', end: '"',
                contains: [hljs.BACKSLASH_ESCAPE]
            },
            {
                begin: '\'\\\\?.', end: '\'',
                illegal: '.'
            }
        ]
    };

    var NUMBERS = {
        className: 'number',
        variants: [
            {begin: '\\b(0b[01\'_]+)'},
            {begin: '\\b([\\d\'_]+(\\.[\\d\'_]*)?|\\.[\\d\'_]+)(u|U|l|L|ul|UL|f|F|b|B)'},
            {begin: '(-?)(\\b0[xX][a-fA-F0-9\'_]+|(\\b[\\d\'_]+(\\.[\\d\'_]*)?|\\.[\\d\'_]+)([eE][-+]?[\\d\'_]+)?)'}
        ],
        relevance: 0
    };

    //noinspection SpellCheckingInspection
    var PREPROCESSOR = {
        className: 'meta',
        begin: /#\s*[a-z]+\b/, end: /$/,
        keywords: {
            "meta-keyword": "if else elif endif define undef warning error line pragma ifdef ifndef include property import"
        },
        contains: [
            {
                begin: /\\\n/, relevance: 0
            },
            hljs.inherit(STRINGS, {className: 'meta-string'}),
            {
                className: 'meta-string',
                begin: '<', end: '>',
                illegal: '\\n',
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    };

    var FUNCTION_TITLE = hljs.IDENT_RE + '\\s*\\(';

    var KEYWORDS = {
        keyword: mqlInfo.getMql4KeywordsNames(),
        built_in: mqlInfo.getMql4FunctionNames(),
        literal: mqlInfo.getMql4ConstantsNames()
    };

    var EXPRESSION_CONTAINS = [
        PRIMITIVE_TYPES,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        NUMBERS,
        STRINGS
    ];

    return {
        aliases: ['mq4', 'mqh'],
        keywords: KEYWORDS,
        illegal: '</',
        contains: EXPRESSION_CONTAINS.concat([
            PREPROCESSOR,
            {
                begin: '\\b(list|queue|stack|vector|map|set|array)\\s*<', end: '>',
                keywords: KEYWORDS,
                contains: ['self', PRIMITIVE_TYPES]
            },
            {
                begin: hljs.IDENT_RE + '::',
                keywords: KEYWORDS
            },
            {
                // This mode covers expression context where we can't expect a function
                // definition and shouldn't highlight anything that looks like one:
                // `return some()`, `else if()`, `(x*sum(1, 2))`
                variants: [
                    {begin: /=/, end: /;/},
                    {begin: /\(/, end: /\)/},
                    {beginKeywords: 'new throw return else', end: /;/}
                ],
                keywords: KEYWORDS,
                contains: EXPRESSION_CONTAINS.concat([
                    {
                        begin: /\(/, end: /\)/,
                        keywords: KEYWORDS,
                        contains: EXPRESSION_CONTAINS.concat(['self']),
                        relevance: 0
                    }
                ]),
                relevance: 0
            },
            {
                className: 'function',
                begin: '(' + hljs.IDENT_RE + '[\\*&\\s]+)+' + FUNCTION_TITLE,
                returnBegin: true, end: /[{;=]/,
                excludeEnd: true,
                keywords: KEYWORDS,
                illegal: /[^\w\s*&]/,
                contains: [
                    {
                        begin: FUNCTION_TITLE, returnBegin: true,
                        contains: [hljs.TITLE_MODE],
                        relevance: 0
                    },
                    {
                        className: 'params',
                        begin: /\(/, end: /\)/,
                        keywords: KEYWORDS,
                        relevance: 0,
                        contains: [
                            hljs.C_LINE_COMMENT_MODE,
                            hljs.C_BLOCK_COMMENT_MODE,
                            STRINGS,
                            NUMBERS,
                            PRIMITIVE_TYPES
                        ]
                    },
                    hljs.C_LINE_COMMENT_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    PREPROCESSOR
                ]
            }
        ]),
        exports: {
            preprocessor: PREPROCESSOR,
            strings: STRINGS,
            keywords: KEYWORDS
        }
    };
}