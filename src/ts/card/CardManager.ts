import Card from './Card';
import Shortcut from './Shortcut';
import CardView from './CardView';
import Storage from '../Storage';
import EventEmitter from './EventEmitter';
import CardHandler from './CardHandler';

export default class CardManager {
	public cards: Card[];

	constructor() {
		this.cards = [];
	}

	createCard(
		content: string,
		creationDate: number,
		completionDate: number | null,
		shortcuts: Shortcut[],
		status: string
	) {
		const card = new Card(
			content,
			creationDate,
			completionDate,
			shortcuts,
			status
		);
		const view = new CardView(card);
		const eventEmitter = new EventEmitter();
		const cardHandle = new CardHandler(card, view, eventEmitter);
		eventEmitter.on('edit', () => {
			card.setState(2);
			view.render();
			cardHandle.handleEvent();
		});
		eventEmitter.on('edit-cancel', () => {
			card.setState(1);
			view.render();
			cardHandle.handleEvent();
		});
		eventEmitter.on('edit-save', (
			contentEdit: string, completionDateEdit: number | null
		) => {
			card.edit(contentEdit, completionDateEdit);
			card.setState(1);
			view.render();
			cardHandle.handleEvent();
			Storage.save();
		});
		eventEmitter.on('remove', () => {
			view.element.remove();
			this.removeCard(card);
			Storage.save();
		});
		eventEmitter.on('shortcut', () => {
			card.setState(3);
			view.render();
			cardHandle.handleEvent();
		});
		eventEmitter.on('shortcut-cancel', () => {
			card.setState(1);
			view.render();
			cardHandle.handleEvent();
		});
		eventEmitter.on('shortcut-create', () => {
			card.setState(4);
			view.render();
			cardHandle.handleEvent();
		});
		eventEmitter.on('shortcut-save', (
			color: string, title: string
		) => {
			Storage.saveShortcut(color, title);
			card.setState(3);
			view.render();
			cardHandle.handleEvent();
		});
		view.render();
		cardHandle.handleEvent();

		this.cards.push(card);

		return view;
	}

	removeCard(card: Card) {
		this.cards = this.cards.filter((c) => c !== card);
	}
}
