import bcrypt from "bcryptjs";

export const createPasswordHash = async (senha) => 
    bcrypt.hash(senha, 8);

export const checkPassword = (senha, usuarioSenha) =>
    bcrypt.compareSync(senha, usuarioSenha);