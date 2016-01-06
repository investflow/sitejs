import $ from "jquery";

function setTitle(selector:string, title:string, root:?string):void {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        if (!$(this).attr("title")) {
            $(this).attr("title", title);
        }
    });
}

function urlify(text:string, options:?Object):string {
    if (!text) {
        return "";
    }
    let urlRegex = /(https?:\/\/[^\s\]]+)/g; // ']' character is used in HtmlUtils.getPlainTextFromHtml
    if (options && options.shortLinks) {
        return text.replace(urlRegex, "<a href='\$1' target='_blank'><i class='fa fa-external-link ml5 mr5'></i></a>")
    }
    return text.replace(urlRegex, "<a href='\$1' target='_blank'>$1</a>")
}

function focusOnEnter(event, id):void {
    if (event.which == 13) {
        $(id).focus();
        event.preventDefault();
    }
}
function clickOnEnter(event, id):void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode == 13) && !event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function clickOnCtrlEnter(event, id):void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode == 13) && event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function renderSwitches():void {
    $(".make-switch")["bootstrapSwitch"]();
}

function applyDateTimePicker(e):void {
    let now = new Date();
    //noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols
    e.datetimepicker({
        format: "dd.MM.yyyy hh:mm",
        language: "ru",
        weekStart: 1,
        pickSeconds: false,
        onRender: function (date) {
            return date.valueOf() > now.valueOf() ? "disabled" : "";
        }
    });
}

function sortClick(event):void {
    event = event || window.event;
    let elem = event.target || event.srcElement;
    if (elem.nodeName === "TH") {
        elem.getElementsByTagName("A")[0].click();
        return false;
    }
    return true;
}


function showMenuByClick(e, id):void {
    let evt = e ? e : window.event;
    if (evt && evt.stopPropagation) {
        evt.stopPropagation();
    }
    if (evt && evt.cancelBubble) {
        evt.cancelBubble = true;
    }
    $("#" + id).dropdown("toggle");
    return false;
}


function getURLParameter(name:string):string {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [undefined, ""])[1].replace(/\+/g, "%20")) || null
}

function limitTextArea($textArea, $feedback, $button, maxTextLen, minRemainingToShow):void {
    let f = function () {
        let remaining = maxTextLen - $textArea.val().length;
        if (remaining <= minRemainingToShow) {
            $feedback.html("" + remaining);
        } else {
            $feedback.html("");
        }
        if (remaining < 0) {
            $feedback.css("color", "red");
            if ($button) {
                $button.attr("disabled", "");
            }
        } else {
            $feedback.css("color", "inherit");
            if ($button) {
                $button.removeAttr("disabled");
            }
        }
    };
    $textArea.keyup(f);
    f();
}


function enableScrollTop():void {
    $(document).ready(() => {
        let $backTop = $("#back-top");
        if (!$backTop) {
            return;
        }
        $backTop.hide(); // hide #back-top first
        $(() => { // fade in #back-top
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $("#back-top").fadeIn();
                } else {
                    $("#back-top").fadeOut();
                }
            });
            $("#back-top").find("a").click(() => { // scroll body to 0px on click
                $("body,html").animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        });
    });
}

function moveCaretToEnd(el):void {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function countdown(refreshSeconds, formatter, timeBlockId, timeLeftBlockId, completionCallback):void {
    let timeBlock = document.getElementById(timeBlockId);
    if (!timeBlock) {
        return;
    }
    let timeString = timeBlock.getAttribute("utc-date");
    if (!timeString) {
        return;
    }
    let targetTime = Date.parse(timeString);
    if (!targetTime) {
        return;
    }
    let timeLeftBlock = document.getElementById(timeLeftBlockId);
    let millisLeft = targetTime - new Date().getTime();
    if (millisLeft <= 0) {
        timeLeftBlock.innerHTML = formatter(0, 0);
        if (completionCallback) {
            //TODO: add min callback period before enabling. completionCallback();
        }
        return;
    }
    let millisPerMinute = 60 * 1000;
    let millisPerHour = 60 * millisPerMinute;
    let hoursLeft = parseInt(millisLeft / millisPerHour, 10);
    let minutesLeft = parseInt(Math.round((millisLeft - hoursLeft * millisPerHour) / millisPerMinute), 10);
    timeLeftBlock.innerHTML = formatter(hoursLeft, minutesLeft);

    setTimeout(() => {
        countdown(refreshSeconds, formatter, timeBlockId, timeLeftBlockId, completionCallback);
    }, refreshSeconds * 1000);
}


export default {
    setTitle: setTitle,
    urlify: urlify,
    focusOnEnter: focusOnEnter,
    clickOnEnter: clickOnEnter,
    clickOnCtrlEnter: clickOnCtrlEnter,
    renderSwitches: renderSwitches,
    applyDateTimePicker: applyDateTimePicker,
    sortClick: sortClick,
    showMenuByClick: showMenuByClick,
    getURLParameter: getURLParameter,
    limitTextArea: limitTextArea,
    enableScrollTop: enableScrollTop,
    moveCaretToEnd: moveCaretToEnd,
    countdown: countdown
};
