"use strict";

const { Structures, Client, Collection } = require("discord.js"); // or discord.js-light

// extend the Message class and add a new message.send() method that automatically checks for the existence of previous responses
Structures.extend("Message", M => class Message extends M {
	async send(content, _options) {
		let options = _options;
		if(typeof content === "string") {
			if(!options) { options = {}; }
			options.content = content;
		} else {
			options = content;
		}
		let sent;
		const previous = this.client.responses.get(this.id);
		if(previous) {
			// use the forge method if using discord.js-light else fallback to fetching for regular discord.js
			const msg = typeof this.channel.messages.forge === "function" ? this.channel.messages.forge(previous.id) : await this.channel.messages.fetch(previous.id, false);
			if(previous.attachments || options.files) {
				await msg.delete().catch(() => {});
				sent = await this.channel.send(options);
			} else {
				if(previous.embeds && !options.embed) {
					options.embed = null;
				}
				sent = await msg.edit(options);
			}
		} else {
			sent = await this.channel.send(options);
		}
		this.client.responses.set(this.id, {
			id: sent.id,
			attachments: Boolean(sent.attachments.size),
			embeds: Boolean(sent.embeds.length),
			timestamp: Date.now()
		});
		return sent;
	}
});

// create the client like normal
const client = new Client();

// add a collection to hold responses
client.responses = new Collection();

// add event listeners
client.on("message", message => {
	if(message.content.startsWith("!ping")) {
		message.send("pong");
	}
});
client.on("messageUpdate", (oldMessage, newMessage) => {
	// messageUpdates are sometimes sent multiple times for the same message, for example one update containing an embed, another contianing the content, etc
	// if the message doesnt have an author field, it meants its one of these partial updates, so you can safely ignore it
	if(!newMessage.author) {return;}
	if(newMessage.content.startsWith("!ping")) {
		newMessage.send("pong");
	}
});

// alternatively create a message handler
function handler(message) {
	if(!message.author) {return;}
	if(message.content.startsWith("!ping")) {
		message.send("pong");
	}
}
client.on("message", (newM) => handler(newM));
client.on("messageUpdate", (oldM, newM) => handler(newM));
