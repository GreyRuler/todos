import Shortcut from './Shortcut';

export default class Card {
	private massCurrentRed = 218;

	public content: string;

	public creationDate: number;

	public completionDate: number | null;

	public state: number;

	public shortcuts: Shortcut[];

	public status: string;

	constructor(
		content: string,
		creationDate: number,
		completionDate: number | null,
		shortcuts: Shortcut[],
		status: string
	) {
		this.content = content;
		this.creationDate = creationDate;
		this.completionDate = completionDate;
		this.shortcuts = shortcuts;
		this.status = status;
		this.state = 1;
	}

	setState(newState: number) {
		this.state = newState;
	}

	edit(content: string, completionDate: number | null) {
		this.content = content;
		this.completionDate = completionDate;
	}

	addShortcut(shortcut: Shortcut) {
		this.shortcuts.push(shortcut);
	}

	removeShortcut(shortcut: Shortcut) {
		this.shortcuts = this.shortcuts.filter(
			(s) => s.color !== shortcut.color || s.title !== shortcut.title
		);
	}

	// onChangeColor(dateStart: number, dateEnd: number) {
	// 	console.log(dateStart, dateEnd);
	// 	const dateDuration = durationDate(dateStart, dateEnd);
	// 	console.log(dateDuration);
	// 	const massRed = definitionColorRed(this.massCurrentRed, dateDuration, 1);
	// 	this.cardHeader.style.backgroundColor = `rgb(243, ${massRed}, 11)`;
	// }
}
