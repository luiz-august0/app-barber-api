import { SenderEmailNotificacao } from "./threadJobs/SenderEmailNotificacao";
const venom = require('venom-bot');

function loopThread() {
	setTimeout(function(){
		setTimeout(async function(){
			try {
				await SenderEmailNotificacao();
				console.log('Thread envia notificação de agendamento');
			} catch (error) {
				console.log('Thread envia notificação de agendamento. Erro: ' + error);
			}
		}, 0);
		loopThread();
	}, 2000)
}

function send() {
	async function start(client) {
		// Send basic text
		  await client
			.sendText('5545998177489@c.us', 'Olá Sou um Robô!')
			.then((result) => {
				console.log('Result: ', result.status);        
			})
			.catch((erro) => {
				console.error('Error no Processo: ', erro.status); //return object error
			});
	}

	venom
		.create({
			session: 'session-name' //name of session
		})
		.then((client) => start(client))
		.catch((erro) => {
			console.log(erro);
		});
}

//loopThread();
send();