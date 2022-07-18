export type ContextMenuCommands = Map<string, { func: (et: EventTarget) => void, context: any, }>;
export type MenuCommands = Map<string, { func: () => void }>;
