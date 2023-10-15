import { create } from "venom-bot";

let venomClient;

if (!venomClient) {
    create({ session: 'wpbarber'})
        .then((client) => venomClient = client)
        .catch((err) => console.log(err));
}

class WPController {
    async sendMessage(req, res) {
        const { contact, message } = req.body;

        if (venomClient) { 
            try {
                await venomClient.sendText('55' + contact + '@c.us', message);   
                return res.status(201).json(); 
            } catch (error) {
                return res.status(error.status).json(error.text)
            }
        } else {
            return res.status(404).json({ error: "Venom client não foi instanciado" })
        }
    }
}

export default new WPController();