const mysql = require('../config/mysql').pool;

class BarbeariaHorariosController {
    async getHorarios(req, res) {
        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT Horario AS label, Horario AS text FROM horarios`,
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

    async getBarbeariaHorariosDia(req, res) {
        const { id } = req.params;
        const { dia } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `SELECT * FROM barbearia_horarios WHERE Barb_Codigo = ${id} AND BarbH_Dia = "${dia}"`,
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

    async postBarbeariaHorarioDia(req, res) {
        const { id } = req.params;
        const { dia, hrInicial, hrFinal } = req.body;

        try {
            mysql.getConnection((error, conn) => {  
                conn.query(
                    `INSERT INTO barbearia_horarios VALUES(NULL, ${id}, "${dia}", "${hrInicial}", "${hrFinal}")`,
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

    async updateBarbeariaHorarioDia(req, res) {
        const { id } = req.params;
        const { hrInicial, hrFinal } = req.body;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `UPDATE barbearia_horarios SET BarbH_HoraInicio = "${hrInicial}", BarbH_HoraFim = "${hrFinal}" 
                     WHERE BarbH_Seq = ${id}`,
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

    async deleteBarbeariaHorarioDia(req, res) {
        const { id } = req.params;

        try {
            mysql.getConnection((error, conn) => {
                conn.query(
                    `DELETE FROM barbearia_horarios WHERE BarbH_Seq = ${id}`,
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
}

export default new BarbeariaHorariosController();