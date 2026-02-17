const readline = require("readline");
const fs = require("fs");

const TARGET_FPS = 30;
const INTERVAL_MS = 1000 / TARGET_FPS;

run();

function decompressFrame(frame) {
    let string = "";
    const lines = frame.split("\n");
    for (const line of lines) {
        const tokens = line.match(/.{1,5}/g);
        if (tokens) {
            for (const token of tokens) {
                const multiplier = parseInt(token.substring(1), 10);
                string += token[0].repeat(multiplier);
            }
        }
        string += "\n";
    }
    return string;
}

function run() {
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const frames = data.split("\n\n");
        let index = 0;
        const startTime = Date.now();
        let lastTick = Date.now();
        let intervalId = null;
        let paused = false;

        const tick = () => {
            const string = decompressFrame(frames[index]);
            const delta = Date.now() - lastTick;
            lastTick = Date.now();

            readline.clearLine(process.stdout, -1);
            readline.cursorTo(process.stdout, 0, 2);
            process.stdout.write(string);
            process.stdout.write(
                `Frame: ${index} (${(index / frames.length * 100).toFixed(2)}%)  |  FPS: ${(1000 / delta).toFixed(1)}  |  [Space] Pause/Resume  [Q] Quit\n`
            );

            index++;
            if (index >= frames.length) {
                index = 0;
            }
        };

        function startLoop() {
            lastTick = Date.now();
            intervalId = setInterval(tick, INTERVAL_MS);
        }

        function stopLoop() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        function togglePause() {
            paused = !paused;
            if (paused) {
                stopLoop();
                readline.cursorTo(process.stdout, 0, 3);
                process.stdout.write("  PAUSED - press Space to resume, Q to quit\n");
            } else {
                startLoop();
            }
        }

        // Keypress: Space = pause/resume, Q = quit
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (key) => {
            if (key === " " || key === "\u0020") {
                togglePause();
            } else if (key === "q" || key === "Q" || key === "\u0003") {
                stopLoop();
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.exit(0);
            }
        });

        process.on("SIGINT", () => {
            stopLoop();
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.exit(0);
        });

        console.log("  [Space] Pause/Resume  [Q] Quit\n");
        startLoop();
    });
}
