/**
 * @file worker.js
 * @description Service worker for Emulatrix application
 * @handles Browser cache management and offline functionality
 * @author Emulatrix Project
 * @see https://github.com/lrusso/Emulatrix
 */

const filesToCache = [
	"/",
	"Emulatrix.css",
	"pages/Emulatrix.html",
	"assets/data/Emulatrix.json",
	"assets/images/Emulatrix1.png",
	"assets/images/Emulatrix2.png",
	"EmulatrixFavIcon_16x16.png",
	"EmulatrixFavIcon_192x192.png",
	"EmulatrixFavIcon_192x192b.png",
	"EmulatrixFavIcon_32x32.png",
	"EmulatrixFavIcon_48x48.png",
	"EmulatrixFavIcon_512x512.png",
	"EmulatrixFavIcon_512x512b.png",
	"EmulatrixFavIcon.svg",
	"assets/images/EmulatrixShare.png",
	"pages/Emulatrix_DOSBox.html",
	"Emulatrix_DOSBox.js",
	"Emulatrix_DOSBox.wasm",
	"pages/Emulatrix_GameBoy.html",
	"Emulatrix_GameBoy.js",
	"Emulatrix_GameBoy.wasm",
	"pages/Emulatrix_GameBoyAdvance.html",
	"Emulatrix_GameBoyAdvance.js",
	"Emulatrix_GameBoyAdvance.wasm",
	"pages/Emulatrix_MAME32.html",
	"Emulatrix_MAME32.js",
	"Emulatrix_MAME32.wasm",
	"pages/Emulatrix_MAME2003.html",
	"Emulatrix_MAME2003.js",
	"Emulatrix_MAME2003.wasm",
	"pages/Emulatrix_Nintendo.html",
	"Emulatrix_Nintendo.js",
	"Emulatrix_Nintendo.wasm",
	"pages/Emulatrix_SegaGenesis.html",
	"Emulatrix_SegaGenesis.js",
	"Emulatrix_SegaGenesis.wasm",
	"pages/Emulatrix_SuperNintendo.html",
	"Emulatrix_SuperNintendo.js",
	"Emulatrix_SuperNintendo.wasm",
	"index.html"
];

const staticCacheName = "emulatrix-v1";

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if (response) {
				return response;
			}
			return fetch(event.request)
		}).catch(error => {
		})
	);
});