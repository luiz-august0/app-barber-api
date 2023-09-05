import sendEmail from "../services/sendEmail";

export default {
	key: 'SenderRecuperationMail',
	async handle({ data }) {
		await sendEmail(data);
	}
}