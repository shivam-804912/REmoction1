import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts so rendering works offline.
loadFont({family: 'Fredoka', url: staticFile('fonts/Fredoka.woff2'), weight: '300 700', format: 'woff2'});
loadFont({family: 'Kalam', url: staticFile('fonts/Kalam-Regular.woff2'), weight: '400', format: 'woff2'});
loadFont({family: 'Kalam', url: staticFile('fonts/Kalam-Bold.woff2'), weight: '700', format: 'woff2'});

export const FONTS = {
	display: 'Fredoka, sans-serif',
	hand: 'Kalam, cursive',
};

export const COLORS = {
	paper: '#f4ecdc',
	paperDark: '#e8dcc3',
	ink: '#2d2a32',
	inkSoft: '#5b5562',
	coral: '#ef6f5e',
	mustard: '#f2b541',
	teal: '#3aa6a0',
	sky: '#8fc9e8',
	navy: '#2f4b7c',
	mint: '#a7d8b8',
	pink: '#f4a6b8',
	white: '#fffdf7',
	brand: '#5b4bdb',
	brandLight: '#8d80f0',
	x: '#1f1f1f',
	linkedin: '#2a6fb0',
	instagram: '#d9487a',
	facebook: '#3b5fb5',
	threads: '#444444',
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

