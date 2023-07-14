const mysql = require('../config/mysql').pool;

class BarbeariaServicosController {
    async getBarbeariaCategorias(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico_categorias WHERE Barb_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async showBarbeariaCategoria(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico_categorias WHERE ServCat_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async postBarbeariaCategoria(req, res) {
        const { idBarbearia, nome } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico_categorias WHERE ServCat_Nome = "${nome}" AND Barb_Codigo = ${idBarbearia}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `INSERT INTO servico_categorias SET Barb_Codigo = ${idBarbearia}, ServCat_Nome = "${nome}"`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        } else {
                            return res.status(401).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async updateBarbeariaCategoria(req, res) {
        const { id } = req.params;
        const { idBarbearia, nome } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico_categorias WHERE ServCat_Nome = "${nome}" 
                    AND ServCat_Codigo <> ${id} 
                    AND Barb_Codigo = ${idBarbearia}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        
                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `UPDATE servico_categorias SET ServCat_Nome = "${nome}" WHERE ServCat_Codigo = ${id}`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        } else {
                            return res.status(401).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async deleteBarbeariaCategoria(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico WHERE ServCat_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        
                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `DELETE FROM servico_categorias WHERE ServCat_Codigo = ${id}`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        } else {
                            return res.status(401).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async getBarbeariaCategoriaServicos(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT *, FORMAT(TIME_TO_SEC(Serv_Duracao) / 60,0) AS Minutos FROM servico WHERE ServCat_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async showBarbeariaServico(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT *, FORMAT(TIME_TO_SEC(Serv_Duracao) / 60,0) AS Minutos FROM servico WHERE Serv_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async postBarbeariaServico(req, res) {
        const { nome, idCategoria, valor, duracao } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO servico SET Serv_Nome = "${nome}", ServCat_Codigo = ${idCategoria}, 
                    Serv_Valor = ${valor}, Serv_Duracao = "${duracao}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async updateBarbeariaServico(req, res) {
        const { id } = req.params;
        const { nome, valor, duracao } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE servico SET Serv_Nome = "${nome}", Serv_Valor = ${valor}, Serv_Duracao = "${duracao}"
                    WHERE Serv_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async deleteBarbeariaServico(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Serv_Codigo FROM agendamento WHERE Serv_Codigo = ${id} AND Agdm_Data >= NOW()`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `DELETE FROM agendamento WHERE Serv_Codigo = ${id} AND Agdm_Data < NOW()`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    conn.query(
                                        `DELETE FROM servico_imagens WHERE Serv_Codigo = ${id}`,
                                        (error, result, fields) => {if (error) { console.log(error); return res.status(500).send({ error: error }) }}
                                    )
                                    conn.query(
                                        `DELETE FROM barbeiro_servicos WHERE Serv_Codigo = ${id}`,
                                        (error, result, fields) => {if (error) { console.log(error); return res.status(500).send({ error: error }) }}
                                    )
                                    conn.query(
                                        `DELETE FROM servico WHERE Serv_Codigo = ${id}`,
                                        (error, result, fields) => {
                                            if (error) { console.log(error); return res.status(500).send({ error: error }) } 
                                            return res.status(201).json(result);
                                        }
                                    )
                                }
                            )
                        } else {
                            return res.status(401).json();
                        }
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async getImagensServico(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM servico_imagens WHERE Serv_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

    async postImagemServico(id, filename) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO servico_imagens SET Serv_Codigo = ${id}, Img_Url = "${filename}"`,
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
        }
    }

    async deleteImagemServico(req, res) {
        const { id } = req.params;
        const { imgUrl } = req.body;

        let SQL = `DELETE FROM servico_imagens WHERE Serv_Codigo = ${id}`;

        if (imgUrl !== '' && imgUrl !== null) {
            SQL = SQL + ` AND Img_Url = "${imgUrl}"`;
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }
}

export default new BarbeariaServicosController();