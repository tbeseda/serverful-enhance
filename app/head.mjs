export default function Head(state) {
	const {
		// error,
		req,
		// status,
		store,
	} = state;
	const { path } = req;
	const title = store.pageTitle || `My app — ${path}`;

	return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>${title}</title>
			<link rel="stylesheet" href="/_static/styles.css">
			<link rel="icon" href="https://fav.farm/🐈‍⬛" />
			<style>
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
				html {
					max-width: 70ch;
					padding: 3em 1em;
					margin: auto;
					line-height: 1.75;
					font-size: 1.25em;
					font-family: -apple-system, BlinkMacSystemFont, sans-serif;
				}
			</style>
		</head>
	`;
}
