import './styles/index.scss';
import './styles/modals.scss';
import { getCookie } from './utils';

enum OperationId {
	plus = 10,
	minus = 20,
	multiply = 30,
	divide = 40,
	percent = 50,
	equal = 60,
	pow = 70,
	sqrt = 80,
	sin = 90,
	cos = 100,
	asin = 110,
	acos = 120,
	log = 130,
	oneDivX = 140,
}

interface OperationInterface {
	id: OperationId;
	arity: number;
	bittonId: string;
	representation: string;
	action: (...args: number[]) => number;
}

interface HistoryElement {
	opId: OperationId,
	operands: number[],
}

interface HistoryElementAdding extends HistoryElement {
	initialization?: boolean,
}

interface CalculatorInterface {
	inputElement: HTMLInputElement;
	historyDiv: HTMLDivElement;
	scientificDiv: HTMLDivElement;
	historyList: HTMLUListElement;
	historyTable: HTMLTableElement;
	historyListData: HistoryElement[];
	stack: (number | OperationId)[];
	operations: OperationInterface[];
	waiting4NewNumber: boolean;
	historyOpened: boolean;
	scientificOpened: boolean;
	prevOperation: HistoryElement | undefined;
	addActionToButtonClick: (buttonId: string, action: () => void) => void;
	addInputToButtonClick: (
		buttonId: string,
		input: string | OperationId
	) => void;
	addEventsToDigitButtons: () => void;
	initOperations: () => void;
	init: () => void;
	changeHistoryDisplay: () => void;
	changeScientificDisplay: () => void;
	clearInput: () => void;
	operationHandler: (input: OperationId) => void,
	digitHandler: (input: string) => void,
	addDigitOrOperation: (digit: string | OperationId) => void;
	// addToHistoryList: (arg: string, initialization?: boolean) => void;
	compareOperands: (operands1: number[], operands2: number[]) => boolean;
	addToHistoryList: (data: HistoryElementAdding) => void;
	getHistoryList: () => void;
	saveHistoryList: () => void;
}

