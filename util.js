const snek = require('node-superfetch');

class Util {
  static shuffle (array){
    const arr = array.slice(0);
    for(let i = arr.length -1; i >= 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
  static async hastebin(text){
    const { body } = await snek.post('https://www.hastebin.com/documents')
    .send(text);
    return `https://www.hastebin.com/${body.key}`;
  }
  static chunk (array, chunkSize){
    const temp = [];
    for(let i = 0; i < array.length; i+= chunkSize){
      temp.push(array.slice(i, i+chunkSize));
    }
    return temp;
  }
  static parseDur(ms){
    let seconds = ms / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);
    
    if (days) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    else if (hours) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    else if (minutes) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
  static trimArray (array, length = 10){
    const len = array.length - length;
    const temp = array.slice(0, length);
    temp.push(`...${len} more.`);
    return temp;
  }
  static async verify(user, msg, time = 30000){
    await msg.react('🇾');
    await msg.react('🇳');
    const data = await msg.awaitReactions(reaction => reaction.users.has(user.id), { time: time, max: 1});
    if(data.firstKey() === '🇾') return true;
    return false;
  }
  static async scrapeSubreddit(subreddit){
    subreddit = typeof subreddit === "string" && subreddit.length !== 0 ? subreddit : "puppies";
    const { body } = await snek.get(`https://imgur.com/r/${subreddit}/hot.json`);
    if(!body.data) return undefined;
    const img = body.data[Math.floor(Math.random() * body.data.length)];
    return `http://imgur.com/${img.hash}${img.ext.replace(/\?.*/, "")}`;
  }
  static codeblock (string, code){
    return `\`\`\`${code}\n${string}\`\`\``;
  }
  static silhouette(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 0;
			data.data[i + 1] = 0;
			data.data[i + 2] = 0;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}
  static decodeHtmlEntities (text){
    return text.replace(/&#(\d+);/g, (rep, code) => {
      return String.frrmCharCode(code)
    });
  }
  static async scrapeSubreddit(sub){
    const url = await require('random-puppy')(sub);
    return url;
  }
}


module.exports = Util;