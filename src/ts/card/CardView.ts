import Card from './Card';
import Shortcut from './Shortcut';
// eslint-disable-next-line import/no-cycle
import CardMove from './CardMove';
// eslint-disable-next-line import/no-cycle
import Storage from '../Storage';

export default class CardView {
	private readonly card: Card;

	public element: HTMLElement;

	public move: CardMove;

	static get selectorCompletionDateEdit() {
		return '.date-completion-edit';
	}

	static get selectorContent() {
		return '.card-item .card-body .content';
	}

	static markupStateDefault(
		content: string, creationDate: number, completionDate: number | null, shortcuts: Shortcut[]
	) {
		return `
			<div class="card-header position-absolute baby-color d-flex justify-content-end">
				<button class="btn option">
					<div class="svg-option-icon"></div>
				</button>
				<button class="btn shortcut">
					<div class="svg-label-icon"></div>
				</button>
				<button class="btn edit">
					<div class="svg-edit-icon"></div>
				</button>
				<button class="btn remove">
					<div class="svg-remove-icon"></div>
				</button>
			</div>
			<div class="card-body mt-3 pt-0">
				<div class="shortcuts-container">
					${this.markupStateDefaultShortcut(shortcuts)}
				</div>
				<p class="text-muted mb-2">
					<span class="creation-date" data-date-number="${creationDate}">
						${this.conversionDate(creationDate)}
					</span>
					<span class="completion-date" data-date-number="${completionDate ?? ''}">
						${completionDate ? this.conversionDate(completionDate) : ''}
					</span>
				</p>
				<p class="content" contenteditable="false">${content}</p>
			</div>
		`;
	}

	static markupStateEdit(
		content: string, creationDate: number, completionDate: number | null
	) {
		return `
			<div class="card-header state-shortcut position-absolute baby-color d-flex justify-content-end">
				<button class="btn" id="btn-cancel">
					 <div class="svg-icon svg-close-icon"></div>
				</button>
			</div>
			<div class="card-body mt-3 pt-0">
				<p class="text-muted mb-2">
					<span class="creation-date" data-date-number="${creationDate}">
						${this.conversionDate(creationDate)}
					</span>
				</p>
				<p class="content" contenteditable="true">${content}</p>
				<input class="date-completion-edit form-control"
					   type="date" value="${this.conversionCompletionDate(completionDate)}">
			</div>
			<div class="card-footer d-flex justify-content-between">
				<button class="btn btn-success w-100" id="btn-save">
					Сохранить изменения
				</button>
			</div>
		`;
	}

	static markupStateAppendShortcut(shortcuts: Shortcut[], selectShortcuts: Shortcut[]) {
		return `
			<div class="card-header state-shortcut baby-color d-flex justify-content-end">
				<span class="title-shortcut">Добавить ярлык</span>
				<button class="btn" id="btn-cancel">
					 <div class="svg-icon svg-close-icon"></div>
				</button>
			</div>
			<div class="card-body p-0 shortcuts-body">
				${this.markupShortcuts(shortcuts, selectShortcuts)}
			</div>
			<div class="card-footer">
				<button class="btn btn-success w-100" id="btn-create-shortcut">
					Создать ярлык
				</button>
			</div>
		`;
	}

	static get markupStateCreateShortcut() {
		return `
			<div class="card-header state-shortcut baby-color d-flex justify-content-end">
				<button class="btn" id="btn-return">
					 <div class="svg-icon svg-back-icon"></div>
				</button>
				<span class="title-shortcut p-0">Создание ярлыка</span>
				<button class="btn" id="btn-cancel">
					 <div class="svg-icon svg-close-icon"></div>
				</button>
			</div>
			<div class="card-body">
				<div class="input-group">
					<input type="color" class="form-control form-control-color"
						   title="Выберите цвет" name="color">
					<input type="text" class="form-control" name="title" autofocus>
				</div>
			</div>
			<div class="card-footer">
				<button class="btn btn-success w-100" id="btn-save">
					Создать
				</button>
			</div>
		`;
	}

	// eslint-disable-next-line class-methods-use-this
	static conversionDate(initiallyDate: number) {
		const date = new Date(initiallyDate);
		return date.toLocaleDateString();
	}

	static conversionCompletionDate(initiallyDate: number | null) {
		if (initiallyDate) {
			const date = new Date(initiallyDate);
			return date.toISOString().split('T')[0];
		}
		return '';
	}

	static markupStateDefaultShortcut(shortcuts: Shortcut[]) {
		return shortcuts.reduce(
			(previous, current) => {
				previous += `
					<span class="badge rounded-pill mb-1 text-truncate"
					 	  style="background-color: ${current.color}">
						${current.title}
					</span>
				`;
				return previous;
			}, ''
		);
	}

	static markupShortcuts(shortcuts: Shortcut[], selectShortcuts: Shortcut[]) {
		return shortcuts.reduce((previousValue, currentValue, index) => {
			const isChecked = selectShortcuts.find(
				(s) => currentValue.color === s.color && currentValue.title === s.title
			) ? 'checked' : '';
			previousValue += `
				<label class="d-flex align-items-center" for="check-shortcut-${index}">
					<input type="checkbox" id="check-shortcut-${index}" ${isChecked}>
					<div class="color-shortcut flex-shrink-0" style="background-color: ${currentValue.color}" data-color="${currentValue.color}"></div>
					<span class="name-shortcut">${currentValue.title}</span>
				</label>
			`;
			return previousValue;
		}, '');
	}

	constructor(card: Card) {
		this.card = card;
		this.element = document.createElement('div');
		this.element.classList.add(
			'card-item',
			'card',
			'position-relative',
			'text-break',
			'text-light'
		);
		this.move = new CardMove(card, this.element);
		this.move.bindToDOM();
	}

	render() {
		switch (this.card.state) {
			case 1: {
				this.element.innerHTML = CardView.markupStateDefault(
					this.card.content,
					this.card.creationDate,
					this.card.completionDate,
					this.card.shortcuts
				);
				break;
			}
			case 2: {
				this.element.innerHTML = CardView.markupStateEdit(
					this.card.content,
					this.card.creationDate,
					this.card.completionDate
				);
				break;
			}
			case 3: {
				this.element.innerHTML = CardView.markupStateAppendShortcut(
					Storage.loadShortcuts(),
					this.card.shortcuts
				);
				break;
			}
			case 4: {
				this.element.innerHTML = CardView.markupStateCreateShortcut;
				break;
			}
			default: {
				console.warn('Неизвестное состояние');
				break;
			}
		}
	}
}
