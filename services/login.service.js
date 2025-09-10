module.exports = {
    name: "login",

    actions: {
        login: {
            rest: {
                method: "POST",
                path: "/login",
            },
            async handler(ctx) {
                //Enviados desde el fetch
                const { username, password } = ctx.params;
                try {
                    const data = await this.broker.call("db.queryDB1", {
                        sql: "SELECT * FROM users WHERE username = $1 AND password = $2",
                        params: [username, password],
                    })
                    return data;
                } catch (error) {
                    this.logger.error("Error en login:", error.message);
                    throw new Error(error);
                }
            },
        },
    },
};
