import sendEmail from "../services/senderNotification";

export default {
	key: 'SenderRecuperationMail',
	async handle({ data }) {
		await sendEmail(data);
	}
}