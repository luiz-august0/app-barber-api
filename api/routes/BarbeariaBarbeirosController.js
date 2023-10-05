const mysql = require('../config/mysql').pool;

class BarbeariaBarbeirosController {
	async postBarbeiro(req, res) {
		const { barbeariaID, usuarioID, especialidade } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`INSERT INTO barbearia_barbeiros SET Barb_Codigo = ${barbeariaID}, Usr_Codigo = ${usuarioID}, BarbB_Especialidade = "${especialidade}"`,
                    (error, result, fields) => { if (error) { console.log(error); return res.status(500).send({ error: error }) } } 
                )

                conn.query(
                    `INSERT INTO barbeiro_servicos 
                     SELECT ${usuarioID}, ${barbeariaID}, Serv_Codigo FROM servico S 
                     INNER JOIN servico_categorias SC
                     ON S.ServCat_Codigo = SC.ServCat_Codigo 
                     WHERE SC.Barb_Codigo = ${barbeariaID}`,
                     (error, result, fields) => { if (error) { console.log(error); return res.status(500).send({ error: error }) } } 
                )

                conn.release();
                return res.status(201).json();
            })
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }
    }

	async updateBarbeiro(req, res) {
		const { barbeariaID, usuarioID, especialidade } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`UPDATE barbearia_barbeiros SET BarbB_Especialidade = "${especialidade}"
					 WHERE Barb_Codigo = ${barbeariaID} AND Usr_Codigo = ${usuarioID}`,
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

	async deleteBarbeiro(req, res) {
		const { barbeariaID, usuarioID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Agdm_Barbeiro FROM agendamento WHERE Barb_Codigo = ${barbeariaID} AND Agdm_Barbeiro = ${usuarioID} AND Agdm_Data >= NOW() AND Agdm_Status NOT IN ('C', 'R', 'RL')`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `DELETE FROM agendamento WHERE Barb_Codigo = ${barbeariaID} AND Agdm_Barbeiro = ${usuarioID} AND Agdm_Data < NOW()`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                }
                            )

                            conn.query(
                                `DELETE FROM barbeiro_servicos WHERE Barb_Codigo = ${barbeariaID} AND Usr_Codigo = ${usuarioID}`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                }
                            )

                            conn.query(
                                `DELETE FROM barbearia_barbeiros WHERE Barb_Codigo = ${barbeariaID} AND Usr_Codigo = ${usuarioID}`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                }
                            )

                            return res.status(201).json(result);
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

	async getBarbeirosByBarbearia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT * FROM barbearia_barbeiros BB INNER JOIN usuario U ON BB.Usr_Codigo = U.Usr_Codigo
					 WHERE BB.Barb_Codigo = ${id}`,
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

	async getBarbeirosByUsuario(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT BB.Barb_Codigo, BB.Usr_Codigo FROM barbearia_barbeiros BB INNER JOIN usuario U ON BB.Usr_Codigo = U.Usr_Codigo
					 WHERE BB.Usr_Codigo = ${id}`,
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

	async getBarbeirosByServico(req, res) {
        const { id } = req.params;
        const { servicoID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT BB.Barb_Codigo, U.Usr_Codigo, U.Usr_Nome, BB.BarbB_Especialidade, U.Usr_Contato, U.Usr_FotoPerfil, AVG(BAV.Aval_Rate) AS Aval_Rate
                     FROM barbearia_barbeiros BB 
                     INNER JOIN usuario U ON BB.Usr_Codigo = U.Usr_Codigo
                     LEFT JOIN barbeiro_avaliacoes BAV ON BAV.UsrBarb_Codigo = U.Usr_Codigo
                     INNER JOIN barbeiro_servicos BS ON BS.Barb_Codigo = BB.Barb_Codigo AND BS.Usr_Codigo = U.Usr_Codigo 
					 WHERE BB.Barb_Codigo = ${id} AND BS.Serv_Codigo = ${servicoID}
                     GROUP BY U.Usr_Codigo`,
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

	async getBarbeariasByBarbeiro(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT * FROM barbearia_barbeiros BB INNER JOIN barbearia B ON BB.Barb_Codigo = B.Barb_Codigo
					 WHERE BB.Usr_Codigo = ${id}`,
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

    async getDataBarbeiro(req, res) {
        const { barbeariaID, usuarioID } = req.body;
        
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT U.Usr_Codigo, U.Usr_Email, U.Usr_Nome, U.Usr_Contato, U.Usr_CPF, U.Usr_Tipo, U.Usr_FotoPerfil, BB.BarbB_Especialidade, AVG(BAV.Aval_Rate) AS Aval_Rate 
                     FROM barbearia_barbeiros BB 
                     INNER JOIN usuario U ON BB.Usr_Codigo = U.Usr_Codigo
                     LEFT JOIN barbeiro_avaliacoes BAV ON BAV.UsrBarb_Codigo = U.Usr_Codigo
                     LEFT JOIN barbeiro_servicos BS ON BS.Barb_Codigo = BB.Barb_Codigo AND BS.Usr_Codigo = U.Usr_Codigo 
                     WHERE BB.Barb_Codigo = ${barbeariaID} AND U.Usr_Codigo = ${usuarioID}
                     GROUP BY U.Usr_Codigo`,
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

    async postServicoBarbeiro(req, res) {
        const { usuarioID, barbeariaID, servicoID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`INSERT INTO barbeiro_servicos VALUES(${usuarioID}, ${barbeariaID}, ${servicoID})`,
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

    async deleteServicoBarbeiro(req, res) {
        const { usuarioID, barbeariaID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`DELETE FROM barbeiro_servicos WHERE Usr_Codigo = ${usuarioID} AND Barb_Codigo = ${barbeariaID}`,
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

    async getServicosBarbeiro(req, res) {
        const { usuarioID, barbeariaID, categoriaID } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT SV.*, FORMAT(TIME_TO_SEC(SV.Serv_Duracao) / 60,0) AS Minutos,
                     IF(BSV.Usr_Codigo IS NULL, FALSE, TRUE) AS Vinculo
                     FROM servico SV 
                     LEFT JOIN barbeiro_servicos BSV
                     ON SV.Serv_Codigo = BSV.Serv_Codigo
                     AND BSV.Usr_Codigo = ${usuarioID}
                     AND BSV.Barb_Codigo = ${barbeariaID}
                     WHERE SV.ServCat_Codigo = ${categoriaID}`,
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

export default new BarbeariaBarbeirosController();