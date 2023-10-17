import RouterType from './RouterType';
import CardView from './CardView';

export default class Router {
	private routes: RouterType[];

	constructor(routes: RouterType[]) {
		this.routes = routes;
	}

	navigate(routeName: string) {
		const route = this.routes.find((r) => r.name === routeName);
		if (route) {
			const view = new CardView(route.card);
			view.render();
		}
	}
}
