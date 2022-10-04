export async function get(_req) {
	return {
		json: {
			pageTitle: "The Home Page",
		},
	};
}

export async function post(req) {
	console.log("index API req:", req);

	return {
		location: "/",
	};
}
