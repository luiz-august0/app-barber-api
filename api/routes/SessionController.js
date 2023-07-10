import jwt from "jsonwebtoken";
import { checkPassword } from "../services/auth";
import authConfig from "../config/auth";
const mysql = require('../config/mysql').pool;

class SessionController {
    async create(req, res) {
        try {
            const { email, senha } = req.body;

            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM usuario WHERE Usr_Email = "${email}"`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        
                        if (JSON.stringify(result) === '[]') {
                            return res.status(401).json({ error: "Usuário ou senha inválidos" });
                        }

                        const usuarioSenha = JSON.stringify(result[0].Usr_Senha).slice(0, -1).slice(1 | 1);
                        const tipo = JSON.stringify(result[0].Usr_Tipo).slice(0, -1).slice(1 | 1);
                        const nome = JSON.stringify(result[0].Usr_Nome).slice(0, -1).slice(1 | 1);
                        const urlImagem = JSON.stringify(result[0].Usr_FotoPerfil).slice(0, -1).slice(1 | 1);
                        const contato = JSON.stringify(result[0].Usr_Contato).slice(0, -1).slice(1 | 1);
                        const cpf = JSON.stringify(result[0].Usr_CPF).slice(0, -1).slice(1 | 1);

                        if (!checkPassword(senha, usuarioSenha)) {
                            return res.status(401).json({ error: "Usuário ou senha inválidos." });
                        }

                        const id = JSON.stringify(result[0].Usr_Codigo);

                        return res.json({
                            usuario: {
                                id,
                                email,
                                nome,
                                contato,
                                cpf,
                                tipo,
                                urlImagem
                            },
                            token: jwt.sign({ id }, authConfig.secret, {
                                expiresIn: authConfig.expiresIn
                            })
                        });
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

export default new SessionController();