const fs = require("fs");
const { Jimp } = require("jimp");
const { toFourDigits } = require("./utilities");

let id;
let startIndex;
let endIndex;

function doFrame(id, index = 1, end = NaN) {
  const indexString = toFourDigits(index.toString());
  const path = `frames/frame_${indexString}.png`;

  if (!isNaN(end) && index === end) {
    return process.exit();
  }

  Jimp.read(path)
    .then((image) => {
      const pixels = image.bitmap;
      const data = pixels.data;
      const symbols = "⠀⠃⠇⠏⠟⠿";

      let string = "";
      let widthCounter = 0;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.max(data[i], data[i + 1], data[i + 2]);
        const idx = Math.floor(value / (256 / 6));
        string += symbols[idx].repeat(2);
        widthCounter++;
        if (widthCounter === 120) {
          widthCounter = 0;
          string += "\n";
        }
      }
      string += "\n";

      const regexes = [/(⠀+)/g, /(⠃+)/g, /(⠇+)/g, /(⠏+)/g, /(⠟+)/g, /(⠿+)/g];
      for (let i = 0; i < regexes.length; i++) {
        const matches = string.match(regexes[i]) || [];
        for (const match of matches) {
          string = string.replace(match, symbols[i] + toFourDigits(match.length.toString()));
        }
      }

      fs.writeFileSync(`./data/data_${id}.txt`, string, { flag: "a" });
      process.send("plus");
      doFrame(id, index + 1, end);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

process.on("message", (msg) => {
  id = msg.id;
  startIndex = msg.index;
  endIndex = msg.end;
  doFrame(msg.id, msg.index, msg.end);
});
