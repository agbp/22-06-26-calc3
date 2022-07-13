// возвращает куки с указанным name,
// или undefined, если ничего не найдено
export function getCookie(name: string) {
	const matches = document.cookie.match(
		new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`),
		// new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getNewId() {
	return JSON.stringify(new Date());
}

export function deleteChilds(el: HTMLElement) {
	let child = el.lastElementChild;
	while (child) {
		el.removeChild(child);
		child = el.lastElementChild;
	}
}
