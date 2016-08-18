var d = document.querySelectorAll('.rc-imageselect-desc-no-canonical');
if (d.length > 0) {
	d = d[0].querySelectorAll('strong');
	if (d.length > 0) {
		console.log(d[0].textContent);
	}
}
