import React from 'react';
import {COLORS, FONTS} from '../theme';
import {Grain, PAPER_SHADOW} from './paper';

export type SocialKind = 'x' | 'linkedin' | 'instagram' | 'facebook' | 'threads';

const SOCIAL_COLOR: Record<SocialKind, string> = {
	x: COLORS.x,
	linkedin: COLORS.linkedin,
	instagram: COLORS.instagram,
	facebook: COLORS.facebook,
	threads: COLORS.threads,
};

export const SOCIAL_LABEL: Record<SocialKind, string> = {
	x: 'X',
	linkedin: 'LinkedIn',
	instagram: 'Instagram',
	facebook: 'Facebook',
	threads: 'Threads',
};

const Glyph: React.FC<{kind: SocialKind; size: number}> = ({kind, size}) => {
	const text = (t: string, scale = 0.6) => (
		<span style={{fontFamily: FONTS.display, fontWeight: 700, fontSize: size * scale, color: '#fff', lineHeight: 1}}>{t}</span>
	);
	switch (kind) {
		case 'x':
			return text('X', 0.62);
		case 'linkedin':
			return text('in', 0.55);
		case 'facebook':
			return text('f', 0.66);
		case 'threads':
			return text('@', 0.6);
		case 'instagram':
			return (
				<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60">
					<rect x={5} y={5} width={50} height={50} rx={15} fill="none" stroke="#fff" strokeWidth={6} />
					<circle cx={30} cy={30} r={11} fill="none" stroke="#fff" strokeWidth={6} />
					<circle cx={44} cy={16} r={4} fill="#fff" />
				</svg>
			);
	}
};

export const SocialTile: React.FC<{kind: SocialKind; size?: number; style?: React.CSSProperties}> = ({
	kind,
	size = 110,
	style,
}) => (
	<div style={{filter: PAPER_SHADOW, ...style}}>
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.24,
				background:
					kind === 'instagram'
						? 'linear-gradient(135deg, #f6b545 0%, #e5486f 50%, #8f4fd0 100%)'
						: SOCIAL_COLOR[kind],
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				border: `${Math.max(3, size * 0.05)}px solid ${COLORS.white}`,
				boxSizing: 'border-box',
			}}
		>
			<Grain opacity={0.25} />
			<Glyph kind={kind} size={size} />
		</div>
	</div>
);

/** Paper-plane mark used for the PostMCP AI wordmark. */
export const PlaneMark: React.FC<{size?: number}> = ({size = 100}) => (
	<div style={{filter: PAPER_SHADOW}}>
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.26,
				background: `linear-gradient(140deg, ${COLORS.brandLight}, ${COLORS.brand})`,
				border: `${Math.max(3, size * 0.05)}px solid ${COLORS.white}`,
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<Grain opacity={0.25} />
			<svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64" style={{position: 'relative'}}>
				<path d="M6 30 L58 8 L44 56 L30 38 Z" fill="#fff" />
				<path d="M30 38 L58 8 L24 52 Z" fill="#d9d4ff" />
				<path d="M30 38 L24 52 L22 40 Z" fill="#b9b1ff" />
			</svg>
		</div>
	</div>
);

export const PostMCPLogo: React.FC<{size?: number; dark?: boolean}> = ({size = 90, dark = false}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: size * 0.22}}>
		<PlaneMark size={size} />
		<div
			style={{
				fontFamily: FONTS.display,
				fontWeight: 700,
				fontSize: size * 0.72,
				color: dark ? COLORS.white : COLORS.ink,
				letterSpacing: -1,
				display: 'flex',
				alignItems: 'center',
				gap: size * 0.12,
			}}
		>
			<span>
				Post<span style={{color: dark ? COLORS.brandLight : COLORS.brand}}>MCP</span>
			</span>
			<span
				style={{
					fontSize: size * 0.36,
					background: COLORS.mustard,
					color: COLORS.ink,
					padding: `${size * 0.04}px ${size * 0.14}px`,
					borderRadius: size * 0.12,
					transform: 'rotate(-6deg)',
					display: 'inline-block',
					boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
				}}
			>
				AI
			</span>
		</div>
	</div>
);

export type AIKind = 'chatgpt' | 'claude' | 'cursor';

const AI_STYLE: Record<AIKind, {label: string; bg: string; fg: string}> = {
	chatgpt: {label: 'ChatGPT', bg: '#1f8a6f', fg: '#fff'},
	claude: {label: 'Claude', bg: '#d97757', fg: '#fff'},
	cursor: {label: 'Cursor', bg: '#26232b', fg: '#fff'},
};

export const AIChip: React.FC<{kind: AIKind; style?: React.CSSProperties}> = ({kind, style}) => {
	const s = AI_STYLE[kind];
	return (
		<div style={{filter: PAPER_SHADOW, ...style}}>
			<div
				style={{
					background: s.bg,
					color: s.fg,
					fontFamily: FONTS.display,
					fontWeight: 700,
					fontSize: 40,
					padding: '16px 28px',
					borderRadius: 18,
					border: `4px solid ${COLORS.white}`,
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					position: 'relative',
					overflow: 'hidden',
					width: 270,
					boxSizing: 'border-box',
					whiteSpace: 'nowrap',
				}}
			>
				<Grain opacity={0.2} />
				<svg width={34} height={34} viewBox="0 0 34 34" style={{position: 'relative', flexShrink: 0}}>
					<path d="M17 2 L20 14 L32 17 L20 20 L17 32 L14 20 L2 17 L14 14 Z" fill="#fff" opacity={0.95} />
				</svg>
				<span style={{position: 'relative'}}>{s.label}</span>
			</div>
		</div>
	);
};

/** Simple paper doodles. */
export const Star: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.mustard}) => (
	<svg width={size} height={size} viewBox="0 0 40 40" style={{filter: PAPER_SHADOW, overflow: 'visible'}}>
		<path d="M20 2 L25 14 L38 15 L28 24 L31 37 L20 30 L9 37 L12 24 L2 15 L15 14 Z" fill={color} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
	</svg>
);

export const Heart: React.FC<{size?: number; color?: string}> = ({size = 40, color = COLORS.coral}) => (
	<svg width={size} height={size} viewBox="0 0 40 40" style={{filter: PAPER_SHADOW, overflow: 'visible'}}>
		<path d="M20 36 C4 24 2 14 8 8 C13 3 19 6 20 11 C21 6 27 3 32 8 C38 14 36 24 20 36 Z" fill={color} stroke="#fff" strokeWidth={3} />
	</svg>
);

export const QuestionMark: React.FC<{size?: number; color?: string}> = ({size = 120, color = COLORS.coral}) => (
	<div
		style={{
			fontFamily: FONTS.display,
			fontWeight: 700,
			fontSize: size,
			color,
			lineHeight: 1,
			WebkitTextStroke: `${size * 0.05}px ${COLORS.white}`,
			paintOrder: 'stroke fill',
			filter: PAPER_SHADOW,
		}}
	>
		?
	</div>
);

export const Check: React.FC<{size?: number; color?: string}> = ({size = 48, color = COLORS.teal}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			background: color,
			border: `${size * 0.08}px solid #fff`,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			filter: PAPER_SHADOW,
		}}
	>
		<svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
			<path d="M4 12 L10 18 L20 6" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	</div>
);
