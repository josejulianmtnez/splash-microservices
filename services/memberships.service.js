module.exports = {
    name: "memberships",

    actions: {
        get_memberships: {
            rest: {
                method: "GET",
                path: "/obtener_membresias",
            },
            async handler(ctx) {
                try {
                    const data = await this.broker.call("db.queryDB1", {
                        sql: "SELECT * FROM memberships INNER JOIN users ON memberships.user_id = users.id",
                    });
                    return data;
                } catch (error) {
                    this.logger.error("Error en obtener_membresias:", error.message);
                    throw new Error(error);
                }
            },
        },

        store_membership: {
            rest: {
                method: "POST",
                path: "/agregar_membresia",
            },
            async handler(ctx) {
                const { customer, acquiredClasses } = ctx.params;
                try {
                    const data = await this.broker.call("db.queryDB1", {
                        sql: "INSERT INTO memberships (user_id, acquired_classes) VALUES ($1, $2) RETURNING *",
                        params: [customer, acquiredClasses],
                    });
                    return data;
                } catch (error) {
                    this.logger.error("Error en agregar_membresia:", error.message);
                    throw new Error(error);
                }
            },
        },
    },
};
