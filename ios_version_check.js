const VERSION_CHECK_SUPPORTED = "Your iOS version (%s) is compatible";
const VERSION_CHECK_NEEDS_UPGRADE = "Requires at least iOS %s";
const VERSION_CHECK_UNCONFIRMED = "Not yet tested on iOS %s";
const VERSION_CHECK_UNSUPPORTED = "Only compatible with iOS %s to %s";

function iosVersionCheck(minIOS, maxIOS, otherIOS, callBack) {
    "use strict";

    function parseVersionString(version) {
        const parts = version.split(".");
        return [
            parseInt(parts[0]),
            parseInt(parts[1]) || 0,
            parseInt(parts[2]) || 0
        ];
    }

    function compareVersions(version1, version2) {
        for (let i = 0; i < version1.length; ++i) {
            if (version2.length === i) {
                return 1;
            }
            if (version1[i] === version2[i]) {
                continue;
            } else if (version1[i] > version2[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return version1.length !== version2.length ? -1 : 0;
    }

    const versionMatch = navigator.appVersion.match(/CPU( iPhone)? OS (\d+)_(\d+)(_(\d+))? like/i);
    if (!versionMatch) {
        return 0;
    }

    const osVersion = [
        parseInt(versionMatch[2]),
        parseInt(versionMatch[3]),
        versionMatch[4] ? parseInt(versionMatch[5]) : 0
    ];

    const osString = `${osVersion[0]}.${osVersion[1]}${osVersion[2] !== 0 ? `.${osVersion[2]}` : ''}`;
    const minVersion = parseVersionString(minIOS);
    const maxVersion = maxIOS ? parseVersionString(maxIOS) : null;

    let message = VERSION_CHECK_SUPPORTED.replace("%s", osString);
    let isBad = false;

    if (compareVersions(minVersion, osVersion) === 1) {
        message = VERSION_CHECK_NEEDS_UPGRADE.replace("%s", minIOS);
        isBad = true;
    } else if (maxVersion && compareVersions(maxVersion, osVersion) === -1) {
        if (otherIOS === "unsupported") {
            message = VERSION_CHECK_UNSUPPORTED.replace("%s", minIOS).replace("%s", maxIOS);
        } else {
            message = VERSION_CHECK_UNCONFIRMED.replace("%s", osString);
        }
        isBad = true;
    }

    callBack(message, isBad);

    return isBad ? -1 : 1;
}
