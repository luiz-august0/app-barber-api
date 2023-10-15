import Queue from '../lib/Queue';

const mysql = require('../config/mysql').pool;

export function SenderAgendamentoNotification() {
	return new Promise((resolve, reject) => {
		mysql.getConnection((error, conn) => {
			if (error) return reject(error); 
			
			try {
				conn.query(
					`SELECT Agdm_Codigo FROM agendamento
					WHERE Agdm_Data = DATE(NOW())
					AND Agdm_HoraInicio BETWEEN TIME(DATE_ADD(NOW(), INTERVAL + 120 MINUTE)) AND TIME(DATE_ADD(NOW(), INTERVAL + 140 MINUTE))
					AND Agdm_Notificado = "N";`,
					(error, result, fields) => {
						if (error) return reject(error);
	
						if (JSON.stringify(result) !== "[]") {
							const agendamentos = result;
	
							conn.query(
								`UPDATE agendamento SET Agdm_Notificado = "S"
								WHERE Agdm_Data = DATE(NOW())
								AND Agdm_HoraInicio BETWEEN TIME(DATE_ADD(NOW(), INTERVAL + 120 MINUTE)) AND TIME(DATE_ADD(NOW(), INTERVAL + 140 MINUTE))
								AND Agdm_Notificado = "N"`,
								(error, result, fields) => {
									if (error) return reject(error); 
								}
							)
	
							agendamentos.map(async(e) => {
								const data = { id: e.Agdm_Codigo, status: null, notificacao: true};
								await Queue.add('SenderAgendamentoNotification', data);
							})
						}

						return resolve();
					}
				)
				conn.release();
			} catch (error) {
				return reject(error)
			}
		})
	})
}