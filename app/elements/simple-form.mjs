export default function SimpleForm({ html }) {
	return html`
		<form action="/" method="POST">
			<input type="text" name="foo" />
			<button type="submit">POST</button>
		</form>
	`;
}
