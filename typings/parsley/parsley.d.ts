// Only methods used by us

interface ParsleyStatic {
    addMessages(lang: string, options: any): void;
    addValidator(lang: string, options: any): void;
    setLocale(lang: string): void;
}

interface Window {
    Parsley: ParsleyStatic;
    Toggle: any;
}

interface Parsley {
    removeError(error: string): void;
}

interface JQuery {
    parsley(): Parsley;
}

declare module "parsleyjs" {
    export = Parsley;
}

//noinspection JSUnusedGlobalSymbols
declare var Parsley: Parsley;
