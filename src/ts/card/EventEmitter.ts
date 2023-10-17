export default class EventEmitter {
	private events: {};

	constructor() {
		this.events = {};
	}

	/**
	 * Сборщик событий, описавающий последовательные действия,
	 * условно:
	 *
	 * eventEmitter.emit(eventName, ...args)
	 * View -----> Edit
	 * Добавляет событие, которое можно потом использовать,
	 * т.е. условно вызвать:
	 * eventEmitter.emit(eventName, ..args)
	 *
	 * @param eventName
	 * @param callback
	 */
	on(eventName: string, callback: any) {
		// @ts-ignore
		if (!this.events[eventName]) {
			// @ts-ignore
			this.events[eventName] = [];
		}
		// @ts-ignore
		this.events[eventName].push(callback);
	}

	emit(eventName: string, ...args: any[]) {
		// @ts-ignore
		const callbacks = this.events[eventName];
		if (callbacks) {
			// @ts-ignore
			callbacks.forEach((callback) => callback(...args));
		}
	}
}
