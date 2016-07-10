import {Broker} from "./broker";
var KnownImageExtensions = {};
KnownImageExtensions["png"] = true;
KnownImageExtensions["jpg"] = true;
KnownImageExtensions["gif"] = true;

// TODO: portfolios
// TODO: youtube embeds

let PAMM_URL_PREFIX = "investflow.ru/pamm/";
let ALPARI_FUND_PAMM_URL_PREFIX = "investflow.ru/invest/fund/alpari/";

function playYoutube(el:HTMLElement) {
    // Create an iFrame with autoplay set to true
    var iframeUrl = "https://www.youtube.com/embed/" + el.id + "?autoplay=1&autohide=1";
    if ($(el).data('params')) {
        iframeUrl += '&' + $(this).data('params')
    }

    // The height and width of the iFrame should be the same as parent
    var iframe = $('<iframe/>', {'frameborder': '0', 'src': iframeUrl, 'width': $(el).width(), 'height': $(el).height()});
    iframe.attr("allowfullscreen", "allowfullscreen");

    // Replace the YouTube thumbnail with YouTube HTML5 Player
    $(el).replaceWith(iframe);
}

interface YoutubeVideoIdExtractor {
    urlPrefix:string;
    (urlSuffix:string):string;
}
var youtubeComExtractor = <YoutubeVideoIdExtractor> function (urlSuffix:string) {
    var captured = /v=([^&]+)/.exec(urlSuffix)[1];
    return captured ? captured : null;
};
youtubeComExtractor.urlPrefix = "youtube.com/watch";

var youtubeExtractor = <YoutubeVideoIdExtractor> function (urlSuffix:string) {
    var idx1 = urlSuffix.indexOf("/");
    if (idx1 < 0) {
        return urlSuffix;
    } else if (idx1 > 0) {
        return urlSuffix.substring(0, idx1);
    }
    urlSuffix = urlSuffix.substr(1);
    var idx2 = urlSuffix.indexOf("/");
    if (idx2 < 0) {
        return urlSuffix;
    }
    return urlSuffix.substr(0, idx2);
};
youtubeExtractor.urlPrefix = "youtu.be";
var YOUTUBE_VIDEO_ID_EXTRACTORS:Array<YoutubeVideoIdExtractor> = [youtubeComExtractor, youtubeExtractor];

function findYoutubeVideoIdExtractor(url:string):YoutubeVideoIdExtractor {
    if (!url || url.length == 0) {
        return null;
    }
    if (url.indexOf("www.") == 0) {
        url = url.substring(4);
    }
    url = url.toLocaleLowerCase();
    for (var i = 0; i < YOUTUBE_VIDEO_ID_EXTRACTORS.length; i++) {
        var e = YOUTUBE_VIDEO_ID_EXTRACTORS[i];
        if (url.indexOf(e.urlPrefix) == 0) {
            return e;
        }
    }
    return null;
}

function replaceWithYoutubeEmbed(url:string, fallback:string) {
    var e = findYoutubeVideoIdExtractor(url);
    if (e == null) {
        return null;
    }
    var videoId = e(url.substr(e.urlPrefix.length));
    if (!videoId) {
        return fallback;
    }
    var style = "background-image: url(https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg);";
    return "<div id='" + videoId + "' class='youtube' style='" + style + "' onclick='$site.Utils.playYoutube(this);'>" + "<div class='play'></div></div>";
}

function replaceWithPammLink(url:string, fallbackLink:string):string {
    if (url.indexOf(PAMM_URL_PREFIX) != 0) {
        return fallbackLink;
    }
    var brokerStartIdx = PAMM_URL_PREFIX.length;
    var brokerEndIdx = url.indexOf("/", brokerStartIdx);
    if (brokerEndIdx < 0) {
        return fallbackLink;
    }
    var mount = url.substr(brokerStartIdx, brokerEndIdx - brokerStartIdx);
    var broker = Broker.getBrokerByMount(mount);
    if (typeof broker === 'undefined') {
        return fallbackLink;
    }
    var nameEndIdx = url.indexOf("#", brokerEndIdx);
    if (nameEndIdx < 0) {
        nameEndIdx = url.length;
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
    return "<a href='http://" + url + "' style='color:rgb(" + broker.rgb + ")' target='_blank' title='" + title + "'>" + name + "</a>"
}

function replaceWithAlpariFundLink(url:string, fallbackLink:string):string {
    if (url.indexOf(ALPARI_FUND_PAMM_URL_PREFIX) != 0) {
        return fallbackLink;
    }
    var nameStartIdx = ALPARI_FUND_PAMM_URL_PREFIX.length;
    var nameEndIdx = url.indexOf("#", nameStartIdx);
    if (nameEndIdx < 0) {
        nameEndIdx = url.length;
    }
    var name = decodeURIComponent(url.substr(nameStartIdx, nameEndIdx - nameStartIdx));
    var sepIdx = name.indexOf("/"); // now name is in <account-number>/<account-name> form. Swap it parts.
    if (sepIdx > 0) {
        name = name.substr(sepIdx + 1) + "/" + name.substr(0, sepIdx);
    }
    var title = "Фонд. Брокер Альпари";
    //noinspection CssInvalidFunction
    return "<a href='http://" + url + "' style='color:rgb(" + Broker.ALPARI.rgb + ")' target='_blank' title='" + title + "'>" + name + "</a>"
}

function getLinkReplacement(link:string):string {
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
        return "<a href='" + link + "' target='_blank'><img src='" + link + "' style='max-width: 400px; max-height: 300px;'></a>"
    }
    if (lcUrl.indexOf(PAMM_URL_PREFIX) == 0) {
        return replaceWithPammLink(url, null);
    } else if (lcUrl.indexOf(ALPARI_FUND_PAMM_URL_PREFIX) == 0) {
        return replaceWithAlpariFundLink(url, null)
    } else if (findYoutubeVideoIdExtractor(url) != null) {
        return replaceWithYoutubeEmbed(url, null);
    }
    return null;
}

function processMediaLinks(text:string):string {
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