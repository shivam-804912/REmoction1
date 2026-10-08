export type Speaker = 'sheya' | 'shiva';

export type Emotion = 'neutral' | 'curious' | 'happy' | 'surprised' | 'excited' | 'confident';

export type SceneKey =
	| 'chaos'
	| 'reveal'
	| 'question'
	| 'idea'
	| 'separate'
	| 'steps'
	| 'aiQuestion'
	| 'aiConnect'
	| 'summary'
	| 'tagline'
	| 'wantIt'
	| 'outro';

export type Line = {
	speaker: Speaker;
	text: string;
	scene: SceneKey;
	emotion: Emotion;
	listenerEmotion: Emotion;
	/** Extra frames on top of the auto-computed reading time. */
	extra?: number;
};

export const SCRIPT: Line[] = [
	{
		speaker: 'sheya',
		text: 'Shiva, tum roz itne saare social media posts kaise manage kar lete ho? X, LinkedIn, Instagram… itna sab manually kaise?',
		scene: 'chaos',
		emotion: 'curious',
		listenerEmotion: 'neutral',
	},
	{
		speaker: 'shiva',
		text: 'Main manually nahi karta, Sheya. Ye dekho — PostMCP AI.',
		scene: 'reveal',
		emotion: 'confident',
		listenerEmotion: 'surprised',
		extra: 20,
	},
	{
		speaker: 'sheya',
		text: 'PostMCP? Ye kya karta hai?',
		scene: 'question',
		emotion: 'curious',
		listenerEmotion: 'happy',
	},
	{
		speaker: 'shiva',
		text: 'Simple hai. Main bas ek idea deta hoon — jaise, ‘Humara new product Friday ko launch ho raha hai.’ PostMCP usi idea ko X, LinkedIn, Instagram aur baaki platforms ke liye alag-alag style mein ready kar deta hai.',
		scene: 'idea',
		emotion: 'happy',
		listenerEmotion: 'curious',
		extra: 30,
	},
	{
		speaker: 'sheya',
		text: 'Phir har jagah separately post karna padta hai?',
		scene: 'separate',
		emotion: 'curious',
		listenerEmotion: 'neutral',
	},
	{
		speaker: 'shiva',
		text: 'Nahi! Accounts connect karo, posts review karo, time select karo… aur schedule. Bas.',
		scene: 'steps',
		emotion: 'confident',
		listenerEmotion: 'surprised',
		extra: 30,
	},
	{
		speaker: 'sheya',
		text: 'Wait… aur ye AI ke saath bhi work karta hai?',
		scene: 'aiQuestion',
		emotion: 'surprised',
		listenerEmotion: 'happy',
	},
	{
		speaker: 'shiva',
		text: 'Exactly! ChatGPT, Claude ya Cursor ko PostMCP se connect karo, aur simply bolo — ‘Mera launch post kal 9 baje schedule kar do.’ AI tools PostMCP ke through social accounts ke saath kaam kar sakte hain.',
		scene: 'aiConnect',
		emotion: 'excited',
		listenerEmotion: 'surprised',
		extra: 30,
	},
	{
		speaker: 'sheya',
		text: 'Okay… so basically ek idea, aur baaki ka kaam PostMCP?',
		scene: 'summary',
		emotion: 'happy',
		listenerEmotion: 'happy',
	},
	{
		speaker: 'shiva',
		text: 'Exactly. Social media manage karna hai, social media ke peeche bhaagna nahi.',
		scene: 'tagline',
		emotion: 'confident',
		listenerEmotion: 'happy',
		extra: 20,
	},
	{
		speaker: 'sheya',
		text: 'Okay Shiva… ab mujhe bhi PostMCP chahiye!',
		scene: 'wantIt',
		emotion: 'excited',
		listenerEmotion: 'happy',
	},
	{
		speaker: 'shiva',
		text: 'Then you know where to start — PostMCP AI.',
		scene: 'outro',
		emotion: 'happy',
		listenerEmotion: 'excited',
		extra: 60,
	},
];

export const INTRO_FRAMES = 75;

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Reading/speaking time: ~2.6 words per second plus breathing room. */
export const lineDuration = (line: Line) =>
	Math.round(36 + wordCount(line.text) * 11.5 + (line.extra ?? 0));

export type TimedLine = Line & {from: number; duration: number; index: number};

export const TIMELINE: TimedLine[] = (() => {
	let cursor = INTRO_FRAMES;
	return SCRIPT.map((line, index) => {
		const duration = lineDuration(line);
		const timed = {...line, from: cursor, duration, index};
		cursor += duration;
		return timed;
	});
})();

export const TOTAL_FRAMES =
	TIMELINE[TIMELINE.length - 1].from + TIMELINE[TIMELINE.length - 1].duration;
