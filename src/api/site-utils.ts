import * as $ from "jquery";
import * as Autolinker from "autolinker";

function setTitle(selector:string, title:string, root?:HTMLElement):void {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        if (!$(this).attr("title")) {
            $(this).attr("title", title);
        }
    });
}
function linkify(text:string):string {
    return Autolinker.link(text);
}

function focusOnEnter(event:KeyboardEvent, id:string):void {
    if (event.which === 13) {
        $(id).focus();
        event.preventDefault();
    }
}
function clickOnEnter(event:KeyboardEvent, id:number):void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode === 13) && !event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function clickOnCtrlEnter(event:KeyboardEvent, id:number):void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode === 13) && event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function renderSwitches():void {
    $(".make-switch").bootstrapSwitch();
}

function applyDateTimePicker(e:JQuery):void {
    let now = new Date();
    //noinspection JSUnusedGlobalSymbols
    e.datetimepicker({
        format: "dd.MM.yyyy hh:mm",
        language: "ru",
        weekStart: 1,
        pickSeconds: false,
        onRender: function (date:Date) {
            return date.valueOf() > now.valueOf() ? "disabled" : "";
        }
    });
}

function sortClick(event:Event):boolean {
    event = event || window.event;
    let elem:HTMLElement = <HTMLElement>(event.target || event.srcElement);
    if (elem.nodeName && elem.nodeName === "TH") {
        let children = elem.getElementsByTagName("A");
        if (children.length > 0) {
            let a = <HTMLElement>children[0];
            a.click();
            return false;
        }
    }
    return true;
}


function showMenuByClick(e:Event, id:string):boolean {
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
    let regExp = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)");
    return decodeURIComponent((regExp.exec(location.search) || [undefined, ""])[1].replace(/\+/g, "%20")) || undefined;
}

function limitTextArea($textArea:JQuery, $feedback:JQuery, $button:JQuery, maxTextLen:number, minRemainingToShow:number):void {
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

function moveCaretToEnd(el:HTMLTextAreaElement):void {
    if (typeof el.selectionStart === "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange !== "undefined") {
        el.focus();
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function countdown(refreshSeconds:number, formatter:Function, timeBlockId:string, timeLeftBlockId:string, completionCallback:Function):void {
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
    let hoursLeft = parseInt("" + (millisLeft / millisPerHour), 10);
    let minutesLeft = parseInt("" + Math.round((millisLeft - hoursLeft * millisPerHour) / millisPerMinute), 10);
    timeLeftBlock.innerHTML = formatter(hoursLeft, minutesLeft);

    setTimeout(() => {
        countdown(refreshSeconds, formatter, timeBlockId, timeLeftBlockId, completionCallback);
    }, refreshSeconds * 1000);
}

function toValueWithSuffix(value) {
    if (value == 0) return "0";
    var k = 1000;
    var sizes = ['', 'k', 'm', 'b'];
    var i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(0)) + sizes[i];
}


export default {
    setTitle: setTitle,
    linkify: linkify,
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
    countdown: countdown,
    toValueWithSuffix: toValueWithSuffix
}
