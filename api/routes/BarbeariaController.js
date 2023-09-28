const mysql = require('../config/mysql').pool;

class BarbeariaController {
    async getBarbeariasUsuario(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT B.* FROM barbearia B ` + 
                    `INNER JOIN barbearia_proprietarios BP ` + 
                    `ON B.Barb_Codigo = BP.Barb_Codigo ` + 
                    `WHERE BP.Usr_Codigo = ${id} ` + 
                    `GROUP BY B.Barb_Codigo`,
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

    async getDadosBarbearia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_Codigo = ${id}`,
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

    async getBarbearias (req, res) {
        try {
            const { nome, cidade, endRua, endNumero, endBairro, usuarioID } = req.body;

            let SQL = `SELECT B.*, AVG(BA.Aval_Rate) AS Aval_Rate FROM barbearia B 
                       LEFT JOIN barbearia_avaliacoes BA
                       ON B.Barb_Codigo = BA.Barb_Codigo
                       LEFT JOIN agendamento AG
                       ON B.Barb_Codigo = AG.Barb_Codigo
                       AND AG.Usr_Codigo = ${usuarioID}
                       WHERE 1 > 0 
                       AND AG.Barb_Codigo IS NULL `;

            if ((nome !== null) && (nome !== '')) {
                SQL = SQL + `AND B.Barb_Nome LIKE "%${nome}%" `;
            }
            if ((cidade !== null) && (cidade !== '')) {
                SQL = SQL + `AND B.Barb_Cidade LIKE "%${cidade}%" `;
            }
            if ((endRua !== null) && (endRua !== '')) {
                SQL = SQL + `AND B.Barb_Rua LIKE "%${endRua}%" `;
            }
            if ((endNumero !== null) && (endNumero !== '')) {
                SQL = SQL + `AND B.Barb_Numero LIKE "%${endNumero}%" `;
            }
            if ((endBairro !== null) && (endBairro !== '')) {
                SQL = SQL + `AND B.Barb_Bairro LIKE "%${endBairro}%" `;
            }

            SQL = SQL + ` GROUP BY B.Barb_Codigo`;

            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async getBarbeariasVisitadas (req, res) {
        try {
            const { id } = req.params;

            let SQL = `SELECT B.*, AVG(BA.Aval_Rate) AS Aval_Rate FROM barbearia B
                       INNER JOIN agendamento AG
                       ON B.Barb_Codigo = AG.Barb_Codigo
                       LEFT JOIN barbearia_avaliacoes BA
                       ON B.Barb_Codigo = BA.Barb_Codigo
                       WHERE AG.Usr_Codigo = ${id}
                       GROUP BY B.Barb_Codigo `;

            mysql.getConnection((error, conn) => {
                conn.query(
                    SQL,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        return res.status(201).json(result);
                    }
                )
                conn.release();
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async postBarbearia(req, res) {
        const { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude } = req.body;

        let ie = inscEstadual;

        let SQL = `INSERT INTO barbearia ` + 
                  `SET Barb_Nome = "${nome}", ` + 
                  `Barb_RazaoSocial = "${razao}", ` + 
                  `Barb_CNPJ = "${cnpj}", ` + 
                  `Barb_Cidade = "${cidade}", ` + 
                  `Barb_CEP = "${cep}", ` + 
                  `Barb_UF = "${uf}", ` + 
                  `Barb_Rua = "${rua}", ` + 
                  `Barb_Numero = ${numero}, ` + 
                  `Barb_Bairro = "${bairro}" `;

        if ((inscEstadual === null) || (inscEstadual === '')) {
            ie = "ISENTO";
        } 

        SQL = SQL + `, Barb_InscEst = "${ie}" `;

        if ((complemento !== null) && (complemento !== '')) {
            SQL = SQL + `, Barb_Complemento = "${complemento}" `;
        }

        if ((latitude !== null) && (latitude !== '')) {
            SQL = SQL + `, Barb_GeoLatitude = ${latitude} `;
        }

        if ((longitude !== null) && (longitude !== '')) {
            SQL = SQL + `, Barb_GeoLongitude = ${longitude} `;
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_CNPJ = "${cnpj}" AND Barb_InscEst = "${ie}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) != '[]') {
                            return res.status(401).json();
                        } else {
                            conn.query(
                                SQL,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }


    async updateBarbearia(req, res) {
        const { nome, razao, cnpj, inscEstadual, cidade, cep, uf, rua, numero, bairro, complemento, latitude, longitude } = req.body;
        const { id } = req.params;

        let ie = inscEstadual;

        let SQL = `UPDATE barbearia ` + 
                  `SET Barb_Nome = "${nome}", ` + 
                  `Barb_RazaoSocial = "${razao}", ` + 
                  `Barb_CNPJ = "${cnpj}", ` +  
                  `Barb_Cidade = "${cidade}", ` + 
                  `Barb_CEP = "${cep}", ` + 
                  `Barb_UF = "${uf}", ` +
                  `Barb_Rua = "${rua}", ` + 
                  `Barb_Numero = ${numero}, ` + 
                  `Barb_Bairro = "${bairro}" `;

        if ((inscEstadual === null) || (inscEstadual === '')) {
            ie = "ISENTO";
        } 

        SQL = SQL + `, Barb_InscEst = "${ie}" `;

        if ((complemento !== null) && (complemento !== '')) {
            SQL = SQL + `, Barb_Complemento = "${complemento}" `;
        }

        if ((latitude !== null) && (latitude !== '')) {
            SQL = SQL + `, Barb_GeoLatitude = ${latitude} `;
        }

        if ((longitude !== null) && (longitude !== '')) {
            SQL = SQL + `, Barb_GeoLongitude = ${longitude} `;
        }

        SQL = SQL + ` WHERE Barb_Codigo = ${id}`;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia WHERE Barb_CNPJ = "${cnpj}" AND Barb_InscEst = "${ie}" AND Barb_Codigo <> ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) != '[]') {
                            return res.status(401).json();
                        } else {
                            conn.query(
                                SQL,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async deleteBarbearia(req, res) {
		const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Agdm_Codigo FROM agendamento WHERE Barb_Codigo = ${id} AND Agdm_Data >= NOW() AND Agdm_Status NOT IN ('C', 'R', 'RL')`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            conn.query(
                                `DELETE FROM barbearia WHERE Barb_Codigo = ${id}`,
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

    async getBarbeariaContatos(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia_contatos WHERE Barb_Codigo = ${id}`,
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

    async postBarbeariaContatos(req, res) {
        const { descricao, contato } = req.body;
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO barbearia_contatos VALUES(${id}, "${descricao}", "${contato}")`,
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

    async deleteBarbeariaContatos(req, res) {
        const { contato } = req.body;
        const { id } = req.params;

        let SQL = `DELETE FROM barbearia_contatos WHERE Barb_Codigo = ${id}`;

        if ((contato !== null) && (contato !== '')) {
            SQL = SQL + ` AND BarbC_Contato = "${contato}" `;
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

    async getBarbeariaProprietarios(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT U.Usr_Codigo, U.Usr_Email, U.Usr_Nome,
                     U.Usr_Contato, U.Usr_CPF
                     FROM barbearia_proprietarios BP
                     INNER JOIN usuario U
                     ON BP.Usr_Codigo = U.Usr_Codigo 
                     WHERE BP.Barb_Codigo = ${id}`,
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

    async postBarbeariaProprietarios(req, res) {
        const { proprietarioCod } = req.body;
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `INSERT INTO barbearia_proprietarios VALUES(${id}, ${proprietarioCod})`,
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

    async deleteBarbeariaProprietarios(req, res) {
        const { proprietarioCod } = req.body;
        const { id } = req.params;

        let SQL = `DELETE FROM barbearia_proprietarios WHERE Barb_Codigo = ${id}`;

        if ((proprietarioCod !== null) && (proprietarioCod !== '')) {
            SQL = SQL + ` AND Usr_Codigo = ${proprietarioCod} `;
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

    async updateLogoBarbearia(id, filename) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE barbearia SET Barb_LogoUrl = "${filename}" WHERE Barb_Codigo = "${id}"`,
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
        }
    }

}

export default new BarbeariaController();