// server.js
import "dotenv/config";
import express from "express";
import { readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const app = express();
const PORT = process.env.PORT ?? 3000;
const ENV = process.env.NODE_ENV ?? "development";
const FILE = join(import.meta.dirname, "links.json");

app.use(express.json());
app.use(express.static(join(import.meta.dirname, "public")));

class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

const fileExists = async (path) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

const readLinks = async () =>
	(await fileExists(FILE)) ? JSON.parse(await readFile(FILE, "utf-8")) : [];

const writeLinks = async (links) =>
	writeFile(FILE, JSON.stringify(links, null, 2), "utf-8");

app.get("/api/links", async (req, res, next) => {
	try {
		const links = await readLinks();
		res.json(links);
	} catch (err) {
		next(err);
	}
});

app.post("/api/links", async (req, res, next) => {
	try {
		const { title, url, category } = req.body;
		if (!title || !url) {
			throw new AppError("title och url krävs.", 400);
		}
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			throw new AppError("url måste börja med http:// eller https://.", 400);
		}
		const links = await readLinks();
		const id = links.length > 0 ? links[links.length - 1].id + 1 : 1;
		const link = {
			id,
			title,
			url,
			category: category ?? "Övrigt",
			created: new Date().toISOString(),
		};
		await writeLinks([...links, link]);
		res.status(201).json(link);
	} catch (err) {
		next(err);
	}
});

app.delete("/api/links/:id", async (req, res, next) => {
	try {
		const links = await readLinks();
		const index = links.findIndex((l) => l.id === Number(req.params.id));
		if (index === -1) throw new AppError("Länken hittades inte.", 404);
		const [deleted] = links.splice(index, 1);
		await writeLinks(links);
		res.json(deleted);
	} catch (err) {
		next(err);
	}
});

app.use((req, res) => {
	res.status(404).json({ error: "Sidan hittades inte." });
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode ?? 500;
	const message = err.statusCode
		? err.message
		: ENV === "development"
			? err.message
			: "Internt serverfel.";
	if (!err.statusCode) console.error(err);
	res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
	console.log(`🛵🪿 Server körs på http://localhost:${PORT} i ${ENV}-läge`);
});
