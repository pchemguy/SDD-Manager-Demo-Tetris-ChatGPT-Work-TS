/** Production acceptance in unpatched stable Firefox using Mozilla's W3C WebDriver.
 * Provide TETRIS_FIREFOX_EXECUTABLE and TETRIS_GECKODRIVER; failures never become skips.
 * These are native keyboard/tab events. Controlled randomness is preloaded before app startup; no production mutation hook exists.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { drawsForBag } from "../helpers/random.ts";
import { TEST_BAG, CLEAR_TRACE } from "../helpers/fixtures.ts";
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
            `()=>{let values=${JSON.stringify(drawsForBag(TEST_BAG))},i=0;window.__tetrisTestRandom=()=>values[i++ % values.length];Math.random=()=>window.__tetrisTestRandom();}`,
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
        "let i=0,values=arguments[0];window.__tetrisTestRandom=()=>values[i++ % values.length];document.querySelector('#restart').click();",
        [drawsForBag(TEST_BAG)],
      );
    await request(`${base}/url`, { url: "http://127.0.0.1:4173" });
    await reset();
    assert.equal(await status(), "Playing");
    assert.equal(
      await run("return document.querySelector('#next-kind').textContent"),
      "I",
    );
    // Firefox's outer-to-content offset can change after DPI-adjusted resizing.
    const viewport = async (width,height) => {
      for(let attempt=0;attempt<4;attempt++){
        const d=await run("return {w:innerWidth,h:innerHeight,outerW:outerWidth,outerH:outerHeight}");
        if(d.w===width&&d.h===height)return;
        await request(`${base}/window/rect`,{width:d.outerW+width-d.w,height:d.outerH+height-d.h});await delay(100);
      }
      const d=await run("return {w:innerWidth,h:innerHeight}");assert.equal(d.w,width);assert.equal(d.h,height);
    };
    for (const size of [
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await viewport(size.width,size.height);
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
    // Both independent stable sessions exercise feature consumers with native keys.
    const text = (id) => run("return document.querySelector('#'+arguments[0]).textContent",[id]);
    const centers = () => run("const c=document.querySelector('#board'),ctx=c.getContext('2d'),points=[];for(let y=0;y<20;y++)for(let x=0;x<10;x++){const d=Array.from(ctx.getImageData((x+.5)*c.width/10,(y+.5)*c.height/20,1,1).data).slice(0,3);if(d[0]!==16)points.push({x,y,color:d});}return points");
    await reset();
    assert.equal(await text("held-kind"),"Empty");
    const ghost=await run("const c=document.querySelector('#board');return Array.from(c.getContext('2d').getImageData(c.width*4.07/10,c.height*18.5/20,1,1).data).slice(0,3)");
    assert.deepEqual(ghost,[185,197,213]);
    await keys([{type:"keyDown",value:"c"},{type:"keyDown",value:" "},{type:"pause",duration:1200}]);
    assert.equal(await text("held-kind"),"O");
    assert.equal(await text("next-kind"),"S");
    assert.equal(await text("score"),"36");
    assert.equal(await text("hold-availability"),"Available · C");
    await keys([{type:"keyDown",value:"c"},{type:"keyDown",value:" "}]);
    assert.equal(await text("held-kind"),"O");assert.equal(await text("score"),"36");
    await keys([{type:"keyUp",value:"c"},{type:"keyUp",value:" "}]);
    await press("C");assert.equal(await text("held-kind"),"T");assert.equal(await text("next-kind"),"S");
    await press("p");assert.equal(await text("hold-availability"),"Unavailable while paused");
    await viewport(1024,768);
    const heldGeometry=await run("const c=document.querySelector('#held-preview'),r=c.getBoundingClientRect(),f=document.querySelector('footer').getBoundingClientRect();return {w:c.width,h:c.height,css:r.width,bottom:f.bottom,view:innerHeight,color:Array.from(c.getContext('2d').getImageData(c.width*.5,c.height*.55,1,1).data).slice(0,3),instructions:document.querySelector('#instructions').textContent}");
    assert.equal(heldGeometry.w,Math.round(heldGeometry.css*ratio));assert.equal(heldGeometry.h,heldGeometry.w);
    console.log("Firefox held geometry",JSON.stringify(heldGeometry));await screenshot("held-paused");
    assert(heldGeometry.bottom<=heldGeometry.view);for(const key of ["Space","C","P"])assert(heldGeometry.instructions.includes(key));
    // Sample a filled T cell interior, rather than a background or grid gap.
    assert.deepEqual(heldGeometry.color,[177,154,234]);await screenshot("held-paused");
    await reset();assert.equal(await text("held-kind"),"Empty");
    await press("c");await press("\uE013");
    await keys(Array.from({length:5},()=>[{type:"keyDown",value:"\uE012"},{type:"keyUp",value:"\uE012"}]).flat());
    await press("\uE013");
    assert.deepEqual((await centers()).filter(p=>p.color[0]===83).map(({x,y})=>({x,y})),[{x:0,y:2},{x:1,y:2},{x:2,y:2},{x:3,y:2}]);
    await screenshot("wall-kick");
    await reset();await press("c");await press(" ");
    assert.equal(await text("score"),"36");assert.equal(await text("next-kind"),"T");
    const dropped=await centers();await press("\uE013");assert.deepEqual(await centers(),dropped,"Floor-only rotation must fail without translation");
    await delay(1100);assert.equal(await text("next-kind"),"S");
    await reset();
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
        { type: "keyDown", value: "p" },
        { type: "pause", duration: 1200 },
        { type: "keyDown", value: "p" },
        { type: "pause", duration: 200 },
        { type: "keyUp", value: "p" },
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
      await press("p");
      assert.equal(await status(), "Playing");
      // Switching actual Firefox tabs causes native blur/visibility, without synthetic events.
      const main = await request(`${base}/window`);
      const other = await request(`${base}/window/new`, { type: "tab" });
      await request(`${base}/window`, { handle: other.handle });
      await delay(200);
      await request(`${base}/window`, { handle: main });
      assert.equal(await status(), "Paused");
      assert.equal(await run("return document.hidden"), false);
      await press("p");
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
      // Validate the actual active color and next kind before every native placement.
      await reset();
      const colors={O:244,I:83,T:177,S:131,Z:238,J:125,L:238};
      for(const [index,step] of CLEAR_TRACE.slice(0,32).entries()){
        assert.equal(await text("next-kind"),TEST_BAG[(index+1)%7]);
        assert.deepEqual((await centers()).filter(p=>p.y<5).map(p=>p.color[0]),Array(4).fill(colors[step.kind]));
        const origin=step.kind==="O"?4:3,horizontal=step.x<origin?"\uE012":"\uE014";
        const sequence=[...Array(step.orientation).fill("\uE013"),...Array(Math.abs(step.x-origin)).fill(horizontal)," "];
        await keys(sequence.flatMap(value=>[{type:"keyDown",value},{type:"keyUp",value}]));
        await delay(1050);
        assert.equal(await text("lines"),String(step.total));assert.equal(await text("level"),step.total<10?"1":"2");
      }
      await screenshot("level-two");console.log("Firefox DPR 1 native progression: eleven lines, level two");
      await reset();
      await press("c");
      await hold("\uE015", 20000);
      assert.equal(await status(), "Game over");
      assert.equal(await text("held-kind"),"O");assert.equal(await text("hold-availability"),"Unavailable after game over");
      const ghostCount=await run("const c=document.querySelector('#board'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]===185&&d[i+1]===197&&d[i+2]===213)n++;return n");assert.equal(ghostCount,0);
      await screenshot("game-over");
      await reset();
      assert.equal(await status(), "Playing");
      // A valid fresh I-first bag permits observing clockwise rotation through pixels.
      await run(
        "let i=0,values=arguments[0];window.__tetrisTestRandom=()=>values[i++ % values.length];document.querySelector('#restart').click();",
        [drawsForBag(["I","O","T","S","Z","J","L"])],
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
          ? "production load, native controls/repeat/priority/release, pause/wait/resume, native tab visibility, keyboard restart, native eleven-line level transition with verified piece identities, held top-out, rotation/lock/spawn, hold/ghost/delayed drop/kicks and one-shot latches, resize/pixels"
          : "second independent session, minimum/resized desktop, square board/next/held, DPR backing/pixels, hold/ghost/drop/kicks and one-shot latches, paused labels/instructions",
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
