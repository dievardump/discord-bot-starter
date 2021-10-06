import Discord from "discord.js";

export default async () => {
	const bot = new Discord.Client();
	const TOKEN = process.env.TOKEN;
	bot.login(TOKEN);

	return bot;
}