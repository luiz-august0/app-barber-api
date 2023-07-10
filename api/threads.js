import { teste } from "./threadJobs/teste";

function loopThread() {
	setTimeout(function(){
		setTimeout(async function(){
			try {
				await teste();
				console.log('ThreadTeste executed');
			} catch (error) {
				console.log('Erro: ' + error);
			}
		}, 0);

		setTimeout(async function() {
			console.log('ThreadTeste2 executed');
		},0)
		
		loopThread();
	}, 2000)
}

loopThread();