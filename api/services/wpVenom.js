const venom = require('venom-bot');

export class WpVenom {
    constructor() { 
        this.client = undefined;
    }

    async setClient() {
        if (!this.client) {
            this.client = venom.create({ session: 'wpbarber'}).then((client) => this.client = client).catch((err) => console.log(err));
        }
    }
}

export async function sendMessage(client, contact, message) {
    if (client) { 
        await client.sendText('55' + contact + '@c.us', message).catch((err) => console.log("sendMessage: " + err));    
    } else {
        console.log("aqui")
    }
}