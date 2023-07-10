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
                        if (error) { return res.status(500).send({ error: error }) }
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
		const { barbeariaID, barbeiroID, usuarioID, servicoID, horaInicio, horaFim, data } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`INSERT INTO agendamento VALUES(NULL, ${barbeariaID}, ${barbeiroID}, ${usuarioID}, ${servicoID}, "${horaInicio}", "${horaFim}", "${data}", "P")`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
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

	async updateStatusAgendamento(req, res) {
		const { id } = req.params;
		const { status } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
					`UPDATE agendamento SET Agdm_Status = "${status}" WHERE Agdm_Codigo = ${id}`,
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
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
                        if (error) { return res.status(500).send({ error: error }) }
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

export default new BarbeariaAgendamentoController();