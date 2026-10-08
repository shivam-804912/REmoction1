import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PostMCPLogo} from './components/Icons';
import {PaperCard, usePop} from './components/paper';
import {COLORS, FONTS} from './theme';

export const Intro: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const a = usePop(2, 11);
	const b = usePop(12, 11);
	const exit = interpolate(frame, [duration - 12, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 30,
				opacity: exit,
				transform: `translateY(${(1 - exit) * -60}px)`,
				paddingBottom: 220,
			}}
		>
			<div style={{transform: `scale(${a}) rotate(${(1 - a) * -15}deg)`}}>
				<PaperCard padding="34px 54px" seed="intro-logo" radius={36} rotate={-2}>
					<PostMCPLogo size={120} />
				</PaperCard>
			</div>
			<div style={{transform: `scale(${b}) rotate(${(1 - b) * 15}deg)`}}>
				<PaperCard color={COLORS.coral} padding="12px 40px" seed="intro-sub" torn rotate={2}>
					<div style={{fontFamily: FONTS.display, fontWeight: 700, fontSize: 52, color: COLORS.white}}>
						Kya hai? Kaise kaam karta hai?
					</div>
				</PaperCard>
			</div>
		</div>
	);
};
