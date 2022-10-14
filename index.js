import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { createRouter } from "@enhance/arc-plugin-enhance/src/http/any-catchall/index.mjs";
import busboy from "busboy";
import contextShim from "./lib/context-shim.js";
import MIME_TYPES from "./lib/mime-types.js";

const here = process.cwd();
const router = createRouter(`${here}/app`);
const server = http.createServer();

server.on("request", async function (request, response) {
	const { headers, method, url } = request;
	const contentType = headers["content-type"];
	let streaming = false;

	let parsedBody = null;
	let body = null;
	if (
		method === "POST" &&
		contentType === "application/x-www-form-urlencoded"
	) {
		const bb = busboy({ headers });

		parsedBody = {};
		bb.on("field", (name, value) => {
			parsedBody[name] = value;
		});
		bb.on("file", () => {
			console.log("File upload currently unsupported");
		});

		request.pipe(bb);
	}

	let accept = headers["accept"] || headers["Accept"] || [];
	if (!Array.isArray(accept)) {
		accept = accept.split(",");
	}

	if (accept.includes("text/html")) {
		console.log(`${method}: ${url}`);

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
	} else if (url?.startsWith("/_public/")) {
		const filePath = path.join(here, "public", url.replace("/_public/", ""));
		const exists = await fs.promises.access(filePath, fs.constants.R_OK).then(
			() => true,
			() => false,
		);

		if (exists) {
			const extension = path.extname(filePath).substring(1).toLowerCase();
			const fileStream = fs.createReadStream(filePath);

			response.writeHead(200, {
				"Content-Type": MIME_TYPES[extension] || MIME_TYPES.default,
			});

			streaming = true;
			fileStream.pipe(response);
		} else {
			response.writeHead(404);
		}
	} else {
		response.writeHead(500);
	}

	if (!streaming) {
		response.end();
	}
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Serverful Enhance running: http://localhost:${PORT}`);
});
