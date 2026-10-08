import React from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {Character} from './components/Character';
import {SpeechBubble} from './components/SpeechBubble';
import {Intro} from './Intro';
import {SCENES} from './scenes/Scenes';
import {Stage} from './scenes/Stage';
import {INTRO_FRAMES, TIMELINE, TOTAL_FRAMES} from './script';
import type {Emotion, Speaker} from './script';

const CHARACTER_HEIGHT = 640;

const useCharacterState = (who: Speaker) => {
	const frame = useCurrentFrame();
	const line = TIMELINE.find((l) => frame >= l.from && frame < l.from + l.duration);
	if (!line) return {talking: false, emotion: 'neutral' as Emotion, lineFrame: frame};
	const isSpeaker = line.speaker === who;
	// Speaking stops a little before the bubble closes.
	const talking = isSpeaker && frame - line.from < line.duration * 0.72;
	return {
		talking,
		emotion: isSpeaker ? line.emotion : line.listenerEmotion,
		lineFrame: frame - line.from,
	};
};

export const PostMCPExplainer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sheya = useCharacterState('sheya');
	const shiva = useCharacterState('shiva');

	// Characters slide in at the end of the intro.
	const enterSheya = spring({frame: frame - (INTRO_FRAMES - 30), fps, config: {damping: 14}});
	const enterShiva = spring({frame: frame - (INTRO_FRAMES - 22), fps, config: {damping: 14}});

	const fadeOut = interpolate(frame, [TOTAL_FRAMES - 15, TOTAL_FRAMES], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{opacity: fadeOut, background: '#000'}}>
			<Background />

			<Sequence durationInFrames={INTRO_FRAMES} layout="none">
				<Intro duration={INTRO_FRAMES} />
			</Sequence>

			{TIMELINE.map((line) => {
				const Scene = SCENES[line.scene];
				return (
					<Sequence key={line.index} from={line.from} durationInFrames={line.duration} layout="none">
						<Stage duration={line.duration}>
							<Scene duration={line.duration} />
						</Stage>
					</Sequence>
				);
			})}

			<div style={{position: 'absolute', left: 120, bottom: 40, transform: `translateX(${(1 - enterSheya) * -700}px)`}}>
				<Character kind="sheya" height={CHARACTER_HEIGHT} {...sheya} />
			</div>
			<div style={{position: 'absolute', right: 120, bottom: 40, transform: `translateX(${(1 - enterShiva) * 700}px)`}}>
				<Character kind="shiva" flip height={CHARACTER_HEIGHT} {...shiva} />
			</div>

			{TIMELINE.map((line) => (
				<Sequence key={`b-${line.index}`} from={line.from} durationInFrames={line.duration} layout="none">
					<SpeechBubble speaker={line.speaker} text={line.text} duration={line.duration} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
