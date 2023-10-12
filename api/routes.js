import { Router } from "express";
import SessionController from "./routes/SessionController";
import auth from "./middlewares/auth";
import UsuarioController from "./routes/UsuarioController";
import BarbeariaController from "./routes/BarbeariaController";
import BarbeariaHorariosController from "./routes/BarbeariaHorariosController";
import BarbeariaServicosController from "./routes/BarbeariaServicosController";
import BarbeariaBarbeirosController from "./routes/BarbeariaBarbeirosController";
import Queue from "./lib/Queue";
import BarbeariaAgendamentoController from "./routes/BarbeariaAgendamentoController";
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const uploadFile = require('./services/fileUploader');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({	
	queues: Queue.queues.map(queue => new BullAdapter(queue.bull)),
  	serverAdapter 
})

const routes = new Router();

routes.use('/admin/queues', serverAdapter.getRouter());
routes.post('/usuario', UsuarioController.create);
routes.post('/usuario/verifica', UsuarioController.verify);
routes.post('/usuario/email/recuperacao', UsuarioController.postEnviaEmailRecuperacaoSenha);
routes.post('/usuario/recuperacao', UsuarioController.postRecuperacaoSenha);
routes.put('/sessions', SessionController.create);
routes.use(auth);

//Rotas usuário
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.put('/usuario/senha/:id', UsuarioController.updatePassword);
routes.post('/usuario/barbeiro/email', UsuarioController.getDataUsuarioBarbeiroWithEmail);
routes.post('/usuario/perfil/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				UsuarioController.updateFotoPerfil(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.delete('/usuario/:id', UsuarioController.deleteUsuario);
routes.get('/usuario/cliente/pesquisa', UsuarioController.getUsuarioClienteByNome);

//Rotas barbearia
routes.post('/barbearia/pesquisa', BarbeariaController.getBarbearias);
routes.get('/barbearia/visitadas/:id', BarbeariaController.getBarbeariasVisitadas);
routes.get('/barbearia/:id', BarbeariaController.getDadosBarbearia);
routes.get('/barbearia/usuario/:id', BarbeariaController.getBarbeariasUsuario);
routes.post('/barbearia', BarbeariaController.postBarbearia);
routes.put('/barbearia/:id', BarbeariaController.updateBarbearia);
routes.delete('/barbearia/:id', BarbeariaController.deleteBarbearia);
routes.get('/barbearia/contatos/:id', BarbeariaController.getBarbeariaContatos);
routes.post('/barbearia/contatos/:id', BarbeariaController.postBarbeariaContatos);
routes.post('/barbearia/contatos/remove/:id', BarbeariaController.deleteBarbeariaContatos);
routes.get('/barbearia/proprietarios/:id', BarbeariaController.getBarbeariaProprietarios);
routes.post('/barbearia/proprietarios/:id', BarbeariaController.postBarbeariaProprietarios);
routes.post('/barbearia/proprietarios/remove/:id', BarbeariaController.deleteBarbeariaProprietarios);
routes.post('/barbearia/logo/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				BarbeariaController.updateLogoBarbearia(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.get('/horarios', BarbeariaHorariosController.getHorarios);
routes.post('/barbearia/horariodia/pesquisa/:id', BarbeariaHorariosController.getBarbeariaHorariosDia);
routes.post('/barbearia/horariodia/envia/:id', BarbeariaHorariosController.postBarbeariaHorarioDia);
routes.post('/barbearia/horariodia/atualiza/:id', BarbeariaHorariosController.updateBarbeariaHorarioDia);
routes.delete('/barbearia/horariodia/remove/:id', BarbeariaHorariosController.deleteBarbeariaHorarioDia);
routes.get('/barbearia/categoria/:id', BarbeariaServicosController.getBarbeariaCategorias);
routes.get('/barbearia/barbeiro/categoria', BarbeariaServicosController.getBarbeariaCategoriasByBarbeiro);
routes.get('/barbearia/categoria/id/:id', BarbeariaServicosController.showBarbeariaCategoria);
routes.post('/barbearia/categoria', BarbeariaServicosController.postBarbeariaCategoria);
routes.put('/barbearia/categoria/:id', BarbeariaServicosController.updateBarbeariaCategoria);
routes.delete('/barbearia/categoria/:id', BarbeariaServicosController.deleteBarbeariaCategoria);
routes.get('/barbearia/servicoscategoria/:id', BarbeariaServicosController.getBarbeariaCategoriaServicos);
routes.get('/barbearia/barbeiro/servicoscategoria', BarbeariaServicosController.getBarbeariaCategoriaServicosByBarbeiro);
routes.get('/barbearia/servico/:id', BarbeariaServicosController.showBarbeariaServico);
routes.post('/barbearia/servico', BarbeariaServicosController.postBarbeariaServico);
routes.put('/barbearia/servico/:id', BarbeariaServicosController.updateBarbeariaServico);
routes.delete('/barbearia/servico/:id', BarbeariaServicosController.deleteBarbeariaServico);
routes.get('/barbearia/servicoimagens/:id', BarbeariaServicosController.getImagensServico);
routes.post('/barbearia/servicoimagem/:id', (req, res) => {
	uploadFile(req.body.file)
		.then((url) => {
			try {
				BarbeariaServicosController.postImagemServico(req.params.id, url);
				return res.status(201).json(url);
			} catch (err) {
				res.status(500).json(err);
			}
		})
		.catch((err) => res.status(500).json(err));
});
routes.post('/barbearia/servicoimagem/remove/:id', BarbeariaServicosController.deleteImagemServico);
routes.post('/barbearia/barbeiro', BarbeariaBarbeirosController.postBarbeiro);
routes.post('/barbearia/barbeiro/atualiza', BarbeariaBarbeirosController.updateBarbeiro);
routes.post('/barbearia/barbeiro/remove', BarbeariaBarbeirosController.deleteBarbeiro);
routes.get('/barbearia/barbeiros/barbeariaID/:id', BarbeariaBarbeirosController.getBarbeirosByBarbearia);
routes.get('/barbearia/barbeiros/usuarioID/:id', BarbeariaBarbeirosController.getBarbeirosByUsuario);
routes.post('/barbearia/barbeiros/pesquisa/servicoID/:id', BarbeariaBarbeirosController.getBarbeirosByServico);
routes.get('/barbearia/barbearias/barbeiroID/:id', BarbeariaBarbeirosController.getBarbeariasByBarbeiro);
routes.post('/barbearia/barbeiro/pesquisa', BarbeariaBarbeirosController.getDataBarbeiro);
routes.post('/barbeiro/servico/pesquisa', BarbeariaBarbeirosController.getServicosBarbeiro);
routes.post('/barbeiro/servico/envia', BarbeariaBarbeirosController.postServicoBarbeiro);
routes.post('/barbeiro/servico/remove', BarbeariaBarbeirosController.deleteServicoBarbeiro);

//Rotas agendamento
routes.post('/barbeiro/agendamento/pesquisa/horarios', BarbeariaAgendamentoController.getHorariosDisponiveisBarbeiro);
routes.post('/barbearia/agendamento', BarbeariaAgendamentoController.postAgendamento);
routes.post('/barbearia/agendamento/pesquisa', BarbeariaAgendamentoController.getAgendamentos);
routes.put('/barbearia/agendamento/:id', BarbeariaAgendamentoController.updateStatusAgendamento);
routes.delete('/barbearia/agendamento/:id', BarbeariaAgendamentoController.deleteAgendamento);
routes.post('/barbearia/agendamento/avaliacao', BarbeariaAgendamentoController.postAvaliacao);
routes.get('/barbearia/agendamento/avaliacao/:id', BarbeariaAgendamentoController.getAvaliacoes);

export default routes;