/** Production acceptance in unpatched stable Firefox using Mozilla's W3C WebDriver.
 * Provide TETRIS_FIREFOX_EXECUTABLE and TETRIS_GECKODRIVER; failures never become skips.
 * These are native keyboard/tab events. Controlled randomness is preloaded before app startup; no production mutation hook exists.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const binary = process.env.TETRIS_FIREFOX_EXECUTABLE,
  gecko = process.env.TETRIS_GECKODRIVER;
assert(
  binary && gecko,
  "Stable Firefox checks require TETRIS_FIREFOX_EXECUTABLE and TETRIS_GECKODRIVER",
);
await mkdir("test-results", { recursive: true });
const server = spawn(process.execPath, [
  "node_modules/vite/bin/vite.js",
  "preview",
  "--host",
  "127.0.0.1",
  "--port",
  "4173",
  "--strictPort",
]);
const driver = spawn(gecko, ["--port", "4444"], { env: process.env });
let logs = "";
for (const child of [server, driver]) {
  child.stdout.on("data", (chunk) => {
    logs += chunk;
  });
  child.stderr.on("data", (chunk) => {
    logs += chunk;
  });
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function request(
  path,
  data,
  method = data === undefined ? "GET" : "POST",
) {
  const response = await fetch(`http://127.0.0.1:4444${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(40000),
  });
  const json = await response.json();
  assert(response.ok, JSON.stringify(json));
  return json.value;
}
let session, socket;
const results = [];
/** Add a test-only random source before any application script captures Math.random. */
async function preload(url) {
  socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
    setTimeout(() => reject(Error("BiDi connection timeout")), 10000).unref();
  });
  const result = await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(Error("BiDi preload timeout")),
      10000,
    );
    socket.addEventListener("message", (event) => {
      const response = JSON.parse(event.data);
      if (response.id === 1) {
        clearTimeout(timeout);
        if (response.type === "error") reject(Error(JSON.stringify(response)));
        else resolve(response);
      }
    });
    socket.send(
      JSON.stringify({
        id: 1,
        method: "script.addPreloadScript",
        params: {
          functionDeclaration:
            "()=>{window.__tetrisTestRandom=()=>.15;Math.random=()=>window.__tetrisTestRandom();}",
        },
      }),
    );
  });
  assert(result.result.script, "BiDi did not confirm preload");
}

