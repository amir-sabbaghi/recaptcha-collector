browser.runtime.onConnect.addListener(function(p) {
    p.onMessage.addListener(function (m) {
        if (m === 'get') {
            browser.privacy.websites.resistFingerprinting.get({}).then(function (result) {
                p.postMessage(result);
            });
        }
        else if (m === 'set') {
            browser.privacy.websites.resistFingerprinting.set({value: false}).then(function (result) {
                p.postMessage(result);
            });
        } else {
            browser.privacy.websites.resistFingerprinting.clear({}).then(function (result) {
                p.postMessage(result);
            });
        }
    });
});
