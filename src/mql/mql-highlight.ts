import * as hljs from "highlight.js";

function highlight(text: string) {
    return hljs.highlightAuto(text);
}

interface AnnotateOptions {
    input: HTMLInputElement,
    targetSelector: string
    feedbackSelector: string
}

function annotate(options: AnnotateOptions) {
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
        console.log('type: ' + file.type);
        if (["text/html", "application/x-wine-extension-mq4"].indexOf(file.type) == -1) {
            if (file.name.lastIndexOf(".mq4") != file.name.length - 4) {
                $(options.feedbackSelector).html("Не текстовый файл!");
                return;
            }
        }
        reader.readAsText(file);
        reader.onload = function (e) {
            const text = e.target["result"];
            const highlightedText = highlight(text);
            console.log("Загрузили: " + e.target + ", text: " + text + ", highlighted: " + highlightedText.value);
            $(options.targetSelector).html(highlightedText.value)
        };
    }
}

export default {
    highlight: highlight,
    annotate: annotate,
}