import Storage from './Storage';
import App from './App';

export default class CardFormWidget {
	static get markup() {
		return `
		<div id="cardFormWidget" class="mt-auto order-5">
			<textarea cols="30" rows="3" class="form-control mb-2"
					  id="input-field"
					  placeholder="Введите текст для этой задачи..."></textarea>
			<input class="form-control mb-2" type="date" name="dateExpiry" id="dateExpiry">
			<div class="d-flex">
				<button class="btn btn-success me-3 col"
						id="add-card-to-widget" type="button">
						<div class="svg-icon svg-add-icon filter-white"></div>
				</button>
				<button id="button-close-cardFormWidget"
				 	 class="btn btn-danger col">
				 	 <div class="svg-icon svg-cancel-icon filter-white"></div>
				</button>
			</div>
		</div>`;
	}

	static get selectorButtonAddCardToWidget() {
		return '#add-card-to-widget';
	}

	static get selectorCardFormWidget() {
		return '#cardFormWidget';
	}

	static get selectorButtonCloseCardFormWidget() {
		return '#button-close-cardFormWidget';
	}

	static get selectorInputField() {
		return '#input-field';
	}

	static get selectorInputDateExpiry() {
		return '#dateExpiry';
	}

	static showCardFormWidget(
		listCardWidget: HTMLElement,
		cards: HTMLElement,
		buttonAddCard: HTMLButtonElement
	) {
		buttonAddCard.classList.add('d-none');

		listCardWidget.insertAdjacentHTML(
			'beforeend',
			CardFormWidget.markup
		);

		const buttonAddCardToWidget = listCardWidget.querySelector(
			CardFormWidget.selectorButtonAddCardToWidget
		);
		const buttonCloseCardToWidget = listCardWidget.querySelector(
			CardFormWidget.selectorButtonCloseCardFormWidget
		);
		const inputField = listCardWidget.querySelector(
			CardFormWidget.selectorInputField
		) as HTMLTextAreaElement;
		const inputDateExpiry = listCardWidget.querySelector(
			CardFormWidget.selectorInputDateExpiry
		) as HTMLInputElement;

		inputField.focus();

		buttonAddCardToWidget?.addEventListener(
			'click',
			this.cardEvent.call(
				this,
				listCardWidget,
				buttonAddCard,
				cards,
				inputField,
				inputDateExpiry
			)
		);

		buttonCloseCardToWidget
			?.addEventListener('click', (e) => {
				e.preventDefault();
				this.removeCardFormWidget(listCardWidget, buttonAddCard);
			});
	}

	static removeCardFormWidget(
		listCardWidget: HTMLElement,
		buttonAddCard: HTMLButtonElement
	) {
		buttonAddCard.classList.remove('d-none');

		const cardFormWidget = listCardWidget.querySelector(
			CardFormWidget.selectorCardFormWidget
		);

		cardFormWidget?.remove();
	}

	static cardEvent(
		listCardWidget: HTMLElement,
		buttonAddCard: HTMLButtonElement,
		cards: HTMLElement,
		inputField: HTMLTextAreaElement,
		inputDateExpiry: HTMLInputElement
	) {
		return () => {
			if (inputField.value) {
				this.removeCardFormWidget(listCardWidget, buttonAddCard);
				const dateExpiry = inputDateExpiry.value
					? Date.parse(inputDateExpiry.value) : null;

				const view = App.cardManager.createCard(
					inputField.value,
					Date.now(),
					dateExpiry,
					[],
					'0'
				);

				cards.append(view.element);
				Storage.save();
				inputField.value = '';
			}
		};
	}
}
