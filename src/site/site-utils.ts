import * as $ from "jquery";
import * as Autolinker from "autolinker";
import links from "./links";

function setTitle(selector: string, title: string, root?: HTMLElement): void {
    root = root ? root : window.document.body;
    $(root).find(selector).each(function () {
        if (!$(this).attr("title")) {
            $(this).attr("title", title);
        }
    });
}

interface LinkifyOptions {
    skipMediaLinks: boolean;
}

function linkify(text: string, options: LinkifyOptions): string {
    const autolinker = new Autolinker({
        urls: {
            schemeMatches: true,
            wwwMatches: true,
            tldMatches: true
        },
        email: true,
        phone: true,
        mention: false,
        hashtag: false,

        stripPrefix: true,
        newWindow: true,

        truncate: {
            length: 60,
            location: "end"
        },

        className: ""
    });

    const res = autolinker.link(text);
    if (options && options.skipMediaLinks) {
        return res;
    }
    try {
        return links.processMediaLinks(res);
    } catch (err) {
        log.error(err);
        return res;
    }
}

function focusOnEnter(event: KeyboardEvent, id: string): void {
    if (event.which === 13) {
        $(id).focus();
        event.preventDefault();
    }
}
function clickOnEnter(event: KeyboardEvent, id: number): void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode === 13) && !event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function clickOnCtrlEnter(event: KeyboardEvent, id: number): void {
    let keyCode = (event.which ? event.which : event.keyCode);
    if ((keyCode === 10 || keyCode === 13) && event.ctrlKey) {
        $(id).click();
        event.preventDefault();
    }
}

function renderSwitches(): void {
    $(".make-switch").bootstrapSwitch();
}

function renderToggle(selector: string): void {
    $(selector).bootstrapToggle();
}

function applyDateTimePicker(e: JQuery): void {
    let now = new Date();
    //noinspection JSUnusedGlobalSymbols
    e.datetimepicker({
        format: "dd.MM.yyyy hh:mm",
        language: "ru",
        weekStart: 1,
        pickSeconds: false,
        onRender: function (date: Date) {
            return date.valueOf() > now.valueOf() ? "disabled" : "";
        }
    });
}

function applyDatePicker(e: JQuery): void {
    let now = new Date();
    //noinspection JSUnusedGlobalSymbols
    e.datetimepicker({
        format: "dd.MM.yyyy",
        language: "ru",
        weekStart: 1,
        pickTime: false,
        onRender: function (date: Date) {
            return date.valueOf() > now.valueOf() ? "disabled" : "";
        }
    });
}

function sortClick(event: Event): boolean {
    event = event || window.event;
    let elem: HTMLElement = <HTMLElement>(event.target || event.srcElement);
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


function showMenuByClick(e: Event, id: string): boolean {
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


function getURLParameter(name: string): string {
    let regExp = new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)");
    return decodeURIComponent((regExp.exec(location.search) || [undefined, ""])[1].replace(/\+/g, "%20")) || undefined;
}

function limitTextArea($textArea: JQuery, $feedback: JQuery, $button: JQuery, maxTextLen: number, minRemainingToShow: number): void {
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

interface ScrollToOptions {
    delay?: number;
    offset?: number;
}

function scrollTo(selector: string, o?: ScrollToOptions) {
    const offset = o && o.offset ? o.offset : 0;
    const delay = o && o.delay ? o.delay : 0;
    $("html, body").animate({scrollTop: $(selector).offset().top + offset}, delay);
}

function enableScrollTop(): void {
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

function moveCaretToEnd(el: HTMLTextAreaElement): void {
    if (typeof el.selectionStart === "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange !== "undefined") {
        el.focus();
        const range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function countdown(refreshSeconds: number, formatter: Function, timeBlockId: string, timeLeftBlockId: string, completionCallback: Function): void {
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
    if (value < 0) {
        return "-" + toValueWithSuffix(-value);
    }
    const k = 1000;
    const sizes = ['', 'k', 'm', 'b'];
    const i = Math.floor(Math.log(value) / Math.log(k));
    return parseFloat((value / Math.pow(k, i)).toFixed(0)) + sizes[i];
}

function createAvatar(name, size) {

    name = name || '';
    size = size || 60;

    let colors = [
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
            "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
        ],

        nameSplit = String(name).split(' '),
        initials, charIndex, colourIndex, canvas, context, dataURI;

    if (nameSplit.length == 1) {
        const firstName = nameSplit[0];
        if (firstName) {
            const firstChar = firstName.charAt(0).toUpperCase();
            const secondChar = firstName.length > 1 ? firstName.charAt(1) : "";
            initials = firstChar + secondChar;
        } else {
            initials = '?';
        }
    } else {
        initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }

    if (window.devicePixelRatio) {
        size = (size * window.devicePixelRatio);
    }

    charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex = charIndex % 20;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");

    context.fillStyle = colors[colourIndex - 1];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";
    context.fillStyle = "#FFF";
    context.fillText(initials, size / 2, size / 1.5);

    dataURI = canvas.toDataURL();
    canvas = null;

    return dataURI;
}

function applyAvatars() {
    Array.prototype.forEach.call(document.querySelectorAll('img[avatar]'), function (img, name) {
        name = img.getAttribute("avatar");
        img.src = createAvatar(name, img.getAttribute("width"));
        img.removeAttribute("avatar");
        img.setAttribute("alt", name);
    });
}

function applyAvatar(selector: string) {
    const $img = $(selector);
    $img.each(function () {
        const name = this.getAttribute("avatar");
        if (name) {
            this.src = createAvatar(name, this.getAttribute("width"));
            this.removeAttribute("avatar");
            this.setAttribute("alt", name);
        }
    });
}

function removeServerSideParsleyError(el: HTMLElement) {
    const p: Parsley = $(el).parsley();
    p.removeError("server-side-parsley-error");
}

function formatLargeNumber(n: number, decimals: number) {
    let truncated = Number(n.toFixed(decimals)).toString();  // Number is used to truncate trailing zeros after .toFixed
    return truncated.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default {
    setTitle: setTitle,
    linkify: linkify,
    focusOnEnter: focusOnEnter,
    clickOnEnter: clickOnEnter,
    clickOnCtrlEnter: clickOnCtrlEnter,
    renderSwitches: renderSwitches,
    renderToggle: renderToggle,
    applyDateTimePicker: applyDateTimePicker,
    applyDatePicker: applyDatePicker,
    sortClick: sortClick,
    showMenuByClick: showMenuByClick,
    getURLParameter: getURLParameter,
    limitTextArea: limitTextArea,
    enableScrollTop: enableScrollTop,
    scrollTo: scrollTo,
    moveCaretToEnd: moveCaretToEnd,
    countdown: countdown,
    toValueWithSuffix: toValueWithSuffix,
    applyAvatars: applyAvatars,
    applyAvatar: applyAvatar,
    playYoutube: links.playYoutube,
    removeServerSideParsleyError: removeServerSideParsleyError,
    formatLargeNumber: formatLargeNumber
}
