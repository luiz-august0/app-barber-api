import { DateToWeekday } from '../formatters';

const mysql = require('../config/mysql').pool;

class BarbeariaAgendamentoController {
	async getHorariosDisponiveisBarbeiro(req, res) {
		const { barbeariaID, barbeiroID, data, tempServ } = req.body;
		let weekDay = DateToWeekday(data);

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT Horario FROM horarios
					 WHERE Horario NOT IN (
					 SELECT H.Horario FROM horarios H, agendamento A
					 WHERE H.Horario >= DATE_SUB(A.Agdm_HoraInicio, INTERVAL ${tempServ} - 15 MINUTE)
					 AND H.Horario < A.Agdm_HoraFim
					 AND A.Barb_Codigo = ${barbeariaID}
					 AND A.Agdm_Barbeiro = ${barbeiroID}
					 AND A.Agdm_Data = "${data}"
					 AND A.Agdm_Status NOT IN ('C', 'R'))
					 AND Horario IN (
					 SELECT H.Horario FROM horarios H, barbearia_horarios BH
					 WHERE H.Horario >= BH.BarbH_HoraInicio
					 AND H.Horario < DATE_SUB(BH.BarbH_HoraFim, INTERVAL ${tempServ} - 15 MINUTE)
					 AND BH.BarbH_Dia = "${weekDay}"
					 AND BH.Barb_Codigo = ${barbeariaID})
					 GROUP BY Id;`,
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

	async postAgendamento(req, res) {
		const { barbeariaID, barbeiroID, usuarioID, servicoID, tempServ, horaInicio, data } = req.body;
        let weekDay = DateToWeekday(data);

        if (new Date(data+"T"+horaInicio).toLocaleString() <= new Date().toLocaleString()) {
            return res.status(401).send();
        }

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`SELECT * FROM (
                     SELECT Horario FROM horarios
					 WHERE Horario NOT IN (
					 SELECT H.Horario FROM horarios H, agendamento A
					 WHERE H.Horario >= DATE_SUB(A.Agdm_HoraInicio, INTERVAL ${tempServ} - 15 MINUTE)
					 AND H.Horario < A.Agdm_HoraFim
					 AND A.Barb_Codigo = ${barbeariaID}
					 AND A.Agdm_Barbeiro = ${barbeiroID}
					 AND A.Agdm_Data = "${data}"
					 AND A.Agdm_Status NOT IN ('C', 'R'))
					 AND Horario IN (
					 SELECT H.Horario FROM horarios H, barbearia_horarios BH
					 WHERE H.Horario >= BH.BarbH_HoraInicio
					 AND H.Horario < DATE_SUB(BH.BarbH_HoraFim, INTERVAL ${tempServ} - 15 MINUTE)
					 AND BH.BarbH_Dia = "${weekDay}"
					 AND BH.Barb_Codigo = ${barbeariaID})
					 GROUP BY Id) AS tmp
                     WHERE tmp.Horario = "${horaInicio}"`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }

                        if (JSON.stringify(result) == "[]") {
                            return res.status(405).send();
                        } else {
                            conn.query(
                                `INSERT INTO agendamento VALUES(NULL, ${barbeariaID}, ${barbeiroID}, ${usuarioID}, ${servicoID}, "${horaInicio}", DATE_ADD(STR_TO_DATE("${horaInicio}", "%h:%i:%s"), INTERVAL ${tempServ} MINUTE), "${data}", "P")`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                    return res.status(201).json(result);
                                }
                            )
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

	async updateStatusAgendamento(req, res) {
		const { id } = req.params;
		const { status } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`UPDATE agendamento SET Agdm_Status = "${status}" WHERE Agdm_Codigo = ${id}`,
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

	async deleteAgendamento(req, res) {
		const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`DELETE FROM agendamento WHERE Agdm_Codigo = ${id}`,
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

    async getAgendamentos (req, res) {
        try {
            const { barbeariaID, barbeiroID, usuarioID, servicoID, dataInicio, dataFim, status } = req.body;

            let SQL = `SELECT A.*, U.Usr_FotoPerfil, B.Barb_LogoUrl, FORMAT(TIME_TO_SEC(S.Serv_Duracao) / 60,0) AS Minutos FROM agendamento A
                       INNER JOIN barbearia B ON A.Barb_Codigo = B.Barb_Codigo 
                       INNER JOIN servico S ON S.Serv_Codigo = A.Serv_Codigo 
                       INNER JOIN usuario U ON A.Usr_Codigo = U.Usr_Codigo
                       WHERE 1 > 0 `;

            if ((barbeariaID !== null) && (barbeariaID !== '') && (barbeariaID !== undefined)) {
                SQL = SQL + `AND A.Barb_Codigo = ${barbeariaID} `;
            }
            if ((barbeiroID !== null) && (barbeiroID !== '') && (barbeiroID !== undefined)) {
                SQL = SQL + `AND A.Agdm_Barbeiro = ${barbeiroID} `;
            }
            if ((usuarioID !== null) && (usuarioID !== '') && (usuarioID !== undefined)) {
                SQL = SQL + `AND A.Usr_Codigo = ${usuarioID} `;
            }
            if ((servicoID !== null) && (servicoID !== '') && (servicoID !== undefined)) {
                SQL = SQL + `AND A.Serv_Codigo = ${servicoID} `;
            }
            if ((dataInicio !== null) && (dataInicio !== '') && (dataInicio !== undefined)) {
                SQL = SQL + `AND A.Agdm_Data >= "${dataInicio}" `;
            }
            if ((dataFim !== null) && (dataFim !== '') && (dataFim !== undefined)) {
                SQL = SQL + `AND A.Agdm_Data <= "${dataFim}" `;
            }
            if ((status !== null) && (status !== '') && (status !== undefined)) {
                SQL = SQL + `AND A.Agdm_Status = "${status}" `;
            }

            SQL = SQL + " ORDER BY A.Agdm_Data DESC, A.Agdm_HoraInicio DESC ";

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

    async postAvaliacao(req, res) {
		const { usuarioID, barbeariaID, barbeiroID, mensagem, rate } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`INSERT INTO barbearia_avaliacoes VALUES(${usuarioID}, ${barbeariaID}, "${mensagem}", ${rate}, NOW())`,
                    (error, result, fields) => { if (error) { console.log(error); return res.status(500).send({ error: error }) } }
                )

                conn.query(
					`INSERT INTO barbeiro_avaliacoes VALUES(${usuarioID}, ${barbeiroID}, "${mensagem}", ${rate}, NOW())`,
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
}

export default new BarbeariaAgendamentoController();