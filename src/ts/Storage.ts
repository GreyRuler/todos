import Shortcut from './card/Shortcut';
// eslint-disable-next-line import/no-cycle
import App from './App';
import Card from './card/Card';

export default class Storage {
	static storageKeyCards = 'cards';

	static storageKeyShortcuts = 'shortcuts';

	static load() {
		return JSON.parse(
			localStorage.getItem(Storage.storageKeyCards) ?? '[]'
		) as Card[];
	}

	static save() {
		localStorage.setItem(Storage.storageKeyCards, JSON.stringify(App.cardManager.cards));
	}

	static saveShortcut(color: string, title: string) {
		const storage: Shortcut[] = JSON.parse(
			localStorage.getItem(Storage.storageKeyShortcuts) ?? '[]'
		);
		storage.push({ color, title });
		localStorage.setItem(
			Storage.storageKeyShortcuts,
			JSON.stringify(storage)
		);
	}

	static loadShortcuts() {
		return JSON.parse(
			localStorage.getItem(Storage.storageKeyShortcuts) ?? '[]'
		) as Shortcut[];
	}
}
