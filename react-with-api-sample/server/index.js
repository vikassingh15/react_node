import path from "path";
import express from "express";
import bodyParser from "body-parser";
import httpProxy from "http-proxy";
import open from "open";

import bundle from "./bundler";

import { parse } from "accounting";

const app = express();
const proxy = httpProxy.createProxyServer();

// setup the webpack proxy

app.use(express.static(path.join(__dirname, "../public")));

bundle();

app.all("/bundle/*", (req, res) => {
	proxy.web(req, res, {
		target: "http://localhost:3000"
	});
});

// setup the API

let items = [
	{
		id: 0,
		item: "Homer Simpson's Right Toenail",
		price: 0.47
	},
	{
		id: 1,
		item: "Avatar (the movie)",
		price: 237000000
	},
	{
		id: 2,
		item: "Arc Reactor",
		price: 42
	}
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/items", (req, res) => {
	return res.json(items);
});

app.post("/items", (req, res) => {
	let item = {
		...req.body,
		price: parse(req.body.price)
	};

	if (!item || !item.item || !item.price) {
		res.status(400);
		return res.json({
			message:
				'Item & price are both required. Price must be a parsable US currency or a decimal. Example: { "item": "thing 1", "price": 500 }'
		});
	}

	items.push(item);
	return res.json(items);
});

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on("error", () => {
	console.log("Could not connect to proxy, please try again...");
});

app.listen(1337, () => {
	console.log("App listening at localhost:1337");
	open("http://localhost:1337/");
});
