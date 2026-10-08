import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Speaker} from '../script';
import {COLORS, FONTS} from '../theme';
import {Grain, PAPER_SHADOW, useBoil, usePop} from './paper';

type Props = {
	speaker: Speaker;
	text: string;
	duration: number;
};

const NAME: Record<Speaker, {label: string; color: string}> = {
	sheya: {label: 'Sheya', color: COLORS.coral},
	shiva: {label: 'Shiva', color: COLORS.teal},
};

export const SpeechBubble: React.FC<Props> = ({speaker, text, duration}) => {
	const frame = useCurrentFrame();
	const pop = usePop(0, 13);
	const exit = interpolate(frame, [duration - 8, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const b = useBoil(`bubble-${speaker}`, 0.6);
	const left = speaker === 'sheya';

	const words = text.split(' ');
	// Reveal words over the first ~70% of the line, like speech.
	const shown = Math.ceil(
		interpolate(frame, [4, Math.max(10, duration * 0.7)], [0, words.length], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	);

	const long = text.length > 120;
	const width = long ? 1260 : 980;
	const fontSize = long ? 40 : 48;

	return (
		<div
			style={{
				position: 'absolute',
				top: 40,
				[left ? 'left' : 'right']: 120,
				width,
				transformOrigin: left ? '15% 100%' : '85% 100%',
				transform: `translate(${b.x}px, ${b.y}px) scale(${pop * exit}) rotate(${(left ? -0.8 : 0.8) + b.r}deg)`,
				filter: PAPER_SHADOW,
			}}
		>
			<div
				style={{
					position: 'relative',
					background: COLORS.white,
					borderRadius: 34,
					padding: '30px 44px 34px',
					border: `5px solid ${NAME[speaker].color}`,
					overflow: 'hidden',
				}}
			>
				<Grain opacity={0.2} />
				<div
					style={{
						position: 'relative',
						fontFamily: FONTS.hand,
						fontWeight: 700,
						fontSize,
						lineHeight: 1.28,
						color: COLORS.ink,
					}}
				>
					{words.map((w, i) => (
						<span key={i} style={{opacity: i < shown ? 1 : 0.12}}>
							{w}{' '}
						</span>
					))}
				</div>
			</div>
			{/* name tag */}
			<div
				style={{
					position: 'absolute',
					top: -26,
					[left ? 'left' : 'right']: 40,
					background: NAME[speaker].color,
					color: COLORS.white,
					fontFamily: FONTS.display,
					fontWeight: 700,
					fontSize: 30,
					padding: '4px 22px',
					borderRadius: 12,
					transform: `rotate(${left ? -4 : 4}deg)`,
					border: `3px solid ${COLORS.white}`,
				}}
			>
				{NAME[speaker].label}
			</div>
			{/* tail */}
			<svg
				width={90}
				height={76}
				viewBox="0 0 90 76"
				style={{position: 'absolute', bottom: -66, [left ? 'left' : 'right']: 130, transform: left ? undefined : 'scaleX(-1)'}}
			>
				<path d="M4 8 L60 8 L18 72 Z" fill={COLORS.white} stroke={NAME[speaker].color} strokeWidth={5} strokeLinejoin="round" />
				<rect x={7} y={0} width={50} height={12} fill={COLORS.white} />
			</svg>
		</div>
	);
};
