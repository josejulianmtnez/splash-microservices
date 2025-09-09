const { get } = require("http");
const ApiGateway = require("moleculer-web");
const path = require("path");
const fs = require("fs").promises;
require("dotenv").config();

module.exports = {
	name: "web",
	mixins: [ApiGateway],

	settings: {
		port: process.env.WEB_PORT,
		timeout: 720000, // A nivel global
		assets: {
			folder: "./pages",
		},
		routes: [

			{
				path: "/models",
				use: [
					ApiGateway.serveStatic(path.join(__dirname, "../public/models"))
				]
			},
			{
				path: "/fotos_perfil",
				use: [
					ApiGateway.serveStatic(path.join(__dirname, "../fotos_perfil")),
				]
			},

			{
				path: "/",

				aliases: {
					"GET :view": "web.renderView",
					"POST permisos": "permisos.getPermisos",
					"POST recovery": "recovery.getRecovery",
				},
				mappingPolicy: "restrict",
			},
			{
				path: "/api",
				bodyParsers: {
					json: { limit: "20mb" },
					urlencoded: { extended: true, limit: "20mb" }
				},
				aliases: {
					/* ──────────── Auth ──────────── */
					"POST getToken": "authProxy.getAccessToken",
					"POST validate_token": "login.validateToken",
					/* ──────────── MONGO ──────────── */
					"POST mongodb/save": "mongodb.save",
					"POST mongodb/read": "mongodb.read",
					"GET mongodb/readById/:id": "mongodb.readById",
					"PUT mongodb/updateById/:id": "mongodb.updateById",
					"POST login/": "login.login", //servicio.metodo
				},
				mappingPolicy: "all",
				cors: true,
				onBeforeCall(ctx, route, req, res) {
					// Captura headers del request y pásalos a ctx.meta
					ctx.meta.headers = req.headers;
				}
			},
		],
	},
	
	methods: {
		async renderPage(ctx, viewFile) {
			try {
				// Vistas sin header ni footer
				const noHeaderFooterPages = [
					"index.html",
					"login.html",
				];

				if (noHeaderFooterPages.includes(viewFile)) {
					const content = await fs.readFile(
						path.join(__dirname, "../pages", viewFile),
						"utf8"
					);
					ctx.meta.$responseType = "text/html";
					return content;
				}

				// Vistas con header y footer
				const header = await fs.readFile(
					path.join(__dirname, "../pages/utils/header.html"),
					"utf8"
				);

				const menu = await fs.readFile(
					path.join(__dirname, "../pages/utils/menu.html"),
					"utf8"
				);

				const footer = await fs.readFile(
					path.join(__dirname, "../pages/utils/footer.html"),
					"utf8"
				);
				const content = await fs.readFile(
					path.join(__dirname, "../pages", viewFile),
					"utf8"
				);

				const html = header + menu + content + footer;
				ctx.meta.$responseType = "text/html";
				return html;
			} catch (error) {
				console.error("Error al renderizar la página:", error.message);
				ctx.meta.$responseType = "text/plain";
				ctx.meta.$statusCode = 404;
				return `Página no encontrada: ${viewFile}`;
			}
		},
	},

	actions: {
		async renderView(ctx) {
			const viewFile = `${ctx.params.view}.html`;
			return this.renderPage(ctx, viewFile);
		},
	},
};
