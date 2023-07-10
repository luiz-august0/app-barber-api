const mysql = require('../config/mysql').pool;

export default {
	key: 'Teste',
	async handle({ data }) {
		try {
			mysql.getConnection((error, conn) => {
				conn.query(
					`UPDATE barbearia SET Barb_UF = "PR" WHERE Barb_Codigo = ${data.id}`,
					(error, result, fields) => {
						if (error) { console.log(error) }
					}
				)
				conn.release();
			})
		} catch(err) {
			console.error(err);
		}
	}
}