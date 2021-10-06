import './config.js';
import discord from './discord.js';
import database from './providers/database.js';

import EarlyBirdsController from './controllers/early-birds.js';

// list of channels names where commands are accepted
const channels = ['bot-commands'];

// parse a message and checks if the first character is the "command start" character
function parseMessage(msg) {
	const split = msg.split(' ');
	if (!split[0].startsWith(process.env.COMMAND_START || '$')) return false;

	return {
		command: split[0].slice(1),
		params: split.slice(1),
	};
}

(async () => {
	await database.init();
	const bot = await discord();

	// creates the early bird controller
	const earlyBirdsController = new EarlyBirdsController(database, channels);

	// add controllers
	const controllers = [earlyBirdsController];

	bot.on('ready', async () => {
		console.info(`Logged in as ${bot.user.tag}!`);
	});

	// whenever the bot receive a message
	bot.on('message', async (msg) => {
		// if the message is a command
		const parsed = parseMessage(msg.content);
		if (parsed == false) return;

		// go through the controllers and process the command
		// controllers will decide using `parsed.command` if they want to
		// process this message or not
		for (let controller of controllers) {
			await controller.process(parsed, msg);
		}
	});
})();
