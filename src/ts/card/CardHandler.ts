import Card from './Card';
// eslint-disable-next-line import/no-cycle
import CardView from './CardView';
import EventEmitter from './EventEmitter';
import setFocusToEnd from '../utils/focus';
import Storage from '../Storage';

export default class CardHandler {
	private card: Card;

	private view: CardView;

	private eventEmitter: EventEmitter;

	static get selectorBtnEdit() {
		return '.btn.edit';
	}

	static get selectorBtnSave() {
		return '#btn-save';
	}

	static get selectorBtnCancel() {
		return '#btn-cancel';
	}

	static get selectorBtnRemove() {
		return '.btn.remove';
	}

	static get selectorBtnShortcut() {
		return '.btn.shortcut';
	}

	static get selectorBtnCreateShortcut() {
		return '#btn-create-shortcut';
	}

	static get selectorBtnReturn() {
		return '#btn-return';
	}

	static get selectorColor() {
		return '[name="color"]';
	}

	static get selectorTitle() {
		return '[name="title"]';
	}

	static get selectorLabelShortcut() {
		return 'label[for^="check-shortcut"]';
	}

	static get selectorSelectShortcut() {
		return 'label[for^="check-shortcut"] input';
	}

	static get selectorColorShortcut() {
		return 'label[for^="check-shortcut"] .color-shortcut';
	}

	static get selectorNameShortcut() {
		return 'label[for^="check-shortcut"] .name-shortcut';
	}

	constructor(card: Card, view: CardView, eventEmitter: EventEmitter) {
		this.card = card;
		this.view = view;
		this.eventEmitter = eventEmitter;
	}

	/**
	 * Этот метод, необходимо повесить на кнопки, при клике
	 * на них он будет вызываться
	 */
	handleEvent() {
		switch (this.card.state) {
			case 1: {
				const btnEdit = this.view.element
					.querySelector(CardHandler.selectorBtnEdit);
				const btnRemove = this.view.element
					.querySelector(CardHandler.selectorBtnRemove);
				const btnAppendShortcut = this.view.element
					.querySelector(CardHandler.selectorBtnShortcut);
				btnEdit?.addEventListener('click', () => {
					this.eventEmitter.emit('edit');
				});
				btnRemove?.addEventListener('click', () => {
					this.eventEmitter.emit('remove');
				});
				btnAppendShortcut?.addEventListener('click', () => {
					this.eventEmitter.emit('shortcut');
				});
				this.view.element.addEventListener(
					'mousedown',
					this.view.move.handleOnHandleCard
				);
				break;
			}
			case 2: {
				const btnSave = this.view.element
					.querySelector(CardHandler.selectorBtnSave);
				const content = this.view.element
					.querySelector(CardView.selectorContent) as HTMLElement;
				const completionDate = this.view.element
					.querySelector(CardView.selectorCompletionDateEdit) as HTMLInputElement;
				const btnCancel = this.view.element
					.querySelector(CardHandler.selectorBtnCancel);
				setFocusToEnd(content);
				btnSave?.addEventListener('click', () => {
					this.eventEmitter.emit(
						'edit-save',
						content?.innerText,
						completionDate.valueAsNumber || null
					);
				});
				btnCancel?.addEventListener('click', () => {
					this.eventEmitter.emit('edit-cancel');
				});
				this.view.element.removeEventListener(
					'mousedown',
					this.view.move.handleOnHandleCard
				);
				break;
			}
			case 3: {
				const btnCancel = this.view.element
					.querySelector(CardHandler.selectorBtnCancel);
				const btnCreateShortcut = this.view.element
					.querySelector(CardHandler.selectorBtnCreateShortcut);
				const shortcuts = Array.from(
					this.view.element
						.querySelectorAll(CardHandler.selectorLabelShortcut)
				) as HTMLElement[];
				btnCancel?.addEventListener('click', () => {
					this.eventEmitter.emit('shortcut-cancel');
				});
				btnCreateShortcut?.addEventListener('click', () => {
					this.eventEmitter.emit('shortcut-create');
				});
				[...shortcuts].forEach((shortcut) => {
					const selectShortcut = shortcut.querySelector(
						CardHandler.selectorSelectShortcut
					) as HTMLInputElement;
					const color = shortcut.querySelector(
						CardHandler.selectorColorShortcut
					) as HTMLElement;
					const name = shortcut.querySelector(
						CardHandler.selectorNameShortcut
					) as HTMLElement;
					selectShortcut.addEventListener('change', () => {
						const changeShortcut = {
							color: color.dataset.color ?? '',
							title: name.innerText
						};
						if (selectShortcut.checked) {
							this.card.addShortcut(changeShortcut);
						} else {
							this.card.removeShortcut(changeShortcut);
						}
						Storage.save();
					});
				});
				this.view.element.removeEventListener(
					'mousedown',
					this.view.move.handleOnHandleCard
				);
				break;
			}
			case 4: {
				const btnReturn = this.view.element
					.querySelector(CardHandler.selectorBtnReturn);
				const btnCancel = this.view.element
					.querySelector(CardHandler.selectorBtnCancel);
				const btnSave = this.view.element
					.querySelector(CardHandler.selectorBtnSave);
				const color = this.view.element
					.querySelector(CardHandler.selectorColor) as HTMLInputElement;
				const title = this.view.element
					.querySelector(CardHandler.selectorTitle) as HTMLInputElement;
				btnCancel?.addEventListener('click', () => {
					this.eventEmitter.emit('shortcut-cancel');
				});
				btnReturn?.addEventListener('click', () => {
					this.eventEmitter.emit('shortcut');
				});
				btnSave?.addEventListener('click', () => {
					this.eventEmitter.emit(
						'shortcut-save',
						color.value,
						title.value
					);
				});
				this.view.element.removeEventListener(
					'mousedown',
					this.view.move.handleOnHandleCard
				);
				break;
			}
			default: {
				console.warn('Неизвестное состояние');
				break;
			}
		}
	}

	// onStateDefault(event: Event) {
	// 	const element = event.target as HTMLElement;
	// 	if (element.classList.contains('edit')) {
	// 		const id = element.dataset.id;
	// 		const task = tasks.find((task) => task.id === id);
	// 		if (task) {
	// 			const controller = new TaskController(task, new TaskView(task));
	// 			controller.handleevent(event);
	// 		}
	// 	} else if (element.matches(CardHandler.selectorBtnSave)) {
	//
	// 	}
	// }
}
