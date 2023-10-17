import CardManager from './card/CardManager';
import CardsIssueWidget from './card/CardsIssueWidget';
import CardsProcessWidget from './card/CardsProcessWidget';
import CardsCompletionWidget from './card/CardsCompletionWidget';

export default class App {
	public static cardManager = new CardManager();

	static init() {
		const issue = document.querySelector('#issue') as HTMLElement;
		const process = document.querySelector('#process') as HTMLElement;
		const completion = document.querySelector('#completion') as HTMLElement;

		const issueWidget = new CardsIssueWidget(issue, 'Выданная задача');
		const processWidget = new CardsProcessWidget(process, 'В процессе');
		const completionWidget = new CardsCompletionWidget(completion, 'Выполнено');

		issueWidget.bindToDOM();
		processWidget.bindToDOM();
		completionWidget.bindToDOM();
	}
}
