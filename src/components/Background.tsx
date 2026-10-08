import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {Grain, PAPER_SHADOW, tornPolygon} from './paper';

const Cloud: React.FC<{x: number; y: number; scale: number; speed: number}> = ({x, y, scale, speed}) => {
	const frame = useCurrentFrame();
	const drift = ((x + frame * speed) % 2300) - 200;
	return (
		<svg
			width={220 * scale}
			height={110 * scale}
			viewBox="0 0 220 110"
			style={{position: 'absolute', left: drift, top: y, filter: PAPER_SHADOW, opacity: 0.9}}
		>
			<path
				d="M30 90 Q0 90 8 66 Q14 44 44 50 Q50 18 88 20 Q118 4 140 34 Q170 20 186 48 Q216 52 210 78 Q206 92 180 90 Z"
				fill={COLORS.white}
			/>
		</svg>
	);
};

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: COLORS.paper}}>
			{/* back wall layers */}
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 35%, #fbf5e8 0%, ${COLORS.paper} 55%, ${COLORS.paperDark} 100%)`}} />
			<Cloud x={100} y={70} scale={1.1} speed={0.25} />
			<Cloud x={1300} y={150} scale={0.8} speed={0.18} />
			<Cloud x={800} y={40} scale={0.6} speed={0.3} />

			{/* far hills */}
			<div
				style={{
					position: 'absolute',
					left: -40,
					right: -40,
					bottom: 120,
					height: 260,
					filter: PAPER_SHADOW,
				}}
			>
				<svg width="100%" height="100%" viewBox="0 0 2000 260" preserveAspectRatio="none">
					<path d="M0 160 Q260 40 520 140 Q760 230 1020 110 Q1300 0 1560 120 Q1800 220 2000 100 L2000 260 L0 260 Z" fill={COLORS.mint} />
				</svg>
			</div>
			<div style={{position: 'absolute', left: -40, right: -40, bottom: 90, height: 180, filter: PAPER_SHADOW}}>
				<svg width="100%" height="100%" viewBox="0 0 2000 180" preserveAspectRatio="none">
					<path d="M0 110 Q340 20 700 100 Q1040 170 1360 70 Q1700 0 2000 90 L2000 180 L0 180 Z" fill="#8cc7a2" />
				</svg>
			</div>

			{/* floor strip */}
			<div
				style={{
					position: 'absolute',
					left: -120,
					right: -120,
					bottom: -10,
					height: 140,
					filter: PAPER_SHADOW,
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						background: '#d9b98c',
						clipPath: tornPolygon('floor', 6, 40),
						position: 'relative',
					}}
				>
					<Grain opacity={0.5} />
				</div>
			</div>

			{/* small doodles */}
			{[
				{x: 70, y: 420, c: COLORS.coral},
				{x: 1840, y: 380, c: COLORS.teal},
				{x: 980, y: 1000, c: COLORS.mustard},
			].map((d, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: d.x,
						top: d.y,
						width: 22,
						height: 22,
						borderRadius: '50%',
						background: d.c,
						transform: `scale(${1 + Math.sin(frame / 20 + i) * 0.1})`,
						filter: PAPER_SHADOW,
					}}
				/>
			))}

			{/* whole-frame paper grain */}
			<Grain opacity={0.28} />
		</AbsoluteFill>
	);
};
