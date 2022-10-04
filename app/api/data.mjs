export async function get(_req) {
	return {
		json: {
			foo: ["bar", "baz"],
		},
	};
}
