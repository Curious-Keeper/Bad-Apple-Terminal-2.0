const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const { Jimp } = require("jimp");

const ffmpegPath = require("ffmpeg-static");

if (fs.existsSync("./frames")) {
    fs.rmSync("./frames", { recursive: true, force: true });
}
fs.mkdirSync("./frames");

function extract() {
    const file = process.argv.length === 2 ? "res/BadApple.mp4" : process.argv[2];
    const inputPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        process.exit(1);
    }
    console.log(`Extracting frames from ${file}`);

    const framesDir = path.join(process.cwd(), "frames");
    const outputPattern = path.join(framesDir, "frame_%04d.png");

    const ffmpeg = spawn(ffmpegPath, [
        "-i", inputPath,
        "-vf", "scale=120:90",
        "-r", "30",
        "-f", "image2",
        "-y",
        outputPattern
    ], { stdio: ["ignore", "pipe", "pipe"] });

    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => { stderr += chunk; });

    ffmpeg.on("close", (code) => {
        if (code !== 0) {
            console.error(`ffmpeg failed (${code}):\n${stderr}`);
            process.exit(1);
        }
        console.log("Video has been processed!");
        toGrayScale();
    });
}

function toGrayScale() {
    fs.readdir("./frames", (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        const pngFiles = files.filter((f) => f.endsWith(".png")).sort();
        let done = 0;
        const total = pngFiles.length;
        if (total === 0) {
            console.log("No frames to convert.");
            return;
        }
        pngFiles.forEach((file) => {
            Jimp.read(`./frames/${file}`)
                .then((image) => {
                    return new Promise((resolve, reject) => {
                        image.greyscale().write(`./frames/${file}`, (err) => (err ? reject(err) : resolve()));
                    });
                })
                .then(() => {
                    done++;
                    const pct = done === total ? "100%" : (done / total * 100).toFixed(2) + "%";
                    process.stdout.write(`\rTo grayscale... ${pct}${done === total ? " complete" : ""}`);
                    if (done === total) {
                        process.stdout.write("\n");
                    }
                })
                .catch((e) => {
                    console.error(`Error processing ${file}:`, e);
                });
        });
    });
}

extract();
