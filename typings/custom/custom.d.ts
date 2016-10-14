/// <reference path="../jquery/jquery.d.ts"/>

interface JQuery {
    bootstrapSwitch(): void;
    bootstrapToggle(): void;
    datetimepicker(options: any): void;
    devbridgeAutocomplete(options: any): void;
}

//typescript compiler can't find some standard properties
interface HTMLTextAreaElement {
    createTextRange(): any;
}

// declare module "*.html" {
//     const content: string;
//     export default content;
// }
