import sendEmail from '../services/sendEmail';

const mysql = require('../config/mysql').pool;

export default {
	key: 'SenderEmailAgendamento',
	async handle({ data }) {
		try {
			mysql.getConnection((error, conn) => {
				conn.query(
					`SELECT AG.*, B.Barb_Nome, B.Barb_Cidade, B.Barb_CEP, B.Barb_UF, B.Barb_Rua, B.Barb_Numero, B.Barb_Bairro, 
					Barb_GeoLatitude, B.Barb_GeoLongitude, B.Barb_LogoUrl, UB.Usr_Email AS EmailBarbeiro, UB.Usr_Nome AS NomeBarbeiro,
					UB.Usr_Contato AS ContatoBarbeiro, UB.Usr_FotoPerfil AS FotoBarbeiro, UU.Usr_Email AS EmailCliente, UU.Usr_Nome AS NomeCliente,
					UU.Usr_Contato AS ContatoCliente, UU.Usr_FotoPerfil AS FotoCliente, S.Serv_Nome, S.Serv_Valor, FORMAT(TIME_TO_SEC(S.Serv_Duracao) / 60,0) AS Minutos
					FROM agendamento AG
					INNER JOIN barbearia B ON AG.Barb_Codigo = B.Barb_Codigo 
					INNER JOIN usuario UB ON AG.Agdm_Barbeiro = UB.Usr_Codigo 
					INNER JOIN usuario UU ON AG.Usr_Codigo = UU.Usr_Codigo
					INNER JOIN servico S ON AG.Serv_Codigo = S.Serv_Codigo
					WHERE AG.Agdm_Codigo = ${data.id}`,
					(error, result, fields) => {
						if (error) { console.log(error) }

						const data = {
							email: result[0].EmailCliente,
							dataEmail: result,
							tipo: 'AGENDAMENTOCLIENTE'
						};

						sendEmail(data);

						/*conn.query(
							`SELECT U.Usr_Email FROM barbearia_proprietarios BP
							INNER JOIN usuario U ON BP.Usr_Codigo = U.Usr_Codigo
							WHERE BP.Barb_Codigo = ${dataEmail.Barb_Codigo}
							AND BP.Usr_Codigo <> ${dataEmail.Agdm_Barbeiro}`,
							(error, result, fields) => {
								if (error) { console.log(error) }
								result.map((e) => {
									//
								})
						})*/
					}
				)
				conn.release();
			})
		} catch(err) {
			console.error(err);
		}
	}
}