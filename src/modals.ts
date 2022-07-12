import { HistoryElement } from "./index";

export function closeModal() {
	const modal = document.getElementById('modal') as HTMLDivElement;
	modal.classList.add('modal-hidden');
	const modalParent = document.getElementById('modal-parent') as HTMLDivElement;
	modalParent.classList.add('modal-hidden');
}

export function showModal(header: string, context: string) {
	const modalParent = document.getElementById('modal-parent') as HTMLDivElement;
	modalParent.classList.remove('modal-hidden');
	const modal = document.getElementById('modal') as HTMLDivElement;
	const headerDiv = document.getElementById('modal-header') as HTMLDivElement;
	headerDiv.innerText = header;
	const contextDiv = document.getElementById('modal-context') as HTMLDivElement;
	contextDiv.innerText = context;
	modal.classList.remove('modal-hidden');
}

export function closeContext() {
	const modal = document.getElementById('modal-history-context-menu') as HTMLDivElement;
	modal.classList.add('modal-hidden');
	const modalParent = document.getElementById('modal-parent') as HTMLDivElement;
	modalParent.classList.add('modal-hidden');
}

export function showContextMenu(ev: MouseEvent, historyList: HistoryElement[]) {
	ev.preventDefault();
	const modalParent = document.getElementById('modal-parent') as HTMLDivElement;
	modalParent.classList.remove('modal-hidden');
	const modalContextMenu = document.getElementById('modal-history-context-menu') as HTMLDivElement;
	modalContextMenu.style.position = 'absolute'; // todo - why does it needs here ?
	modalContextMenu.style.left = String(ev.pageX).concat('px');
	modalContextMenu.style.top = String(ev.pageY).concat('px');
	modalContextMenu.classList.remove('modal-hidden');
	modalContextMenu.onclick = (evCommand: MouseEvent) => {
		closeContext();
		if (!evCommand || !evCommand.target) return;
		let { target } = ev;
		if (!target) return;
		if ((target as HTMLElement).tagName !== 'tr') {
			target = (target as HTMLElement).parentElement;
		}
		const rowId = '"' + JSON.parse((target as HTMLTableRowElement).cells[0].innerText) + '"';
		const row = historyList.find((el: HistoryElement) => {
			return JSON.stringify(el.date) === rowId;
		});
		switch ((evCommand.target as HTMLLIElement).innerText) {
			case 'delete current item':
				showModal('Are you sure ?', `Delete history item "${(target! as HTMLTableRowElement).innerText}" ?`);
				break;
			default:
		}
	};
}

function checkClickIsOutTheModalAndClose(ev: MouseEvent) {
	if (ev.target && (ev.target as HTMLDivElement).id === 'modal-parent') { closeModal(); }
}

const closeModalCross = document.getElementById('close-modal-cross') as HTMLDivElement;
closeModalCross.addEventListener('click', closeModal);

const backDrop = document.getElementById('modal-parent') as HTMLDivElement;
backDrop.addEventListener('click', checkClickIsOutTheModalAndClose);

const modal = document.getElementById('modal') as HTMLDivElement;
let dndStartX: number;
let dndStartY: number;

function moveModal(ev: MouseEvent) {
	modal.style.left = String(ev.pageX - dndStartX).concat('px');
	modal.style.top = String(ev.pageY - dndStartY).concat('px');
}

const modalHeader = document.getElementById('modal-header') as HTMLDivElement;
let prevOnMouseMove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null = null;
modalHeader.onmousedown = (ev: MouseEvent) => {
	modal.style.position = 'absolute';
	modal.style.cursor = 'move';
	prevOnMouseMove = document.onmousemove;
	document.onmousemove = moveModal;
	dndStartX = ev.pageX - modal.offsetLeft;
	dndStartY = ev.pageY - modal.offsetTop;
};

modal.onmouseup = function resetDragNDropModal(ev: MouseEvent) {
	document.onmousemove = prevOnMouseMove;
	modalHeader.onmouseup = null;
	modal.style.cursor = '';
};