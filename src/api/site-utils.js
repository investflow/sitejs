import $ from "jquery";

function addTitle(el, title) {
    if (!$(el).attr("title")) {
        $(el).attr("title", title);
    }
}

function setTitle(selector, title, root) {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        addTitle(this, title);
    });
}

function urlify(text, options) {
    if (!text) {
        return;
    }
    var urlRegex = /(https?:\/\/[^\s\]]+)/g; // ']' character is used in HtmlUtils.getPlainTextFromHtml
    if (options && options.shortLinks) {
        return text.replace(urlRegex, "<a href='\$1' target='_blank'><i class='fa fa-external-link ml5 mr5'></i></a>")
    }
    return text.replace(urlRegex, "<a href='\$1' target='_blank'>$1</a>")
}

function focusOnEnter(event, id) {
    if (event.which == 13) {
        $(id).focus();
        event.preventDefault();
    }
}
function clickOnEnter(event, id) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode == 13) && !event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function clickOnCtrlEnter(event, id) {
    var keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode == 13) && event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function renderSwitches() {
    $(".make-switch")["bootstrapSwitch"]();
}

function applyDateTimePicker(e) {
    var now = new Date();
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

function sortClick(event) {
    event = event || window.event;
    var elem = event.target || event.srcElement;
    if (elem.nodeName === "TH") {
        elem.getElementsByTagName("A")[0].click();
        return false;
    }
    return true;
}


function showMenuByClick(e, id) {
    var evt = e ? e : window.event;
    if (evt && evt.stopPropagation) {
        evt.stopPropagation();
    }
    if (evt && evt.cancelBubble) {
        evt.cancelBubble = true;
    }
    $("#" + id).dropdown("toggle");
    return false;
}


function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [, ""])[1].replace(/\+/g, "%20")) || null
}

function limitTextArea($textArea, $feedback, $button, maxTextLen, minRemainingToShow) {
    var f = function () {
        var remaining = maxTextLen - $textArea.val().length;
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


function enableScrollTop() {
    $(document).ready(function () {
        var $backTop = $("#back-top");
        if (!$backTop) {
            return;
        }
        $backTop.hide(); // hide #back-top first
        $(function () { // fade in #back-top
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $("#back-top").fadeIn();
                } else {
                    $("#back-top").fadeOut();
                }
            });
            $("#back-top").find("a").click(function () { // scroll body to 0px on click
                $("body,html").animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        });
    });
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function countdown(refreshSeconds, formatter, timeBlockId, timeLeftBlockId, completionCallback) {
    var timeBlock = document.getElementById(timeBlockId);
    if (!timeBlock) {
        return;
    }
    var timeString = timeBlock.getAttribute("utc-date");
    if (!timeString) {
        return;
    }
    var targetTime = Date.parse(timeString);
    if (!targetTime) {
        return;
    }
    var timeLeftBlock = document.getElementById(timeLeftBlockId);
    var millisLeft = targetTime - new Date().getTime();
    if (millisLeft <= 0) {
        timeLeftBlock.innerHTML = formatter(0, 0);
        if (completionCallback) {
            //TODO: add min callback period before enabling. completionCallback();
        }
        return;
    }
    var millisPerMinute = 60 * 1000;
    var millisPerHour = 60 * millisPerMinute;
    var hoursLeft = parseInt(millisLeft / millisPerHour, 10);
    var minutesLeft = parseInt(Math.round((millisLeft - hoursLeft * millisPerHour) / millisPerMinute), 10);
    timeLeftBlock.innerHTML = formatter(hoursLeft, minutesLeft);

    setTimeout(function () {
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
