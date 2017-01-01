import {Broker} from "./broker";
var KnownImageExtensions = {};
KnownImageExtensions["png"] = true;
KnownImageExtensions["jpg"] = true;
KnownImageExtensions["gif"] = true;

// TODO: portfolios

let PAMM_URL_PREFIX = "investflow.ru/pamm/";
let SECURITY_URL_PREFIX = "investflow.ru/security/";
let ALPARI_FUND_PAMM_URL_PREFIX = "investflow.ru/invest/fund/alpari/";

function playYoutube(el: HTMLElement) {
    // Create an iFrame with autoplay set to true
    var iframeUrl = "https://www.youtube.com/embed/" + el.id + "?autoplay=1&autohide=1";
    if ($(el).data('params')) {
        iframeUrl += '&' + $(this).data('params')
    }

    // The height and width of the iFrame should be the same as parent
    var iframe = $('<iframe/>', {
        'frameborder': '0',
        'src': iframeUrl,
        'width': $(el).width(),
        'height': $(el).height()
    });
    iframe.attr("allowfullscreen", "allowfullscreen");

    // Replace the YouTube thumbnail with YouTube HTML5 Player
    $(el).replaceWith(iframe);
}

function getYoutubeVideoId(url: string): string {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : null;
}

function replaceWithYoutubeEmbed(url: string, fallback: string) {
    var videoId = getYoutubeVideoId(url);
    if (!videoId) {
        return fallback;
    }
    var style = "background-image: url(https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg);";
    return "<div id='" + videoId + "' class='youtube' style='" + style + "' onclick='$site.Utils.playYoutube(this);'>" + "<div class='play'></div></div>";
}

function getExternalLinkIconHtml() {
    return " <i class='fa fa-external-link' style='font-size:80%; color:#555;'></i>";
}
function replaceWithPammLink(url: string, fallbackLink: string): string {
    let effectivePrefix = url.indexOf(PAMM_URL_PREFIX) == 0 ? PAMM_URL_PREFIX : url.indexOf(SECURITY_URL_PREFIX) == 0 ? SECURITY_URL_PREFIX : null;
    if (effectivePrefix == null) {
        return fallbackLink;
    }
    var brokerStartIdx = effectivePrefix.length;
    var brokerEndIdx = url.indexOf("/", brokerStartIdx);
    if (brokerEndIdx < 0) {
        return fallbackLink;
    }
    var mount = url.substr(brokerStartIdx, brokerEndIdx - brokerStartIdx);
    var broker = Broker.getBrokerByMount(mount);
    if (typeof broker === 'undefined') {
        return fallbackLink;
    }
    var nameEndIdx = url.indexOf("?", brokerEndIdx);
    if (nameEndIdx < 0) {
        nameEndIdx = url.indexOf("#", brokerEndIdx);
        if (nameEndIdx < 0) {
            nameEndIdx = url.length;
        }
    }
    var nameStartIdx = brokerEndIdx + 1;
    var name = decodeURIComponent(url.substr(nameStartIdx, nameEndIdx - nameStartIdx));
    var sepIdx = name.indexOf("/"); // now name is in <account-number>/<account-name> form. Swap it parts.
    if (sepIdx > 0) {
        var account = name.substr(0, sepIdx);
        if (parseInt(account) > 0) {
            name = name.substr(sepIdx + 1) + "/" + name.substr(0, sepIdx);
        }
    }
    var title = "Счет брокера: " + broker.name;
    //noinspection CssInvalidFunction
    return "<a href='http://" + url + "' style='color:rgb(" + broker.rgb + ")' target='_blank' title='" + title + "'>" + name + getExternalLinkIconHtml() + "</a>";
}

function replaceWithAlpariFundLink(url: string, fallbackLink: string): string {
    if (url.indexOf(ALPARI_FUND_PAMM_URL_PREFIX) != 0) {
        return fallbackLink;
    }
    var nameStartIdx = ALPARI_FUND_PAMM_URL_PREFIX.length;
    var nameEndIdx = url.indexOf("?", nameStartIdx);
    if (nameEndIdx < 0) {
        nameEndIdx = url.indexOf("#", nameStartIdx);
        if (nameEndIdx < 0) {
            nameEndIdx = url.length;
        }
    }
    var name = decodeURIComponent(url.substr(nameStartIdx, nameEndIdx - nameStartIdx));
    var sepIdx = name.indexOf("/"); // now name is in <account-number>/<account-name> form. Swap it parts.
    if (sepIdx > 0) {
        name = name.substr(sepIdx + 1) + "/" + name.substr(0, sepIdx);
    }
    var title = "Фонд. Брокер Альпари";
    //noinspection CssInvalidFunction
    return "<a href='http://" + url + "' style='color:rgb(" + Broker.ALPARI.rgb + ")' target='_blank' title='" + title + "'>" + name + getExternalLinkIconHtml() + "</a>"
}

function getLinkReplacement(link: string): string {
    var lcLink = link.toLocaleLowerCase();
    var url = link;
    if (lcLink.indexOf("http://") == 0) {
        url = link.substr(7);
    } else if (lcLink.indexOf("https://") == 0) {
        url = link.substr(8);
    }
    var lcUrl = url.toLocaleLowerCase();
    var ext = lcUrl.split('.').pop();
    if (ext in KnownImageExtensions) {
        return "<div class='mt5 mb5'>" +
            "<a href='" + link + "' class='swipebox' target='_blank'>" +
            "<img src='" + link + "' style='max-width: 400px; max-height: 300px;'>" +
            "</a>" +
            "</div>"
    }
    if (lcUrl.indexOf(PAMM_URL_PREFIX) == 0 || lcUrl.indexOf(SECURITY_URL_PREFIX) == 0) {
        return replaceWithPammLink(url, null);
    } else if (lcUrl.indexOf(ALPARI_FUND_PAMM_URL_PREFIX) == 0) {
        return replaceWithAlpariFundLink(url, null)
    } else if (getYoutubeVideoId(url) != null) {
        return replaceWithYoutubeEmbed(url, null);
    }
    return null;
}

function processMediaLinks(text: string): string {
    var res = text;
    var startIdx = res.indexOf("<a href=");
    while (startIdx >= 0) {
        var endIdx = res.indexOf("</a>", startIdx);
        if (endIdx < 0) {
            break;
        }
        var hrefStartIdx = startIdx + 9;
        var hrefEndIdx = res.indexOf('"', hrefStartIdx + 1);
        if (hrefEndIdx > 0) {
            var link = res.substring(hrefStartIdx, hrefEndIdx);
            var replacement = getLinkReplacement(link);
            if (replacement != null) {
                res = res.substring(0, startIdx) + replacement + res.substring(endIdx + 4);
                endIdx = startIdx + replacement.length;
            }
        }
        startIdx = res.indexOf("<a href=", endIdx);
    }
    return res;
}

export default {
    processMediaLinks: processMediaLinks,
    playYoutube: playYoutube
}