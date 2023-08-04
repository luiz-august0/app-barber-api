CREATE TABLE usuario(
    Usr_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Usr_Email VARCHAR(110) UNIQUE NOT NULL,
    Usr_Nome VARCHAR(80) NOT NULL,
    Usr_Senha VARCHAR(255) NOT NULL,
    Usr_Contato VARCHAR(20),
    Usr_CPF VARCHAR(11),
    Usr_Tipo CHAR(1) NOT NULL,
    Usr_FotoPerfil VARCHAR(255)
);

CREATE TABLE barbearia(
    Barb_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Nome VARCHAR(255) NOT NULL,
    Barb_RazaoSocial VARCHAR(255) NOT NULL,
    Barb_CNPJ VARCHAR(14) NOT NULL,
    Barb_InscEst VARCHAR(20) NOT NULL,
    Barb_Cidade VARCHAR(80) NOT NULL,
    Barb_CEP VARCHAR(8) NOT NULL,
    Barb_UF CHAR(2) NOT NULL,
    Barb_Rua VARCHAR(80) NOT NULL,
    Barb_Numero INT NOT NULL,
    Barb_Bairro VARCHAR(80) NOT NULL,
    Barb_Complemento VARCHAR(50),
    Barb_GeoLatitude FLOAT,
    Barb_GeoLongitude FLOAT,
    Barb_LogoUrl VARCHAR(255)
);

CREATE TABLE barbearia_contatos(
    Barb_Codigo INT NOT NULL,
    BarbC_Descricao VARCHAR(100) NOT NULL,
    BarbC_Contato VARCHAR(20) NOT NULL
);

CREATE TABLE barbearia_proprietarios(
    Barb_Codigo INT NOT NULL,
    Usr_Codigo INT NOT NULL
);

CREATE TABLE servico_categorias(
    ServCat_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Codigo INT NOT NULL,
    ServCat_Nome VARCHAR(150) NOT NULL
);

CREATE TABLE servico(
    Serv_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Serv_Nome VARCHAR(120) NOT NULL,
    ServCat_Codigo INT NOT NULL,
    Serv_Valor FLOAT NOT NULL,
    Serv_Duracao TIME NOT NULL
);

CREATE TABLE servico_imagens(
    Serv_Codigo INT NOT NULL,
    Img_Url VARCHAR(255) NOT NULL
);

CREATE TABLE barbearia_horarios(
    BarbH_Seq INT PRIMARY KEY AUTO_INCREMENT, 
    Barb_Codigo INT NOT NULL,
    BarbH_Dia CHAR(3) NOT NULL,
    BarbH_HoraInicio TIME NOT NULL,
    BarbH_HoraFim TIME NOT NULL
);

CREATE TABLE horarios (
    Id INT AUTO_INCREMENT,
    Horario TIME NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE agendamento(
    Agdm_Codigo INT PRIMARY KEY AUTO_INCREMENT,
    Barb_Codigo INT NOT NULL,
    Agdm_Barbeiro INT NOT NULL,
    Usr_Codigo INT NOT NULL,
    Serv_Codigo INT NOT NULL,
    Agdm_HoraInicio TIME NOT NULL,
    Agdm_HoraFim TIME NOT NULL,
    Agdm_Data DATE NOT NULL,
    Agdm_Status CHAR(2) NOT NULL -- P - PENDENTE, RL - REALIZADO, C - CANCELADO PELO USUARIO, R - RECUSADO PELO BARBEIRO
);

CREATE TABLE barbearia_barbeiros(
    Barb_Codigo INT NOT NULL,
    Usr_Codigo INT NOT NULL,
    BarbB_Especialidade VARCHAR(255)
);

CREATE TABLE barbeiro_avaliacoes(
    Usr_Codigo INT NOT NULL,
    Aval_Comentario TEXT,
    Aval_Rate INT NOT NULL
);

CREATE TABLE barbearia_avaliacoes(
    Barb_Codigo INT NOT NULL,
    Aval_Comentario TEXT,
    Aval_Rate INT NOT NULL
);

CREATE TABLE barbeiro_servicos(
    Usr_Codigo INT NOT NULL,
    Barb_Codigo INT NOT NULL,
    Serv_Codigo INT NOT NULL
);

ALTER TABLE barbearia_contatos ADD CONSTRAINT fk_barbearia_contatos_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT pk_barbearia_proprietario
PRIMARY KEY(Barb_Codigo, Usr_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT fk_barbearia_proprietario_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_proprietarios ADD CONSTRAINT fk_barbearia_proprietario_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE servico_categorias ADD CONSTRAINT fk_categoria_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE servico ADD CONSTRAINT fk_servico_categoria
FOREIGN KEY(ServCat_Codigo) REFERENCES servico_categorias(ServCat_Codigo);

ALTER TABLE servico_imagens ADD CONSTRAINT fk_servico_imagens_servico
FOREIGN KEY(Serv_Codigo) REFERENCES servico(Serv_Codigo);

ALTER TABLE barbearia_horarios ADD CONSTRAINT fk_barbearia_horarios_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE agendamento ADD CONSTRAINT fk_agendamento_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE agendamento ADD CONSTRAINT fk_agendamento_barbeiro
FOREIGN KEY(Agdm_Barbeiro) REFERENCES usuario(Usr_Codigo);

ALTER TABLE agendamento ADD CONSTRAINT fk_agendamento_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE agendamento ADD CONSTRAINT fk_agendamento_servico
FOREIGN KEY(Serv_Codigo) REFERENCES servico(Serv_Codigo);

ALTER TABLE barbearia_barbeiros ADD CONSTRAINT pk_barbearia_barbeiro
PRIMARY KEY(Barb_Codigo, Usr_Codigo);

ALTER TABLE barbearia_barbeiros ADD CONSTRAINT fk_barbearia_barbeiros_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbearia_barbeiros ADD CONSTRAINT fk_barbearia_barbeiros_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE barbeiro_avaliacoes ADD CONSTRAINT fk_barbeiro_avaliacoes_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE barbearia_avaliacoes ADD CONSTRAINT fk_barbearia_avaliacoes_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbeiro_servicos ADD CONSTRAINT fk_barbeiro_servicos_usuario
FOREIGN KEY(Usr_Codigo) REFERENCES usuario(Usr_Codigo);

ALTER TABLE barbeiro_servicos ADD CONSTRAINT fk_barbeiro_servicos_barbearia
FOREIGN KEY(Barb_Codigo) REFERENCES barbearia(Barb_Codigo);

ALTER TABLE barbeiro_servicos ADD CONSTRAINT fk_barbeiro_servicos_servico
FOREIGN KEY(Serv_Codigo) REFERENCES servico(Serv_Codigo);