import Queue from '../lib/Queue';
import { checkPassword, createPasswordHash } from '../services/auth';

const mysql = require('../config/mysql').pool;

class UsuarioController {
    async index(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario`,
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

    async show (req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * from usuario WHERE Usr_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (!result) {
                            return res.status(404).json();
                        }
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

    async verify(req, res) {
        try {
            const { email, cpf } = req.body;
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                    
                        if (JSON.stringify(result) != '[]') {
                            return res.status(400).json('Email ja cadastrado');
                        } else {
                            conn.query(
                                `SELECT * FROM usuario WHERE Usr_CPF = "${cpf}"`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                    if (JSON.stringify(result) != '[]') {
                                        return res.status(406).json('CPF ja cadastrado');
                                    } else {
                                        return res.status(201).json(result)    
                                    }
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


    async create(req, res) {
        try {
            const { email, nome, senha, contato, cpf, tipo } = req.body;

            const encryptedPassword = await createPasswordHash(senha);
            
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                    
                        if (JSON.stringify(result) != '[]') {
                            return res.status(400).json('Email ja cadastrado');
                        } else {
                            conn.query(
                                `SELECT * FROM usuario WHERE Usr_CPF = "${cpf}"`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                    if (JSON.stringify(result) != '[]') {
                                        return res.status(406).json('CPF ja cadastrado');
                                    } else {
                                        conn.query(
                                            `INSERT INTO usuario (Usr_Email, Usr_Nome, Usr_Senha, Usr_Contato, Usr_CPF, Usr_Tipo) VALUES ` + 
                                            `("${email}", "${nome}", "${encryptedPassword}", ${contato != ''?`"${contato}"`:'NULL'}, ${cpf != ''?`"${cpf}"`:'NULL'}, "${tipo}")`,
                                            (error, result, fields) => {
                                                if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                                return res.status(201).json(result);
                                            }
                                        )
                                    }
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

    async update(req, res) {
        try {
            const { id } = req.params;
            const { email, nome, contato, cpf } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        }
                        else {
                            conn.query(
                                `SELECT Usr_Email FROM usuario WHERE Usr_Codigo <> ${id} AND Usr_Email = "${email}"`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                    if (JSON.stringify(result) != '[]') {
                                        return res.status(400).json('Email ja cadastrado');
                                    } else {
                                        conn.query(
                                            `SELECT * FROM usuario WHERE Usr_CPF = "${cpf}" AND Usr_Codigo <> ${id}`,
                                            (error, result, fields) => {
                                                if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                                if (JSON.stringify(result) != '[]') {
                                                    return res.status(406).json('CPF ja cadastrado');
                                                } else {
                                                    conn.query(
                                                        `UPDATE usuario SET Usr_Email = "${email}", Usr_Nome = "${nome}", ` + 
                                                        `Usr_Contato = ${contato != ''?`"${contato}"`:'NULL'}, Usr_CPF = ${cpf != ''?`"${cpf}"`:'NULL'} ` + 
                                                        `WHERE Usr_Codigo = ${id}`,
                                                        (error, result, fields) => {
                                                            if (error) { console.log(error); return res.status(500).send({ error: error }) };
            
                                                            return res.status(201).json(result);
                                                        }
                                                    )
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
                conn.release();
            });
            
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { senhaAntiga, senhaNova } = req.body;

            const encryptedPassword = await createPasswordHash(senhaNova);

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        } else {
                            const usuarioSenha = JSON.stringify(result[0].Usr_Senha).slice(0, -1).slice(1 | 1);

                            if (!checkPassword(senhaAntiga, usuarioSenha)) {
                                return res.status(401).json({ error: "Senha inválida." });
                            } else {
                                conn.query(
                                    `UPDATE usuario SET Usr_Senha = "${encryptedPassword}" WHERE Usr_Codigo = ${id}`,
                                    (error, result, fields) => {
                                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                        return res.status(201).json(result);
                                    }
                                )
                            }
                        }
                    }
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async updateFotoPerfil(id, filename) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE usuario SET Usr_FotoPerfil = "${filename}" WHERE Usr_Codigo = "${id}"`,
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Codigo = "${id}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json('Usuário não encontrado');
                        } else {
                            conn.query(
                                `DELETE FROM usuario WHERE Usr_Codigo = "${id}"`,
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

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async getDataUsuarioBarbeiroWithEmail(req, res) {
        try {
            const { email } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}" AND Usr_Tipo = "B"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            return res.status(201).json(result);
                        }
                    }
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async postEnviaEmailRecuperacaoSenha(req, res) {
        try {
            const { email } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT *, MD5(Usr_Senha) AS Email FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            const email = JSON.stringify(result[0].Usr_Email).slice(0, -1).slice(1 | 1);
                            const key = JSON.stringify(result[0].Email).slice(0, -1).slice(1 | 1);
                            const link = `https://app-barber-web-zeta.vercel.app/${key}`;

                            const data = {
                                email,
                                link,
                                tipo: 'RECUPERACAO'
                            };

                            const send = async() => {
                                await Queue.add('SenderMail', data);
                            }
                            send();

                            return res.status(201).json();
                        }
                    }
                )
                conn.release();
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }

    async postRecuperacaoSenha(req, res) {
        try {
            const { key, senha } = req.body;

            const encryptedPassword = await createPasswordHash(senha);

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE MD5(Usr_Senha) = "${key}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        if (JSON.stringify(result) === '[]') {
                            return res.status(404).json();
                        } else {
                            const id = JSON.stringify(result[0].Usr_Codigo);
                            conn.query(
                                `UPDATE usuario SET Usr_Senha = "${encryptedPassword}" WHERE Usr_Codigo = ${id}`,
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

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." });
        }
    }
    
}

export default new UsuarioController();