import { SenderAgendamentoNotification } from "./threadJobs/SenderAgendamentoNotification";

function loopThread() {
	setTimeout(function(){
		setTimeout(async function(){
			try {
				await SenderAgendamentoNotification();
				console.log('Thread envia notificação de agendamento');
			} catch (error) {
				console.log('Thread envia notificação de agendamento. Erro: ' + error);
			}
		}, 0);
		loopThread();
	}, 2000)
}

loopThread();