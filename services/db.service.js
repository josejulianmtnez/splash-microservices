
const { Pool } = require("pg");
require("dotenv").config();

module.exports = {
	name: "db",

	settings: {
		// conexion DB general
		db1: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
		},
	},

	methods: {
		   // query DB general
		async queryDB1(sql, params) {
			try {
				const result = await this.poolDB1.query(sql,params);
				return result.rows;
			} catch (err) {
				this.logger.error("Error en DB1:", errmessage);
				throw new Error("Database 1 query failed");
			}
		},
	},

	// actions: {
	// 	queryDB1: {
	// 		timeout: 600000, // ⏱ 5 minutos
	// 		params: {
	// 			sql: "string",
	// 			params: { type: "array", optional: true },
	// 		},
	// 		async handler(ctx) {
	// 			const { sql, params } = ctx.params;
	// 			this.logger.info("Consulta en DB1:", sql);
	// 			return this.queryDB1(sql, params || []);
	// 		},
	// 	},
	// },
	
	actions: {
		queryDB1: {
			params: {
				sql: "string",
				params: { type: "array", optional: true },
			},
			async handler(ctx) {
				const { sql, params } = ctx.params;
				this.logger.info("Consulta en DB1:", sql);
				return this.queryDB1(sql, params || []);
			},
		},
	},


	async started() {
		this.poolDB1 = new Pool(this.settings.db1);
		this.logger.info("Conexión al pool de DB1 inicializada");
	},

	async stopped() {
		if (this.poolDB1) {
			await this.poolDB1.end();
			this.logger.info("Conexión al pool de DB1 cerrada");
		}
	},
};
