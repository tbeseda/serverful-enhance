import http from "node:http";
import path from "node:path";
import url from "node:url";
import { createRouter } from "@enhance/arc-plugin-enhance/src/http/any-catchall/index.mjs";
import contextShim from "./lib/context-shim.js";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const router = createRouter(`${here}/app`);
const server = http.createServer();

server.on("request", async function (request, response) {
	const { headers, method, url } = request;
	const contentType = headers["content-type"];
	console.log(`${method} ${contentType ? `[${contentType}]` : ""}: ${url}`);

	// TODO: use body-parser?
	let parsedBody = null;
	if (
		method === "POST" &&
		contentType === "application/x-www-form-urlencoded"
	) {
		let rawBody = "";
		request.on("data", (chunk) => {
			rawBody += chunk.toString();
		});
		request.on("end", () => {
			const bodyAsParams = new URLSearchParams(rawBody);
			const parsedBody = {};
			for (const [key, value] of bodyAsParams) {
				parsedBody[key] = value;
			}
			// console.log("parsedBody:", parsedBody);
		});
	}

	let accept = headers["accept"] || headers["Accept"] || [];
	if (!Array.isArray(accept)) {
		accept = accept.split(",");
	}

	if (accept.includes("text/html")) {
		const mappedRequest = {
			body: parsedBody, // ! doesn't work as expected
			headers: headers,
			// multiValueHeaders: undefined,
			httpMethod: method,
			// isBase64Encoded: false,
			path: url,
			rawPath: url,
			// pathParameters: null,
			// queryStringParameters: null,
			// multiValueQueryStringParameters: null,
			// stageVariables: null,
			// requestContext: undefined,
			// resource: "",
		};

		const enhanceReply = await router(mappedRequest, contextShim);
		// const replyType = enhanceReply.headers["content-type"];

		for (const headerName in enhanceReply.headers) {
			const headerValue = enhanceReply.headers[headerName];
			response.setHeader(headerName, headerValue.toString());
		}
		response.writeHead(enhanceReply.statusCode);
		response.write(enhanceReply.body);
	} else if (url?.startsWith("/_static")) {
		// serve static asset
	} else {
		response.writeHead(500);
	}

	response.end();
});

server.listen(8080, () => {
	console.log("Serverful Enhance running.");
});
