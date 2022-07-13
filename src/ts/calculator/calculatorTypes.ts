export enum OperationId {
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

export interface OperationInterface {
	id: OperationId;
	arity: number;
	bittonId: string;
	representation: string;
	action: (...args: number[]) => number;
}

export interface HistoryElement {
	id: string,
	opId: OperationId,
	operands: number[],
}

export interface HistoryElementAdding extends HistoryElement {
	initialization?: boolean,
}

export interface CalculatorInterface {
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
	contextMenuDeleteCurrent: (et: EventTarget) => void;
	contextMenuClearHistoryList: (et: EventTarget) => void;
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
