var label = null;

document.addEventListener('mousedown', function (e) {
	let label = detectLabel();
	if (label == null) {
		console.log('label not found');
		return;
	}
	console.log('label is ' + label);
	let d = e.target.parentNode;
	if (d.className != 'rc-image-tile-wrapper') {
		console.log('not a tile');
		return;
	}
	var img = d.querySelectorAll('img');
	if (img.length == 0) {
		console.log('image not found for tile');
		return;
	}
	let style = img[0].getAttribute('style');
	let t = parseInt(style.match(/top: *(-?\d+)%/)[1]);
	let l = parseInt(style.match(/left: *(-?\d+)%/)[1]);
	style = d.getAttribute('style');
	let w = parseInt(style.match(/width: *(\d+)px/)[1]);
	let h = parseInt(style.match(/height: *(\d+)px/)[1]);
	let image = new Image();
	image.src = img[0].src;
	let c = cropImage(image, l * w / 100, t * h / 100, w, h);
	console.log(c);
	req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:12345', true);
	req.onreadystatechanged = function () {
		if (req.readyState == XMLHttpRequest.DONE && req.status == 200)
			console.log('sent successfully');
		else
			console.log('failed to send request');
	}
	req.send(c);
}, false);

function detectLabel() {
	var d = document.querySelectorAll('.rc-imageselect-desc');
	if (d.length > 0) {
		d = d[0].querySelectorAll('strong');
		if (d.length > 0) {
			return d[0].textContent;
		}
	}
	else {
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

function cropImage(image, top, left, width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d").drawImage(image, left, top);
	return canvas.toDataURL("image/png");
}
