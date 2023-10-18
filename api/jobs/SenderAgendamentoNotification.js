import { sendEmail, sendMessageWP } from '../services/senderNotification';

const mysql = require('../config/mysql').pool;

function sendNotification(data) {
	async function sendMessagesAndEmails(dataSend) {
		await sendEmail(dataSend).catch((error) => console.log(`AgendamentoID: ${data.id}, ERROR: ${error}`));
		await sendMessageWP(dataSend).catch((error) => console.log(`AgendamentoID: ${data.id}, ERROR: ${error}`));
	}

	return new Promise((resolve, reject) => {
		let errors = [];

		mysql.getConnection((error, conn) => {
			if (error) return reject(error);

			try {				
				conn.query(
					`SELECT AG.*, B.Barb_Nome, B.Barb_Cidade, B.Barb_CEP, B.Barb_UF, B.Barb_Rua, B.Barb_Numero, B.Barb_Bairro, 
					Barb_GeoLatitude, B.Barb_GeoLongitude, B.Barb_LogoUrl, UB.Usr_Codigo AS CodigoBarbeiro, UB.Usr_Email AS EmailBarbeiro, UB.Usr_Nome AS NomeBarbeiro,
					UB.Usr_Contato AS ContatoBarbeiro, UB.Usr_FotoPerfil AS FotoBarbeiro, UU.Usr_Codigo AS CodigoCliente, UU.Usr_Email AS EmailCliente, UU.Usr_Nome AS NomeCliente,
					UU.Usr_Contato AS ContatoCliente, UU.Usr_FotoPerfil AS FotoCliente, S.Serv_Nome, AG.Agdm_Valor AS Serv_Valor, FORMAT(TIME_TO_SEC(S.Serv_Duracao) / 60,0) AS Minutos
					FROM agendamento AG
					INNER JOIN barbearia B ON AG.Barb_Codigo = B.Barb_Codigo 
					INNER JOIN usuario UB ON AG.Agdm_Barbeiro = UB.Usr_Codigo 
					INNER JOIN usuario UU ON AG.Usr_Codigo = UU.Usr_Codigo
					INNER JOIN servico S ON AG.Serv_Codigo = S.Serv_Codigo
					WHERE AG.Agdm_Codigo = ${data.id}`,
					(error, result, fields) => {
						if (error) return reject(error);
						const dataNotificacao = result[0];
	
						const dataCliente = {
							email: result[0].EmailCliente,
							dataNotificacao,
							status: data.status,
							notificacao: data.notificacao,
							tipo: 'AGENDAMENTOCLIENTE'
						};
	
						const dataBarbeiro = {
							email: result[0].EmailBarbeiro,
							dataNotificacao,
							status: data.status,
							notificacao: data.notificacao,
							tipo: 'AGENDAMENTOBARBEIRO'
						};
	
						sendMessagesAndEmails(dataCliente);
						sendMessagesAndEmails(dataBarbeiro);
												
						conn.query(
							`SELECT U.Usr_Codigo, U.Usr_Email, U.Usr_Nome, U.Usr_Contato FROM barbearia_proprietarios BP
							INNER JOIN usuario U ON BP.Usr_Codigo = U.Usr_Codigo
							WHERE BP.Barb_Codigo = ${dataNotificacao.Barb_Codigo}
							AND BP.Usr_Codigo <> ${dataNotificacao.Agdm_Barbeiro}`,
							(error, result, fields) => {
								if (error) return reject(error);

								result.map((e) => {
									const dataProprietario = {
										email: e.Usr_Email,
										nome: e.Usr_Nome,
										contato: e.Usr_Contato,
										dataNotificacao,
										status: data.status,
										notificacao: data.notificacao,
										tipo: 'AGENDAMENTOPROPRIETARIOBARBEARIA'
									};
			
									sendMessagesAndEmails(dataProprietario);
								})

								return resolve(errors);
							}
						)
					}
				)
				conn.release();
			} catch (error) {
				return reject(error)
			}
		})
	})
}

export default {
	key: 'SenderAgendamentoNotification',
	async handle({ data }) {
		return await sendNotification(data);
	}
}