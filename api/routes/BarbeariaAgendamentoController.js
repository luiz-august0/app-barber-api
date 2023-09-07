import moment from "moment";
import 'moment/locale/pt-br';
import formatters from "../formatters";
import Queue from "../lib/Queue";

const mysql = require('../config/mysql').pool;

//Funções gerais
const addZero = (value) => {
    if (value <= 9) {
        return "0" + value;
    } else {
        return value;
    }
}

class BarbeariaAgendamentoController {
	async getHorariosDisponiveisBarbeiro(req, res) {
		const { barbeariaID, barbeiroID, data, tempServ, horario } = req.body;
		let weekDay = formatters.DateToWeekday(data);
        let horario_hora = new Date(horario).getHours() + 1;
        let horario_minutos = new Date(horario).getMinutes();
        let horario_formatado = addZero(horario_hora) + ":" + addZero(horario_minutos) + ":00";
        let data_formatada = data + "T00:00:00.000";

        let sql = ` SELECT Horario FROM horarios
                    WHERE Horario NOT IN (
                    SELECT H.Horario FROM horarios H, agendamento A
                    WHERE H.Horario >= DATE_SUB(A.Agdm_HoraInicio, INTERVAL ${tempServ} - 15 MINUTE)
                    AND H.Horario < A.Agdm_HoraFim
                    AND A.Barb_Codigo = ${barbeariaID}
                    AND A.Agdm_Barbeiro = ${barbeiroID}
                    AND A.Agdm_Data = "${data}"
                    AND A.Agdm_Status NOT IN ('C', 'R', 'RL'))
                    AND Horario IN (
                    SELECT H.Horario FROM horarios H, barbearia_horarios BH
                    WHERE H.Horario >= BH.BarbH_HoraInicio
                    AND H.Horario < DATE_SUB(BH.BarbH_HoraFim, INTERVAL ${tempServ} - 15 MINUTE)
                    AND BH.BarbH_Dia = "${weekDay}"
                    AND BH.Barb_Codigo = ${barbeariaID})`;
    
        if (new Date(data_formatada).getDate() == new Date().getDate()) {
            sql = sql + ` AND Horario >= "${horario_formatado}"`;
        }
        
        sql = sql + " GROUP BY Id;";

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    sql,
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
        let weekDay = formatters.DateToWeekday(data);
        let dateNow = new Date();
        dateNow.setHours(dateNow.getHours() + 1);

        if (new Date(data+"T"+horaInicio).toLocaleString() <= dateNow.toLocaleString()) {
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
					 AND A.Agdm_Status NOT IN ('C', 'R', 'RL'))
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
                                `INSERT INTO agendamento VALUES(NULL, ${barbeariaID}, ${barbeiroID}, ${usuarioID}, ${servicoID}, "${horaInicio}", DATE_ADD(STR_TO_DATE("${horaInicio}", "%H:%i:%s"), INTERVAL ${tempServ} MINUTE), "${data}", "P", "N")`,
                                (error, result, fields) => {
                                    if (error) { console.log(error); return res.status(500).send({ error: error }) }

                                    const data = { id: result.insertId, status: null, notificacao: false };

                                    const sendEmails = async() => {
                                        await Queue.add('SenderEmailAgendamento', data);
                                    }

                                    sendEmails();
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
                        const data = { id, status, notificacao: false };

                        const sendEmails = async() => {
                            await Queue.add('SenderEmailAgendamento', data);
                        }

                        sendEmails();
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
					`INSERT INTO barbearia_avaliacoes VALUES(${usuarioID}, ${barbeariaID}, "${mensagem}", ${rate}, "${moment().format('YYYY-MM-DD HH:mm:ss')}")`,
                    (error, result, fields) => { if (error) { console.log(error); return res.status(500).send({ error: error }) } }
                )

                conn.query(
					`INSERT INTO barbeiro_avaliacoes VALUES(${usuarioID}, ${barbeiroID}, "${mensagem}", ${rate}, "${moment().format('YYYY-MM-DD HH:mm:ss')}")`,
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

    async getAvaliacoes(req, res) {
		const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT (SELECT COUNT(*) FROM barbearia_avaliacoes WHERE Barb_Codigo = ${id} AND Aval_Rate = 1) AS Aval_Rate1,
                    (SELECT COUNT(*) FROM barbearia_avaliacoes WHERE Barb_Codigo = ${id} AND Aval_Rate = 2) AS Aval_Rate2,
                    (SELECT COUNT(*) FROM barbearia_avaliacoes WHERE Barb_Codigo = ${id} AND Aval_Rate = 3) AS Aval_Rate3,
                    (SELECT COUNT(*) FROM barbearia_avaliacoes WHERE Barb_Codigo = ${id} AND Aval_Rate = 4) AS Aval_Rate4,
                    (SELECT COUNT(*) from barbearia_avaliacoes WHERE Barb_Codigo = ${id} and Aval_Rate = 5) as Aval_Rate5`,
                    (error, result, fields) => {
                        if (error) { console.log(error); return res.status(500).send({ error: error }) }
                        let resAvaliacoes = result;

                        conn.query(
                            `SELECT (SELECT AVG(Aval_Rate) FROM barbearia_avaliacoes WHERE Barb_Codigo = ${id}) AS Aval_RateAvg, BA.*,
                             U.Usr_Nome, U.Usr_FotoPerfil FROM barbearia_avaliacoes BA 
                             INNER JOIN usuario U ON BA.Usr_Codigo = U.Usr_Codigo
                             WHERE BA.Barb_Codigo = ${id} ORDER BY BA.Aval_Date DESC LIMIT 50`,
                            (error, result, fields) => {
                                if (error) { console.log(error); return res.status(500).send({ error: error }) }
                                return res.status(201).json([resAvaliacoes, result]); 
                            }
                        )
                    }
                )
                conn.release();
            });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error." })
        }	
	}
}

export default new BarbeariaAgendamentoController();