try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      await request("/status");
      const response = await fetch("http://127.0.0.1:4173");
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(100);
  }
  assert(ready, "Static server/geckodriver did not become ready");
  for (const ratio of [1, 2]) {
    const created = await request("/session", {
      capabilities: {
        alwaysMatch: {
          browserName: "firefox",
          webSocketUrl: true,
          "moz:firefoxOptions": {
            binary,
            args: ["-headless"],
            prefs: { "layout.css.devPixelsPerPx": String(ratio) },
          },
        },
      },
    });
    session = created.sessionId;
    await preload(created.capabilities.webSocketUrl);
    const base = `/session/${session}`;
    const run = (script, args = []) =>
      request(`${base}/execute/sync`, { script, args });
    const status = () =>
      run("return document.querySelector('#status').textContent");
    const keys = (actions) =>
      request(`${base}/actions`, {
        actions: [{ type: "key", id: "keyboard", actions }],
      });
    const press = (key) =>
      keys([
        { type: "keyDown", value: key },
        { type: "keyUp", value: key },
      ]);
    const hold = (key, ms) =>
      keys([
        { type: "keyDown", value: key },
        { type: "pause", duration: ms },
        { type: "keyUp", value: key },
      ]);
    const screenshot = async (name) =>
      writeFile(
        `test-results/firefox-${name}-dpr-${ratio}.png`,
        Buffer.from(await request(`${base}/screenshot`), "base64"),
      );
    const reset = () =>
      run(
        "window.__tetrisTestRandom=()=>0.15;document.querySelector('#restart').click();",
      );
    await request(`${base}/url`, { url: "http://127.0.0.1:4173" });
    await reset();
    assert.equal(await status(), "Playing");
    assert.equal(
      await run("return document.querySelector('#next-kind').textContent"),
      "O",
    );
    const offset = await run(
      "return {x:outerWidth-innerWidth,y:outerHeight-innerHeight}",
    );
    for (const size of [
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await request(`${base}/window/rect`, {
        width: size.width + offset.x,
        height: size.height + offset.y,
      });
      await delay(100);
      // Firefox toolbar geometry can change after the first DPI-adjusted resize.
      for (let attempt = 0; attempt < 3; attempt++) {
        const dimensions = await run(
          "return {w:innerWidth,h:innerHeight,outerW:outerWidth,outerH:outerHeight}",
        );
        if (dimensions.w >= size.width && dimensions.h >= size.height) break;
        await request(`${base}/window/rect`, {
          width: dimensions.outerW + size.width - dimensions.w,
          height: dimensions.outerH + size.height - dimensions.h,
        });
        await delay(100);
      }
      const measured = await run(
        `const c=document.querySelector('#board'),p=document.querySelector('#preview'),r=c.getBoundingClientRect(),b=document.querySelector('#restart').getBoundingClientRect();let colored=0;const ctx=c.getContext('2d');for(let y=0;y<20;y++)for(let x=0;x<10;x++)if(ctx.getImageData((x+.5)*c.width/10,(y+.5)*c.height/20,1,1).data[0]!==16)colored++;return {w:r.width,h:r.height,backing:c.width,backingH:c.height,dpr:devicePixelRatio,viewW:innerWidth,viewH:innerHeight,bottom:r.bottom,buttonBottom:b.bottom,colored,preview:p.width};`,
      );
      console.log("Firefox geometry", JSON.stringify(measured));
      assert.equal(measured.dpr, ratio);
      assert.equal(measured.backing, Math.round(measured.w * ratio));
      assert.equal(measured.backingH, measured.backing * 2);
      assert(Math.abs(measured.h - measured.w * 2) < 0.001);
      assert(measured.viewW >= size.width && measured.viewH >= size.height);
      assert(
        measured.bottom <= measured.viewH &&
          measured.buttonBottom <= measured.viewH,
      );
      assert.equal(measured.colored, 4);
      assert.equal(measured.preview, 96 * ratio);
      await screenshot(`desktop-${size.width}`);
    }
    if (ratio === 1) {
      const leftmost = () =>
        run(
          "const c=document.querySelector('#board'),ctx=c.getContext('2d');let left=10;for(let y=0;y<5;y++)for(let x=0;x<10;x++)if(ctx.getImageData((x+.5)*c.width/10,(y+.5)*c.height/20,1,1).data[0]!==16)left=Math.min(left,x);return left",
        );
      await reset();
      await hold("\uE012", 350);
      assert.equal(await leftmost(), 0);
      await keys([
        { type: "keyDown", value: "\uE012" },
        { type: "keyDown", value: "\uE014" },
        { type: "pause", duration: 200 },
        { type: "keyUp", value: "\uE014" },
        { type: "pause", duration: 190 },
        { type: "keyUp", value: "\uE012" },
      ]);
      assert(
        (await leftmost()) > 0 && (await leftmost()) < 4,
        "Opposing-key release should reactivate left",
      );
      await hold("\uE015", 180);
      const score = await run(
        "return Number(document.querySelector('#score').textContent)",
      );
      assert(score >= 3);
      await delay(100);
      assert.equal(
        await run(
          "return Number(document.querySelector('#score').textContent)",
        ),
        score,
      );
      assert.equal(await run("return scrollY"), 0);
      await keys([
        { type: "keyDown", value: " " },
        { type: "pause", duration: 1200 },
        { type: "keyDown", value: " " },
        { type: "pause", duration: 200 },
        { type: "keyUp", value: " " },
      ]);
      assert.equal(await status(), "Paused");
      const before = await request(`${base}/screenshot`);
      await delay(1200);
      assert.equal(
        Buffer.compare(
          Buffer.from(await request(`${base}/screenshot`), "base64"),
          Buffer.from(before, "base64"),
        ),
        0,
        "Paused image must remain unchanged",
      );
      await screenshot("paused");
      await press(" ");
      assert.equal(await status(), "Playing");
      // Switching actual Firefox tabs causes native blur/visibility, without synthetic events.
      const main = await request(`${base}/window`);
      const other = await request(`${base}/window/new`, { type: "tab" });
      await request(`${base}/window`, { handle: other.handle });
      await delay(200);
      await request(`${base}/window`, { handle: main });
      assert.equal(await status(), "Paused");
      assert.equal(await run("return document.hidden"), false);
      await press(" ");
      assert.equal(await status(), "Playing");
      await reset();
      await press("\uE015");
      assert.equal(
        await run("return document.querySelector('#score').textContent"),
        "1",
      );
      await press("\uE004");
      assert.equal(await run("return document.activeElement.id"), "restart");
      await press("\uE007");
      assert.equal(
        await run("return document.querySelector('#score').textContent"),
        "0",
      );
      await hold("\uE015", 20000);
      assert.equal(await status(), "Game over");
      await screenshot("game-over");
      await reset();
      assert.equal(await status(), "Playing");
      // Horizontal I then repeated O permits observing clockwise rotation through pixels.
      await run(
        "let first=true;window.__tetrisTestRandom=()=>{if(first){first=false;return 0;}return .15;};document.querySelector('#restart').click();",
      );
      const initial = await request(`${base}/screenshot`);
      await press("\uE013");
      assert.notEqual(
        Buffer.compare(
          Buffer.from(await request(`${base}/screenshot`), "base64"),
          Buffer.from(initial, "base64"),
        ),
        0,
        "Clockwise I rotation must change the image",
      );
      await hold("\uE015", 1200);
      await delay(1100);
      assert(
        (await run(
          "return Number(document.querySelector('#score').textContent)",
        )) > 0,
      );
      const cells = await run(
        "const c=document.querySelector('#board'),ctx=c.getContext('2d');let top=0,bottom=0;for(let y=0;y<20;y++)for(let x=0;x<10;x++)if(ctx.getImageData((x+.5)*c.width/10,(y+.5)*c.height/20,1,1).data[0]!==16){if(y<5)top++;if(y>14)bottom++;}return {top,bottom}",
      );
      assert.equal(cells.top, 4);
      assert.equal(cells.bottom, 4);
    }
    results.push({
      version: created.capabilities.browserVersion,
      ratio,
      checks:
        ratio === 1
          ? "production load, native controls/repeat/priority/release, pause/wait/resume, native tab visibility, keyboard restart, top-out, rotation/lock/spawn, resize/pixels"
          : "second independent session, minimum/resized desktop, square board/preview, DPR backing/pixels",
    });
    socket.close();
    socket = undefined;
    await request(base, undefined, "DELETE");
    session = undefined;
  }
  await writeFile(
    "test-results/stable-firefox.json",
    JSON.stringify(results, null, 2),
  );
  console.log("Stable Firefox acceptance passed:", JSON.stringify(results));
} finally {
  if (session)
    try {
      await request(`/session/${session}`, undefined, "DELETE");
    } catch {}
  socket?.close();
  driver.kill();
  server.kill();
  await writeFile("test-results/stable-firefox.log", logs);
}
