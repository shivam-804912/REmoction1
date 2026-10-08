import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBoil, usePop} from '../components/paper';

/** The prop area between the two characters, below the speech bubble. */
export const STAGE = {left: 500, top: 340, width: 920, height: 600};

export const Stage: React.FC<{duration: number; children: React.ReactNode}> = ({duration, children}) => {
	const frame = useCurrentFrame();
	const exit = interpolate(frame, [duration - 8, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: STAGE.left,
				top: STAGE.top,
				width: STAGE.width,
				height: STAGE.height,
				opacity: exit,
				transform: `translateY(${(1 - exit) * 30}px)`,
			}}
		>
			{children}
		</div>
	);
};

type PopProps = {
	delay?: number;
	/** Center position inside the stage. */
	x: number;
	y: number;
	rotate?: number;
	seed?: string;
	float?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
};

/** Pops a paper piece in with a spring, centred at (x, y), with a gentle stop-motion float. */
export const Pop: React.FC<PopProps> = ({delay = 0, x, y, rotate = 0, seed = `${x}-${y}`, float = 4, children, style}) => {
	const frame = useCurrentFrame();
	const s = usePop(delay, 11);
	const b = useBoil(seed, 1);
	const fy = Math.sin((frame + x) / 18) * float;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) translate(${b.x}px, ${b.y + fy + (1 - s) * 40}px) rotate(${rotate + b.r + (1 - s) * -20}deg) scale(${s})`,
				opacity: Math.min(1, s * 2),
				...style,
			}}
		>
			{children}
		</div>
	);
};
