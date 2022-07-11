export function closeModal() {
	const modal = document.getElementById('modal-parent') as HTMLDivElement;
	modal.classList.add('hidden');
}

export function showModal(header: string, context: string) {
	const modal = document.getElementById('modal-parent') as HTMLDivElement;
	const headerDiv = document.getElementById('modal-header') as HTMLDivElement;
	headerDiv.innerText = header;
	const contextDiv = document.getElementById('modal-context') as HTMLDivElement;
	contextDiv.innerText = context;
	modal.classList.remove('hidden');
}

function checkClickIsOutTheModalAndClose(ev: MouseEvent) {
	if (ev.target && (ev.target as HTMLDivElement).id === 'modal-parent') { closeModal(); }
}

const closeModalCross = document.getElementById('close-modal-cross') as HTMLDivElement;
closeModalCross.addEventListener('click', closeModal);

const backDrop = document.getElementById('modal-parent') as HTMLDivElement;
backDrop.addEventListener('click', checkClickIsOutTheModalAndClose);
