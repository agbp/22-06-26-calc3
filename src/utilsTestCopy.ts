// возвращает куки с указанным name,
// или undefined, если ничего не найдено
export function getCookie2(name: string) {
	const matches = document.cookie.match(
		new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`),
		// new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getCookie3(name: string) {
	const matches = document.cookie.match(
		new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`),
		// new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
