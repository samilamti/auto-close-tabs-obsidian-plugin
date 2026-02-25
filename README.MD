# Auto Close Tabs

An [Obsidian](https://obsidian.md/) [Plugin](https://obsidian.md/plugins) to help our sanity by ensuring our sloppy tab management doesn't come back to bite us in our butt.

## Plugin details

Zero-config plugin that closes background document tabs after 5 minutes of not looking at them.

## Building

This is a [node.js](https://nodejs.org) project.

To make changes, edit the `main.ts` file, then build the plugin using the included `build`[cmd|sh] script.

### Config

Did I mention [zero-config](#plugin-details)? If you don't think 5 minutes is a good value, take a peek at the `checkInactiveTabs` function and make your changes there.
