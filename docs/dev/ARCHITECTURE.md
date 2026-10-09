# Architecture

## Scope

The [project brief](PROJECT.md) defines the complete product scope. The browser application separates a deterministic game core from browser-specific control and presentation.

## Major blocks and dependencies

The game engine owns board contents, active/next/held pieces, hold availability, per-instance bag state, lifecycle, gameplay timers, score, line count, and level. It accepts commands and elapsed-time updates and provides a read-only state view. It depends on neither the DOM, Canvas, browser events, nor browser clocks.

The browser controller translates keyboard, restart, focus, and animation-frame events into engine calls. It owns event subscriptions and scheduling, invokes presentation after state changes, and prevents browser defaults for recognized game controls. It does not duplicate rules or edit engine state directly.

Presentation reads the engine view. Canvas draws locked board cells, ghost outlines, solid active geometry and canonical next/held previews; HTML displays kind/empty/availability labels, statistics, lifecycle status and controls. Presentation cannot advance gameplay or decide collisions and locking. Browser components depend on engine contracts; the engine depends on neither browser component.

## State and time

One engine instance owns one session. A supplied conforming random source makes instance-private seven-bag selection reproducible. Pure placement queries provide a shared first-obstruction landing for ghost/drop and first-fitting horizontal rotation candidates. Game alone applies candidates, hold replacement, score and timer transitions. Explicit elapsed time allows deterministic gravity and locking checks without real timers. The controller excludes paused/unfocused time and resets its clock reference on resume.

Locking and gravity remain engine policies. A full gravity interval starts when the piece becomes grounded, is not refreshed by grounded movement or rotation, and is cancelled by becoming airborne. Rendering/input frequency cannot change this rule.

## Rationale and evolution

A browser-independent TypeScript core isolates rule changes and deterministic tests from browser integration. Canvas fits the regular grid; HTML provides readable controls and statistics. A single controller suffices. No frontend framework, event bus, network service, inheritance hierarchy, or plugin framework is required by this scope.

Hold stores only a kind; replacement owns fresh spawn timers without consuming selection on an occupied swap. Hard drop scores displacement and retains full-delay locking. These rules remain in the engine; the browser maps C/Space/P and preserves repeat/latch cleanup. No alternate baseline mode or production fixture loader is required.

## Verification seams

Engine tests supply controlled time, randomness, commands, and valid scenarios. Browser checks cover mapping, Canvas/HTML output, focus pause, restart, and scheduling. [Decomposition](DECOMPOSITION.md) details component responsibilities. [SPEC](SPEC.md) owns exact timing, scores, bag/hold consumption, spawn/rejection, snapshot and input-repeat contracts. Production fixtures preload conforming sources before engine creation and follow public commands.
