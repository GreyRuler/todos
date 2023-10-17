import Card from './Card';
import Storage from '../Storage';

export default class CardMove {
	private shiftX = 0;

	private shiftY = 0;

	private handleOnMouseMove!: (event: MouseEvent) => void;

	private handleOnMouseUp!: () => void;

	handleOnHandleCard!: (event: MouseEvent) => void;

	private readonly element!: HTMLElement;

	private plug!: HTMLElement;

	private card: Card;

	constructor(card: Card, element: HTMLElement) {
		this.card = card;
		this.element = element;
	}

	bindToDOM() {
		this.handleOnMouseMove = (event: MouseEvent) => {
			this.onMouseMove(event);
		};
		this.handleOnMouseUp = () => {
			this.onMouseUp();
		};
		this.handleOnHandleCard = (event: MouseEvent) => {
			const isBtn = (event.target as HTMLElement).closest('.btn');
			if (!isBtn) this.onHandleCard(event);
		};

		this.element.addEventListener(
			'mousedown',
			this.handleOnHandleCard
		);
	}

	moveAt(clientX: number, clientY: number) {
		this.element.style.left = `${clientX - this.shiftX}px`;
		this.element.style.top = `${clientY - this.shiftY}px`;
	}

	onMouseMove(event: MouseEvent) {
		const mouseUpItem = event.target as HTMLElement;
		const mouseUpCardItem = mouseUpItem.closest('.card-item');
		const currentCard = mouseUpItem.closest('.card.up');

		if (mouseUpCardItem) {
			if (this.element.offsetHeight / 2 > event.offsetY) {
				mouseUpCardItem.before(this.plug);
			} else {
				mouseUpCardItem.after(this.plug);
			}
		} else if (!currentCard?.querySelector('#plug')) {
			currentCard?.querySelector('#cards')?.append(this.plug);
		}

		this.moveAt(event.clientX, event.clientY);
	}

	onMouseUp() {
		this.plug.replaceWith(this.element);
		this.element.classList.remove('dragged', 'm-0');
		this.element.classList.add('position-relative');

		document.removeEventListener('mousemove', this.handleOnMouseMove);
		document.removeEventListener('mouseup', this.handleOnMouseUp);
		this.element.onmouseup = null;
		this.element.removeAttribute('style');

		const container = this.element.closest('#cards') as HTMLElement;
		this.card.status = container.dataset.status ?? this.card.status;

		Storage.save();
	}

	onHandleCard(event: MouseEvent) {
		if (!(event.target as HTMLElement).classList.contains('btn')) {
			event.preventDefault();
			this.plug = this.createPlug();

			this.element.after(this.plug);
			this.element.style.width = `${this.element.offsetWidth}px`;
			this.element.classList.add('dragged', 'm-0');
			this.element.classList.remove('position-relative');

			const cards = this.element.closest('#cards') as HTMLElement;

			this.shiftX = event.clientX - this.element.getBoundingClientRect().left;
			this.shiftY = event.clientY - (this.element.getBoundingClientRect().top - cards.scrollTop);

			this.moveAt(event.clientX, event.clientY);

			cards.prepend(this.element);

			document.addEventListener('mousemove', this.handleOnMouseMove);
			document.addEventListener('mouseup', this.handleOnMouseUp);
		}
	}

	createPlug() {
		const plug = document.createElement('p');
		plug.id = 'plug';
		plug.classList.add('card', 'grey-color-bg');
		plug.style.height = `${this.element.offsetHeight}px`;
		return plug;
	}
}
