import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Emotion} from '../script';
import {COLORS} from '../theme';

export type CharacterKind = 'sheya' | 'shiva';

type Look = {
	skin: string;
	skinShade: string;
	hair: string;
	top: string;
	topShade: string;
	pants: string;
	shoes: string;
	accent: string;
};

const LOOKS: Record<CharacterKind, Look> = {
	sheya: {
		skin: '#e6b08c',
		skinShade: '#d39674',
		hair: '#3b2420',
		top: COLORS.coral,
		topShade: '#d65a4a',
		pants: COLORS.navy,
		shoes: '#f7f2e6',
		accent: COLORS.mustard,
	},
	shiva: {
		skin: '#c98d65',
		skinShade: '#b47852',
		hair: '#221a1a',
		top: COLORS.teal,
		topShade: '#2e8a85',
		pants: '#4a4152',
		shoes: '#2d2a32',
		accent: COLORS.white,
	},
};

type Props = {
	kind: CharacterKind;
	talking: boolean;
	emotion: Emotion;
	/** Frame offset into the current line, used for gesture entrances. */
	lineFrame: number;
	/** Mirror horizontally so the character faces left. */
	flip?: boolean;
	height?: number;
};

const SHADOW = 'url(#cut-shadow)';

export const Character: React.FC<Props> = ({kind, talking, emotion, lineFrame, flip = false, height = 640}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const look = LOOKS[kind];
	const seed = kind;

	// Stop-motion stepping (animate "on twos/threes")
	const step = Math.floor(frame / 3);

	// Idle breathing + bob
	const breathe = Math.sin(frame / 14 + (kind === 'shiva' ? 1.5 : 0)) * 0.012;
	const bob = Math.sin(frame / 14 + (kind === 'shiva' ? 1.5 : 0)) * 3;

	// Blink every ~3 seconds
	const blinkCycle = (frame + (kind === 'shiva' ? 37 : 0)) % 96;
	const blink = blinkCycle < 4 ? 0.12 : 1;

	// Mouth while talking: random openness changing every 3 frames
	const mouthOpen = talking ? 0.25 + random(`${seed}-mouth-${step}`) * 0.75 : 0;

	// Gesture entrance at the start of each line
	const enter = spring({frame: lineFrame, fps, config: {damping: 14, mass: 0.8}});
	const wobble = Math.sin(frame / 6) * 6;

	const excited = emotion === 'excited';
	const surprised = emotion === 'surprised';

	let frontArm: number;
	let backArm: number;
	if (talking) {
		frontArm = interpolate(enter, [0, 1], [8, excited ? -125 : -62]) + wobble;
		backArm = excited ? interpolate(enter, [0, 1], [-8, 120]) - wobble : -6 + Math.sin(frame / 9) * 3;
	} else if (excited) {
		frontArm = interpolate(enter, [0, 1], [8, -120]) + wobble;
		backArm = interpolate(enter, [0, 1], [-8, 115]) - wobble;
	} else if (surprised) {
		frontArm = interpolate(enter, [0, 1], [8, -30]);
		backArm = interpolate(enter, [0, 1], [-8, 30]);
	} else if (emotion === 'curious') {
		frontArm = interpolate(enter, [0, 1], [8, -28]) + Math.sin(frame / 12) * 3;
		backArm = -6;
	} else {
		frontArm = 8 + Math.sin(frame / 20) * 2;
		backArm = -6 - Math.sin(frame / 20) * 2;
	}

	// Head tilt
	const headTilt =
		(emotion === 'curious' ? -7 : emotion === 'happy' || emotion === 'excited' ? 4 : 0) + Math.sin(frame / 25) * 1.5;

	// Brows
	const browLift = surprised || excited ? -10 : emotion === 'curious' ? -4 : 0;
	const browTiltL = emotion === 'curious' ? -8 : emotion === 'confident' ? 4 : 0;
	const browTiltR = emotion === 'curious' ? 10 : emotion === 'confident' ? -4 : 0;

	// Jump when excited
	const hop = excited ? Math.abs(Math.sin((lineFrame / fps) * Math.PI * 2.2)) * -18 * Math.min(1, lineFrame / 10) : 0;

	const smile = emotion === 'happy' || emotion === 'excited' || emotion === 'confident';

	const mouth = (() => {
		if (mouthOpen > 0) {
			const h = 6 + mouthOpen * 18;
			return (
				<g>
					<ellipse cx={196} cy={222} rx={15} ry={h / 2 + 2} fill="#6b2b2f" />
					<ellipse cx={196} cy={222 + h / 3} rx={9} ry={Math.max(2, h / 5)} fill="#e7737b" />
				</g>
			);
		}
		if (surprised) return <ellipse cx={196} cy={224} rx={9} ry={11} fill="#6b2b2f" />;
		if (smile)
			return (
				<path d="M176 214 Q196 238 216 214 Q196 226 176 214 Z" fill="#6b2b2f" stroke="#6b2b2f" strokeWidth={3} strokeLinejoin="round" />
			);
		return <path d="M182 220 Q196 228 210 220" stroke="#6b2b2f" strokeWidth={5} fill="none" strokeLinecap="round" />;
	})();

	const eye = (cx: number) => (
		<g transform={`translate(${cx} 176) scale(1 ${blink}) translate(${-cx} -176)`}>
			<ellipse cx={cx} cy={176} rx={10} ry={surprised ? 14 : 12} fill={COLORS.ink} />
			<circle cx={cx + 3} cy={171} r={3.5} fill="#fff" />
		</g>
	);

	const arm = (shoulderX: number, angle: number, front: boolean) => (
		<g transform={`rotate(${angle} ${shoulderX} 286)`} filter={SHADOW}>
			<rect x={shoulderX - 21} y={268} width={42} height={120} rx={21} fill={front ? look.top : look.topShade} />
			<rect x={shoulderX - 16} y={360} width={32} height={78} rx={16} fill={look.skin} />
			<circle cx={shoulderX} cy={444} r={21} fill={look.skin} />
			{kind === 'shiva' ? (
				<rect x={shoulderX - 22} y={356} width={44} height={12} rx={4} fill={look.topShade} />
			) : (
				<rect x={shoulderX - 18} y={410} width={36} height={8} rx={4} fill={look.accent} />
			)}
		</g>
	);

	const hairBack =
		kind === 'sheya' ? (
			<path
				d="M92 160 Q86 70 180 62 Q276 60 274 170 L286 330 Q240 352 196 336 L170 336 Q120 352 80 328 Z"
				fill={look.hair}
				filter={SHADOW}
			/>
		) : null;

	const hairFront =
		kind === 'sheya' ? (
			<g filter={SHADOW}>
				<path d="M96 168 Q92 76 186 70 Q272 72 270 162 Q236 104 168 112 Q130 118 96 168 Z" fill={look.hair} />
				<path d="M172 82 Q232 90 262 150 Q214 118 170 120 Z" fill="#4a2e29" />
				<circle cx={238} cy={86} r={20} fill={COLORS.mustard} />
			</g>
		) : (
			<g filter={SHADOW}>
				<path d="M98 168 Q90 70 190 66 Q262 66 272 128 Q284 146 268 160 Q250 110 196 116 Q140 108 112 150 Z" fill={look.hair} />
				<path d="M150 74 Q210 34 262 80 Q228 70 196 84 Z" fill={look.hair} />
			</g>
		);

	const extras =
		kind === 'sheya' ? (
			<g>
				<circle cx={104} cy={210} r={7} fill={COLORS.mustard} />
				<circle cx={104} cy={226} r={9} fill={COLORS.mustard} />
			</g>
		) : (
			<path d="M174 210 Q196 200 218 210 Q214 216 196 212 Q178 216 174 210 Z" fill={look.hair} />
		);

	return (
		<svg
			viewBox="0 0 360 720"
			style={{
				height,
				width: (height * 360) / 720,
				overflow: 'visible',
				transform: `translateY(${bob + hop}px) scaleX(${flip ? -1 : 1})`,
			}}
		>
			<defs>
				<filter id="cut-shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow dx={0} dy={4} stdDeviation={2.5} floodColor="#3c2814" floodOpacity={0.28} />
				</filter>
			</defs>

			{/* ground shadow */}
			<ellipse cx={180} cy={704} rx={130} ry={16} fill="#3c2814" opacity={0.15} />

			{/* legs */}
			<g filter={SHADOW}>
				<rect x={124} y={470} width={50} height={210} rx={16} fill={look.pants} />
				<rect x={186} y={470} width={50} height={210} rx={16} fill={look.pants} />
				<ellipse cx={146} cy={688} rx={38} ry={18} fill={look.shoes} />
				<ellipse cx={218} cy={688} rx={38} ry={18} fill={look.shoes} />
			</g>

			{hairBack}

			{/* back arm */}
			{arm(92, backArm, false)}

			{/* torso */}
			<g transform={`translate(180 480) scale(1 ${1 + breathe}) translate(-180 -480)`} filter={SHADOW}>
				<path d="M96 300 Q96 252 150 246 L210 246 Q264 252 264 300 L258 500 L102 500 Z" fill={look.top} />
				{kind === 'shiva' ? (
					<g>
						<path d="M150 246 L180 290 L210 246 Z" fill={COLORS.white} />
						<path d="M150 246 L168 280 L140 268 Z M210 246 L192 280 L220 268 Z" fill={look.topShade} />
						<line x1={180} y1={292} x2={180} y2={496} stroke={look.topShade} strokeWidth={4} />
						<circle cx={180} cy={330} r={4} fill={COLORS.white} />
						<circle cx={180} cy={380} r={4} fill={COLORS.white} />
						<circle cx={180} cy={430} r={4} fill={COLORS.white} />
					</g>
				) : (
					<g>
						<path d="M152 246 Q180 284 208 246 Z" fill={look.skin} />
						<path d="M102 440 L258 440 L258 470 L102 470 Z" fill={look.accent} />
					</g>
				)}
			</g>

			{/* neck + head */}
			<g transform={`rotate(${headTilt} 180 250)`}>
				<rect x={160} y={220} width={40} height={40} fill={look.skinShade} />
				<g filter={SHADOW}>
					<ellipse cx={100} cy={186} rx={14} ry={20} fill={look.skinShade} />
					<ellipse cx={184} cy={168} rx={88} ry={94} fill={look.skin} />
				</g>
				{extras}
				{hairFront}
				{/* cheeks */}
				<ellipse cx={142} cy={206} rx={14} ry={8} fill={COLORS.coral} opacity={0.35} />
				<ellipse cx={236} cy={206} rx={14} ry={8} fill={COLORS.coral} opacity={0.35} />
				{/* brows */}
				<g transform={`translate(0 ${browLift})`}>
					<rect x={148} y={146} width={28} height={7} rx={3.5} fill={look.hair} transform={`rotate(${browTiltL} 162 150)`} />
					<rect x={206} y={146} width={28} height={7} rx={3.5} fill={look.hair} transform={`rotate(${browTiltR} 220 150)`} />
				</g>
				{eye(162)}
				{eye(220)}
				<path d="M194 186 Q200 200 190 202" stroke={look.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
				{mouth}
			</g>

			{/* front arm */}
			{arm(268, frontArm, true)}
		</svg>
	);
};
