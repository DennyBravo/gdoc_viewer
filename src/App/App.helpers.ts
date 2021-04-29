export const upFirstLetter = (string) => {
    return string[0].toUpperCase() + string.substring(1)
}

export const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

export const pick = (obj, props) => {
	let picked = {};

	for (let prop of props) {
		picked[prop] = obj[prop];
	}

	return picked;
}

export const omit = (obj, props: string[]) => {
	let omited = {};

	for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && !props.includes(prop))
            omited[prop] = obj[prop];
	}

	return omited;
}