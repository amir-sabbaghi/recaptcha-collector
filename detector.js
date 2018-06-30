var label = null;

function handler(e) {
    if (e.target.id == 'recaptcha-verify-button')
        sendTheRest();
    else {
        if (isCheckbox())
            console.log('check box');
        else
            sendSingle(e.target, true);
    }
}

document.addEventListener('mousedown', async function(e) {
#ifdef TARGET_FIREFOX
    let obj = await RFP('get');
    console.log(obj);
    if (obj.value === false)
        handler(e);
    else if (obj.levelOfControl === "controlled_by_this_extension" || obj.levelOfControl === "controllable_by_this_extension") {
        console.log("temporarily disabling fingerprinting resistance");
        let result = await RFP('set');
        if (result) {
            let c = handler(e);
            result = await RFP('clear');
            if (!result)
                console.log("could not revert resistFingerprinting");
            return c;
        }
        else
            console.log("could not change resistFingerprinting");
    }
#else
    return handler(e);
#endif
}, false);

function sendSingle(n, an) {
    let label = detectLabel();
    if (label == null) {
        console.log('label not found');
        return;
    }
    console.log('label is ' + label);
    let d = n.parentNode;
    if (d.className != 'rc-image-tile-wrapper') {
        console.log('not a tile');
        return;
    }
    var img = d.querySelectorAll('img');
    if (img.length == 0) {
        console.log('image not found for tile');
        return;
    }
    let c = cropImage(img[0]);
    let body = {
        label: label,
        image: c,
        answer: an
    };
    let req = fetch('http://localhost:12345/', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    req.then(function(res) {
        if (res.ok)
            console.log('sent successfully');
        else
            console.log('failed to send data');
    });
    req.catch(function(e) {
        console.log('failed to send request ' + e);
    });
}

function sendTheRest() {
    for (var d of document.querySelectorAll('.rc-imageselect-tile')) {
        var img = d.querySelectorAll('img');
        if (img.length == 0) {
            console.log('img not found in tile!');
            continue;
        }
        if (d.className == 'rc-imageselect-tile rc-imageselect-tileselected') {
            sendSingle(img[0], true);
        } else if (d.className == 'rc-imageselect-tile') {
            sendSingle(img[0], false);
        }
    }
}

function detectLabel() {
    var d = document.querySelectorAll('.rc-imageselect-desc');
    if (d.length > 0) {
        d = d[0].querySelectorAll('strong');
        if (d.length > 0) {
            return d[0].textContent;
        }
    } else {
        d = document.querySelectorAll('.rc-imageselect-desc-no-canonical');
        if (d.length > 0) {
            d = d[0].querySelectorAll('strong');
            if (d.length > 0) {
                return d[0].textContent;
            }
        }
    }
    return null;
}

function isCheckbox() {
    var d = document.querySelectorAll('.rc-imageselect-carousel-instructions');
    if (d.length == 0)
        return false;
    return true;
}

function cropImage(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.offsetWidth;
    canvas.height = image.offsetHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas.toDataURL("image/png");
}

function RFP(cmd) {
	return new Promise((resolve, reject) => {
		var p = browser.runtime.connect();
		p.onMessage.addListener(function (r) {
			resolve(r);
		});
		p.postMessage(cmd);
	});
}
