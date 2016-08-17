import * as hljs from "highlight.js";
import mqlInfo from "./mql-info";

function highlight(text: string) {
    return hljs.highlight("mql4", text, true);
}

interface FileInputOptions {
    input: HTMLInputElement,
    targetSelector: string
    feedbackSelector: string
}

function annotateFile(options: FileInputOptions) {
    var maxSize = 100 * 1024;
    if (options.input.files && options.input.files[0]) {
        var reader = new FileReader();
        var file = options.input.files[0];
        if (file.size == 0) {
            $(options.feedbackSelector).html("Не удалось загрузить файл.");
            return;
        }
        if (file.size > maxSize) {
            $(options.feedbackSelector).html("Размер файла более 100кб!");
            return;
        }
        if (["text/html"].indexOf(file.type) == -1 && file.name.lastIndexOf(".mq4") != file.name.length - 4) {
            $(options.feedbackSelector).html("Не текстовый файл!");
            return;
        }
        reader.readAsText(file);
        reader.onload = function (e) {
            const text = e.target["result"];
            annotateText({text: text, targetSelector: options.targetSelector});
        }
    }
}

interface TextInputOption {
    text: string
    targetSelector: string
}

function annotateText(options: TextInputOption) {
    const highlightedData = highlight(options.text);
    const $target = $(options.targetSelector);
    const highlightedText = highlightedData.value;
    let lineNumbersBlock = "<span class='hljs-line-number'>";
    var num = highlightedText.split(/\n/).length;
    for (var j = 0; j < num; j++) {
        lineNumbersBlock += '<span>' + (j + 1) + '</span>';
    }
    lineNumbersBlock += "</span>";
    $target.html("<div class='hljs-root'>" + lineNumbersBlock + "<div class='hljs-code'>" + highlightedText + "</div>" + "<span class='hljs-line-number-cl'></span></div>");

    $target.popover({
        html: true,
        selector: ".hljs-keyword,.hljs-built_in,.hljs-literal,.hljs-meta-keyword",
        placement: "auto right",
        trigger: "hover",
        template: '<div class="popover" style="max-width: 500px" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        title: function () {
            const $el = $(this);
            const text = $el.text();
            const title = $el.hasClass("hljs-keyword") ? "Ключевое слово: " + text :
                $el.hasClass("hljs-built_in") ? "Функция: " + text :
                    $el.hasClass("hljs-literal") ? "Константа: " + text :
                        $el.hasClass("hljs-meta-keyword") ? "Препроцессор: " + text :
                            text;

            return "<span class='text-info'><strong>" + title + "</strong></span>";
        },
        content: function () {
            const $el = $(this);
            const text = $el.text();
            const info = $el.hasClass("hljs-keyword") ? mqlInfo.getMql4KeywordInfo(text) :
                $el.hasClass("hljs-built_in") ? mqlInfo.getMql4FunctionInfo(text) :
                    $el.hasClass("hljs-literal") ? mqlInfo.getMql4ConstantInfo(text) :
                        $el.hasClass("hljs-meta-keyword") ? mqlInfo.getMql4PreprocessorInfo(text) :
                        {description: text};
            return "<div class='mql-popover-content'>" + info.description + "</div>"
        }
    });
}

export default {
    highlight: highlight,
    annotateFile: annotateFile,
    annotateText: annotateText,
}