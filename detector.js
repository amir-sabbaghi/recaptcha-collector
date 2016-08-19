var label = null;

if (!detect()) {
	setTimeout(detect, 1000);
}

function detect() {
	var d = document.querySelectorAll('.rc-imageselect-desc-no-canonical');
	if (d.length > 0) {
		d = d[0].querySelectorAll('strong');
		if (d.length > 0) {
			label = d[0].textContent;
		}
	}
	if (label != null) {
		console.log('label: ' + label);
		const ds = document.querySelectorAll('.rc-image-tile-target');
		if (ds.length == 9)
			for (let d of ds) {
				var img = d.querySelectorAll('img');
				if (img.length == 1) {
					let style = img[0].getAttribute('style');
					let t = style.search('top') + 4;
					t = parseInt(style.slice(t, style.indexOf('%', t))) / 100;
					let l = style.search('left') + 5;
					l = parseInt(style.slice(l, style.indexOf('%', l))) / 100;
					let image = new Image();
					image.src = img[0].src;
					let c = cropImage(image, l * image.width / 3, t * image.height / 3);
					console.log(c);
				}
			}
		return true;
	}
	else {
		console.log('label not found!');
		return false;
	}
}

function cropImage(image, top, left) {
	var canvas = document.createElement("canvas");
	canvas.width = 100;
	canvas.height = 100;
	canvas.getContext("2d").drawImage(image, left, top);
	return canvas.toDataURL("image/png");
}