const calculator: CalculatorInterface = {
	inputElement: document.getElementById('calc_input') as HTMLInputElement,
	historyDiv: document.getElementById('calc_history') as HTMLDivElement,
	scientificDiv: document.getElementById('calc_scientific') as HTMLDivElement,
	historyList: document.getElementById('calc_history_list') as HTMLUListElement,
	historyTable: document.getElementById('calc_history_table') as HTMLTableElement,
	historyListData: [],
	stack: [],
	waiting4NewNumber: false,
	historyOpened: false,
	scientificOpened: false,
	operations: [],
	prevOperation: undefined,
	addActionToButtonClick(buttonId, action) {
		const btn = document.getElementById(buttonId) as HTMLButtonElement;
		btn.addEventListener('click', action);
	},
	addInputToButtonClick(buttonId, input) {
		this.addActionToButtonClick(buttonId, () => {
			this.addDigitOrOperation(input);
		});
	},
	addEventsToDigitButtons() {
		for (let i = 0; i < 10; i += 1) {
			this.addInputToButtonClick(`btn_${i}`, String(i));
		}
	},
	initOperations() {
		this.operations.push({
			id: OperationId.equal,
			bittonId: 'btn_equal',
			arity: 0,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			action: (a: number, b: number) => NaN,
			representation: '=',
		});
		this.operations.push({
			id: OperationId.plus,
			bittonId: 'btn_plus',
			arity: 2,
			action: (a: number, b: number) => a + b,
			representation: '+',
		});
		this.operations.push({
			id: OperationId.minus,
			bittonId: 'btn_minus',
			arity: 2,
			action: (a: number, b: number) => a - b,
			representation: '-',
		});
		this.operations.push({
			id: OperationId.multiply,
			bittonId: 'btn_multiply',
			arity: 2,
			action: (a: number, b: number) => a * b,
			representation: '×',
		});
		this.operations.push({
			id: OperationId.divide,
			bittonId: 'btn_divide',
			arity: 2,
			action: (a: number, b: number) => a / b,
			representation: '/',
		});
		this.operations.push({
			id: OperationId.pow,
			bittonId: 'btn_pow',
			arity: 2,
			action: (a: number, b: number) => a ** b,
			representation: '^',
		});
		this.operations.push({
			id: OperationId.sqrt,
			bittonId: 'btn_sqrt',
			arity: 1,
			action: (a: number) => Math.sqrt(a),
			representation: '√',
		});
		this.operations.push({
			id: OperationId.percent,
			bittonId: 'btn_percent',
			arity: 1,
			action: (a: number) => a / 100,
			representation: '%',
		});
		this.operations.push({
			id: OperationId.sin,
			bittonId: 'btn_sin',
			arity: 1,
			action: (a: number) => Math.sin(a),
			representation: 'sin',
		});
		this.operations.push({
			id: OperationId.cos,
			bittonId: 'btn_cos',
			arity: 1,
			action: (a: number) => Math.cos(a),
			representation: 'cos',
		});
		this.operations.push({
			id: OperationId.asin,
			bittonId: 'btn_asin',
			arity: 1,
			action: (a: number) => Math.asin(a),
			representation: 'asin',
		});
		this.operations.push({
			id: OperationId.acos,
			bittonId: 'btn_acos',
			arity: 1,
			action: (a: number) => Math.acos(a),
			representation: 'acos',
		});
		this.operations.push({
			id: OperationId.log,
			bittonId: 'btn_log',
			arity: 1,
			action: (a: number) => Math.log(a),
			representation: 'log',
		});
		this.operations.push({
			id: OperationId.oneDivX,
			bittonId: 'btn_oneDivX',
			arity: 1,
			action: (a: number) => 1 / a,
			representation: '1/',
		});
		this.operations.forEach((el: OperationInterface) => {
			this.addInputToButtonClick(el.bittonId, el.id);
		});
	},
	init() {
		const historyBtn = document.getElementById(
			'btn_history',
		) as HTMLButtonElement;
		historyBtn.addEventListener('click', this.changeHistoryDisplay.bind(this));
		const scientificBtn = document.getElementById(
			'btn_scientific',
		) as HTMLButtonElement;
		scientificBtn.addEventListener(
			'click',
			this.changeScientificDisplay.bind(this),
		);
		this.initOperations();
		this.clearInput();
		this.inputElement.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.value === '') {
				this.clearInput();
			}
		});
		this.addActionToButtonClick('btn_clear', this.clearInput.bind(this));
		this.addEventsToDigitButtons();
		this.addInputToButtonClick('btn_pt', '.');
		this.addInputToButtonClick('btn_backspace', '\b');
		document.addEventListener('keydown', (event: KeyboardEvent) => {
			// console.log('key pressed : ', event.key, ' key code = ', event.keyCode);
			switch (event.key) {
				case '.':
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					this.addDigitOrOperation(event.key);
					break;
				case '+':
					this.addDigitOrOperation(OperationId.plus);
					break;
				case '-':
					this.addDigitOrOperation(OperationId.minus);
					break;
				case '*':
					this.addDigitOrOperation(OperationId.multiply);
					break;
				case '/':
					this.addDigitOrOperation(OperationId.divide);
					break;
				case '=':
					this.addDigitOrOperation(OperationId.equal);
					break;
				case '%':
					this.addDigitOrOperation(OperationId.percent);
					break;
				case 'Backspace':
					this.addDigitOrOperation('\b');
					break;
				default:
					switch (event.code) {
						case 'KeyC':
							this.clearInput();
							break;
						case 'KeyH':
							this.changeHistoryDisplay();
							break;
						case 'KeyS':
							this.changeScientificDisplay();
							break;
						case 'ArrowUp': // ArrowUp
						case 'ArrowDown': // ArrowDown
						default:
					}
			}
		});
		const historyOpenedFromCookie = getCookie('historyOpened');
		if (historyOpenedFromCookie !== undefined
			&& String(this.historyOpened) !== historyOpenedFromCookie) {
			this.changeHistoryDisplay();
		}
		const scientificOpenedFromCookie = getCookie('scientificOpened');
		if (scientificOpenedFromCookie !== undefined
			&& String(this.scientificOpened) !== scientificOpenedFromCookie) {
			this.changeScientificDisplay();
		}

		this.getHistoryList();
	},
	changeHistoryDisplay() {
		this.historyOpened = !this.historyOpened;
		this.historyDiv.classList.toggle('hidden');
		this.historyDiv.classList.toggle('shown');
		document.cookie = `historyOpened=${this.historyOpened}`;
	},
	changeScientificDisplay() {
		this.scientificOpened = !this.scientificOpened;
		this.scientificDiv.classList.toggle('hidden');
		this.scientificDiv.classList.toggle('shown');
		document.cookie = `scientificOpened=${this.scientificOpened}`;
	},
	clearInput() {
		this.inputElement.value = '0';
		this.stack.length = 0;
	},
	operationHandler(input: OperationId) {
		const currOperation = this.operations.find(
			(el: OperationInterface) => el.id === input,
		);
		let result = NaN;
		if (this.stack.length) { // there is data in stack to be calculated
			const opId = this.stack.pop() as OperationId;
			const operation = this.operations.find(
				(el: OperationInterface) => el.id === opId,
			);
			const operands: number[] = [];
			for (let i = 1; i < (operation?.arity ?? 0); i += 1) {
				operands.push(this.stack.pop() as number);
			}
			operands.push(Number(this.inputElement.value));
			if (operation) {
				result = operation?.action.apply(null, operands) ?? NaN;
				this.inputElement.value = String(result);
				this.addToHistoryList({ opId: operation.id, operands });
			}
		} else { // there is no data in stack to calculate
			result = Number(this.inputElement.value);
		}
		if (currOperation && currOperation.arity === 1) {
			// no need to push in stack, just calculate right now
			const operand = Number(this.inputElement.value);
			result = currOperation?.action(operand) ?? NaN;
			this.addToHistoryList({
				opId: currOperation.id,
				operands: [operand],
			});
			this.inputElement.value = String(result);
		} else if ((currOperation?.arity ?? 0) > 1) {
			this.stack.push(result);
			this.stack.push(input as OperationId);
		}
		this.waiting4NewNumber = true;
	},
	digitHandler(input: string) {
		if (this.waiting4NewNumber && input !== '\b') {
			// start of input a new number
			this.inputElement.value = '';
			this.waiting4NewNumber = false;
		}
		if (input === '\b') {
			// backspace button pressed
			if (this.inputElement.value === 'Infinity' || this.inputElement.value === 'NaN') {
				this.inputElement.value = '0';
			} else {
				this.inputElement.value = this.inputElement.value.slice(0, -1);
				if (this.inputElement.value === '') this.inputElement.value = '0';
			}
			this.waiting4NewNumber = false;
			return;
		}
		if (input === '.') {
			// decimal point button pressed
			if (this.inputElement.value.indexOf('.') !== -1) return;
			if (Number(this.inputElement.value) === 0) { this.inputElement.value = '0'; }
		} else {
			if (input === '0') if (this.inputElement.value === '0') return; // ignore input of 0 if current string value is 0
			if (
				this.inputElement.value.indexOf('.') === -1
				&& Number(this.inputElement.value) === 0
			) { this.inputElement.value = ''; } // there is no decimal point and last input is equal to 0, replace last input with new
		}
		this.inputElement.value += input;
		// add next digit to current number input
	},
	addDigitOrOperation(input: string | OperationId) {
		if (input in OperationId) { // is operation button pressed ?
			this.operationHandler(input as OperationId);
		} else { // not operation button preesed
			this.digitHandler(input as string);
		}
	},
	compareOperands(operands1: number[], operands2: number[]) {
		if (operands1.length !== operands2.length) return false;
		for (let i = 0; i < operands1.length; i += 1) {
			if (operands1[i] !== operands2[i]) return false;
		}
		return true;
	},
	addToHistoryList({
		opId: operationId,
		operands,
		initialization = false,
	}: HistoryElementAdding) {
		if (this.prevOperation
			&& this.prevOperation.opId === operationId
			&& this.compareOperands(this.prevOperation.operands, operands)) {
			return;
		}
		this.prevOperation = { opId: operationId, operands };
		const newHistoryRow = document.createElement('tr');
		const newHistoryTdOperation = document.createElement('td');
		const operation = this.operations.find((el) => el.id === operationId);
		if (!operation) return;
		newHistoryTdOperation.innerText = operation.representation;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		newHistoryTdOperation.addEventListener('click', (ev: MouseEvent) => {
			this.operationHandler(operationId);
		});
		const newHistoryTdOperand0 = document.createElement('td');
		const newHistoryTdOperand1 = document.createElement('td');
		if (operands[1]) {
			newHistoryTdOperand0.innerText = String(operands[0]);
			newHistoryTdOperand0.addEventListener('click', (ev: MouseEvent) => {
				this.inputElement.value = (ev.target as HTMLTableCellElement).innerText;
			});
			newHistoryTdOperand1.innerText = String(operands[1]);
		} else {
			newHistoryTdOperand1.innerText = String(operands[0]);
		}
		newHistoryTdOperand1.addEventListener('click', (ev: MouseEvent) => {
			this.inputElement.value = (ev.target as HTMLTableCellElement).innerText;
		});
		const newHistoryTdEqualSign = document.createElement('td');
		newHistoryTdEqualSign.innerText = '=';
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		newHistoryTdEqualSign.addEventListener('click', (ev: MouseEvent) => {
			this.operationHandler(OperationId.equal);
		});
		const newHistoryTdResult = document.createElement('td');
		newHistoryTdResult.addEventListener('click', (ev: MouseEvent) => {
			this.inputElement.value = (ev.target as HTMLTableCellElement).innerText;
		});
		newHistoryTdResult.innerText = String(operation.action(...operands));
		newHistoryRow.appendChild(newHistoryTdOperand0);
		newHistoryRow.appendChild(newHistoryTdOperation);
		newHistoryRow.appendChild(newHistoryTdOperand1);
		newHistoryRow.appendChild(newHistoryTdEqualSign);
		newHistoryRow.appendChild(newHistoryTdResult);
		this.historyTable.appendChild(newHistoryRow);

		if (initialization) return;
		this.historyListData.push({ opId: operationId, operands });
		this.saveHistoryList();
	},
	getHistoryList() {
		const historyFromCookie = getCookie('historyList');
		if (historyFromCookie) {
			this.historyListData = JSON.parse(historyFromCookie);
			this.historyListData.forEach((el: HistoryElement) => {
				this.addToHistoryList.call(this, { ...el, initialization: true });
			});
		}
	},
	saveHistoryList() {
		if (this.historyListData.length) {
			document.cookie = `historyList=${JSON.stringify(this.historyListData)}`;
		}
	},
};

calculator.init();

function closeModal() {
	const modal = document.getElementById('modal-parent') as HTMLDivElement;
	modal.classList.add('hidden');
}

const closeModalCross = document.getElementById('close-modal-cross') as HTMLDivElement;
closeModalCross.addEventListener('click', closeModal);
