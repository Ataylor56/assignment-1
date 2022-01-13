import { about_page } from '../viewpage/about_page.js';
import { home_page } from '../viewpage/home_page.js';

export const routePath = {
	HOME: '/' || '/home',
	ABOUT: '/about',
};

export const routes = [
	{ path: routePath.HOME, page: home_page },
	{ path: routePath.ABOUT, page: about_page },
];

export function routing(pathname, hash) {
	const route = routes.find((element) => element.path == pathname);
	if (route) route.page();
	else routes[0].page();
}
