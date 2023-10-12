import { sendEmail } from "../services/senderNotification";

export default {
	key: 'SenderRecuperationMail',
	async handle({ data }) {
		return await sendEmail(data);
	}
}