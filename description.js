function iOSVersion() {
    var match = navigator.appVersion.split('OS ');
    if (match.length > 1) {
        return match[1].split(' ')[0].split('_').join('.');
    }
    return false;
}

$(function() {
    $("li").on("click", function() {
        if (this.id == "dnt") {
            $("#dnt_txt").text("You can donate USD via PayPal mail: anwar.vip" + "@" + "gmail.com");
        }
    });
});

function loadPackageInfo(agentSearchString) {
    if (navigator.userAgent.search(new RegExp(agentSearchString, "i")) == -1) {
        $("#showAddRepo_, #showAddRepoUrl_").show();
    }
    var urlSelfParts = window.location.href.split('description.html?id=');
    var form_url = urlSelfParts[0] + "packageInfo/" + urlSelfParts[1];
    $.ajax({
        url: form_url,
        type: "GET",
        cache: false,
        crossDomain: true,
        success: function(returnhtml) {
            $("#tweakStatusInfo").hide();
            var decodeResp = JSON.parse(returnhtml);
            if (decodeResp.name) {
                document.title = decodeResp.name;
                $("#name").text(decodeResp.name).show();
            }
            if (decodeResp.desc_short) {
                $("#desc_short").text(decodeResp.desc_short).show();
            }
            if (decodeResp.warning) {
                $("#warning").text(decodeResp.warning).show();
            }
            if (decodeResp.desc_long) {
                $("#desc_long").text(decodeResp.desc_long).show();
            }
            if (decodeResp.compatitle) {
                $("#compatitle").text(decodeResp.compatitle).show();
                var ios_ver = iOSVersion();
                if (ios_ver) {
                    $("#your_ios").text("Current iOS: " + ios_ver).show();
                }
            }
            if (decodeResp.changelog) {
                $("#changelog").text(decodeResp.changelog).show();
            }
            if (decodeResp.screenshot) {
                $("#screenshot").html(decodeResp.screenshot).show();
            }
            if (decodeResp.open === true) {
                $("#is_open_source_").show();
            }
        },
        error: function(err) {
            $("#errorInfo").text("Description unavailable for " + urlSelfParts[1]);
        }
    });
}

function loadRecentUpdates(agentSearchString) {
    var form_url = window.location.protocol + "//" + window.location.hostname + "/last.updates";
    $.ajax({
        url: form_url,
        type: "GET",
        cache: false,
        crossDomain: true,
        success: function(returnhtml) {
            var decodeResp = JSON.parse(returnhtml);
            var htmlnews = "";
            decodeResp.forEach(function(dicNow) {
                var urlOpen = "cydia://package/" + dicNow.package;
                if (navigator.userAgent.search(new RegExp(agentSearchString, "i")) == -1) {
                    urlOpen = window.location.protocol + "//" + window.location.hostname + "/description.html?id=" + dicNow.package;
                }
                htmlnews += "<li><a href='" + urlOpen + "' target='_blank'><img class='icon' src='tweak.png'/><label>" + dicNow.name + " v" + dicNow.version + "</label></a></li>";
            });
            $("#updates").html(htmlnews).show();
        },
        error: function(err) {
            $("#updates_").hide();
        }
    });
}
