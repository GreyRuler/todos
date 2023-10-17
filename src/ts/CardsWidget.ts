import CardFormWidget from './CardFormWidget';
import App from './App';
import Storage from './Storage';

export default class CardsWidget {
	private element: HTMLElement;

	private readonly title: string;

	protected status!: string;

	static get markup() {
		return `<div class="card up">
			<div class="card-body" id="list-card-widget">
				<h5 class="card-title text-light" id="card-title"></h5>
					<div id="cards" class="overflow-auto flex-grow-0""></div>
					<button class="btn btn-warning baby-color mt-auto w-100 border-0 order-5"
							id="add-card" type="button">
						 \u{002B} Добавить другую задачу
					</button>
			</div>
		</div>`;
	}

	static get selectorButtonAddCard() {
		return '#add-card';
	}

	static get selectorCards() {
		return '#cards';
	}

	static get selectorListCardWidget() {
		return '#list-card-widget';
	}

	static get selectorTitleCard() {
		return '#card-title';
	}

	constructor(element: HTMLElement, title: string) {
		this.element = element;
		this.title = title;
	}

	bindToDOM() {
		this.element.innerHTML = CardsWidget.markup;

		const cardTitle = this.element.querySelector(
			CardsWidget.selectorTitleCard
		);
		const buttonAddCard = this.element.querySelector(
			CardsWidget.selectorButtonAddCard
		) as HTMLButtonElement;
		const cardsContainer = this.element.querySelector(
			CardsWidget.selectorCards
		) as HTMLElement;
		const listCardWidget = this.element.querySelector(
			CardsWidget.selectorListCardWidget
		) as HTMLElement;
		Storage
			.load()
			.filter((card) => card.status === this.status)
			.forEach((card) => {
				const view = App.cardManager.createCard(
					card.content,
					Number(card.creationDate),
					Number(card.completionDate),
					card.shortcuts,
					card.status
				);
				cardsContainer.append(view.element);
			});

		cardsContainer.dataset.status = this.status;
		cardTitle!.textContent = this.title;

		buttonAddCard.addEventListener('click', () => {
			if (listCardWidget && buttonAddCard && cardsContainer) {
				CardFormWidget.showCardFormWidget(
					listCardWidget,
					cardsContainer,
					buttonAddCard
				);
			}
		});
	}
}
