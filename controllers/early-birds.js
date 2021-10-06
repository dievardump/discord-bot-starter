import { ethers } from 'ethers';

export default class EarlyBirdsController {
	database = null;
	channels = [];
	commands = {};

	constructor(database, channels = []) {
		this.database = database;
		this.channels = channels;

		// register the commands for this controller
		this.commands = {
			wallet: this.registerWallet.bind(this),
			check: this.checkWallet.bind(this),
		};
	}

	async process(parsed, msg) {
		// if no specific channel for this controller or message is not in one of the supported channels
		if (this.channels.length == 0 || this.channels.indexOf(msg.channel.name) == -1) return;

		// check if command is known
		if ('function' == typeof this.commands[parsed.command]) {
			await this.commands[parsed.command](parsed, msg);
		}
	}

	async registerWallet(parsed, msg) {
		const { params } = parsed;
		const USER_ID = msg.author.id.toString();

		try {
			const address = ethers.utils.getAddress(params[0].toLowerCase());

			await this.database.addUserAddress(USER_ID, address);

			// answer to message saying stored
			await msg.reply(`Got it! ${address}`);
		} catch (e) {
			await msg.reply(
				'Error when detecting address... please use the 0x... form. Ping @dievardump if you think there is an error.',
			);
		}
	}

	async checkWallet(parsed, msg) {
		const USER_ID = msg.author.id.toString();
		const address = this.database.getUserAddress(USER_ID);
		if (address) {
			msg.reply(`Known address is ${address}`);
		} else {
			msg.reply(`No known address for your user id`);
		}
	}
}
