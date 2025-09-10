const { actions } = require("./db.service");

module.exports = {
    name: "users",

    actions: {
        get_users: {
            rest: {
                method: "GET",
                path: "/obtener_usuarios",
            },
            async handler(ctx) {
                try {
                    const data = await this.broker.call("db.queryDB1", {
                        sql: "SELECT * FROM users",
                    });
                    return data;
                } catch (error) {
                    this.logger.error("Error en obtener_usuarios:", error.message);
                    throw new Error(error);
                }
            },
        },
    },
}
