import Queue from '../lib/Queue';

const mysql = require('../config/mysql').pool;

export function SenderEmailNotificacao() {
	return new Promise((resolve, reject) => {
		try {
			mysql.getConnection((error, conn) => {
				conn.query(
					`SELECT Agdm_Codigo FROM agendamento 
					WHERE Agdm_Data = DATE(NOW())
					AND Agdm_HoraInicio BETWEEN TIME(DATE_ADD(NOW(), INTERVAL + 120 MINUTE)) AND TIME(DATE_ADD(NOW(), INTERVAL + 140 MINUTE))
					AND Agdm_Notificado = "N";`,
					(error, result, fields) => {
						if (error) { return reject(error); }
	
						if (JSON.stringify(result) !== "[]") {
							const agendamentos = result;

							conn.query(
								`UPDATE agendamento SET Agdm_Notificado = "S"
								WHERE Agdm_Data = DATE(NOW())
								AND Agdm_HoraInicio BETWEEN TIME(DATE_ADD(NOW(), INTERVAL + 120 MINUTE)) AND TIME(DATE_ADD(NOW(), INTERVAL + 140 MINUTE))
								AND Agdm_Notificado = "N"`,
								(error, result, fields) => {
									if (error) { return reject(error); }
								}
							)

							agendamentos.map(async(e) => {
								const data = { id: e.Agdm_Codigo, status: null, notificacao: true};
								await Queue.add('SenderEmailAgendamento', data);
							})
						}
						resolve();
					}
				)
				conn.release();
			})
		} catch(err) {
			return reject(err);
		}
	})
}