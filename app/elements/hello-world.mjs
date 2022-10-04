export default function HelloWorld({ html, state }) {
	const { attrs } = state;
	const { greeting = "Hello, World" } = attrs;
	return html`
		<h3>${greeting}</h3>
	`;
}
