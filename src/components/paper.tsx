import React, {useMemo} from 'react';
import {random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../theme';

/** Stop-motion "boil": tiny offsets that change every few frames, like hand-placed paper. */
export const useBoil = (seed: string, amount = 1, step = 4) => {
	const frame = useCurrentFrame();
	const tick = Math.floor(frame / step);
	return {
		x: (random(`${seed}-x-${tick}`) - 0.5) * 2 * amount,
		y: (random(`${seed}-y-${tick}`) - 0.5) * 2 * amount,
		r: (random(`${seed}-r-${tick}`) - 0.5) * 0.8 * amount,
	};
};

/** Spring that starts at `delay` frames (relative to the current Sequence). */
export const usePop = (delay = 0, damping = 12, durationInFrames?: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping, mass: 0.7}, durationInFrames});
};

/** A jagged polygon used as a clip-path for a torn/hand-cut paper edge. */
export const tornPolygon = (seed: string, jag = 1.2, points = 18) => {
	const pts: string[] = [];
	const edge = (i: number, axis: string) => (random(`${seed}-${axis}-${i}`) - 0.5) * jag;
	for (let i = 0; i <= points; i++) pts.push(`${(i / points) * 100}% ${Math.max(0, edge(i, 't') + jag / 2)}%`);
	for (let i = 0; i <= points; i++) pts.push(`${100 - Math.max(0, edge(i, 'r') + jag / 2)}% ${(i / points) * 100}%`);
	for (let i = points; i >= 0; i--) pts.push(`${(i / points) * 100}% ${100 - Math.max(0, edge(i, 'b') + jag / 2)}%`);
	for (let i = points; i >= 0; i--) pts.push(`${Math.max(0, edge(i, 'l') + jag / 2)}% ${(i / points) * 100}%`);
	return `polygon(${pts.join(',')})`;
};

export const PAPER_SHADOW =
	'drop-shadow(0 3px 0 rgba(60,40,20,0.12)) drop-shadow(0 10px 14px rgba(60,40,20,0.22))';

type CardProps = {
	color?: string;
	width?: number | string;
	height?: number | string;
	rotate?: number;
	seed?: string;
	torn?: boolean;
	radius?: number;
	padding?: number | string;
	style?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	children?: React.ReactNode;
	boil?: number;
};

/** A cut-out piece of coloured paper with grain, a soft shadow and a slight stop-motion wobble. */
export const PaperCard: React.FC<CardProps> = ({
	color = COLORS.white,
	width,
	height,
	rotate = 0,
	seed = 'card',
	torn = false,
	radius = 14,
	padding = 24,
	style,
	innerStyle,
	children,
	boil = 0.8,
}) => {
	const b = useBoil(seed, boil);
	const clip = useMemo(() => (torn ? tornPolygon(seed) : undefined), [torn, seed]);
	return (
		<div
			style={{
				filter: PAPER_SHADOW,
				transform: `translate(${b.x}px, ${b.y}px) rotate(${rotate + b.r}deg)`,
				width,
				height,
				...style,
			}}
		>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					background: color,
					borderRadius: torn ? 0 : radius,
					clipPath: clip,
					padding,
					boxSizing: 'border-box',
					overflow: 'hidden',
					...innerStyle,
				}}
			>
				<Grain />
				<div style={{position: 'relative'}}>{children}</div>
			</div>
		</div>
	);
};

/** Fibre/grain overlay so flat colours read as paper. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.35}) => (
	<svg
		style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'multiply', opacity, pointerEvents: 'none'}}
	>
		<filter id="grain-f">
			<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} />
			<feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.35 0" />
		</filter>
		<rect width="100%" height="100%" filter="url(#grain-f)" />
	</svg>
);
