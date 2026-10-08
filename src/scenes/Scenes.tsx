import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {AIChip, Check, Heart, PlaneMark, PostMCPLogo, QuestionMark, SocialTile, Star} from '../components/Icons';
import type {SocialKind} from '../components/Icons';
import {PAPER_SHADOW, PaperCard, usePop} from '../components/paper';
import type {SceneKey} from '../script';
import {COLORS, FONTS} from '../theme';
import {Pop} from './Stage';

type SceneProps = {duration: number};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; hand?: boolean}> = ({
	children,
	size = 34,
	color = COLORS.ink,
	hand = false,
}) => (
	<div
		style={{
			fontFamily: hand ? FONTS.hand : FONTS.display,
			fontWeight: 700,
			fontSize: size,
			color,
			lineHeight: 1.15,
		}}
	>
		{children}
	</div>
);

const Stamp: React.FC<{text: string; color?: string; delay: number; x: number; y: number; rotate?: number; size?: number}> = ({
	text,
	color = COLORS.coral,
	delay,
	x,
	y,
	rotate = -10,
	size = 64,
}) => {
	const s = usePop(delay, 8);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`,
				opacity: Math.min(1, s * 3),
				fontFamily: FONTS.display,
				fontWeight: 700,
				fontSize: size,
				color,
				border: `6px solid ${color}`,
				borderRadius: 16,
				padding: '4px 26px',
				background: 'rgba(255,253,247,0.85)',
				whiteSpace: 'nowrap',
				filter: PAPER_SHADOW,
			}}
		>
			{text}
		</div>
	);
};

/** Dashed paper-string connector with a travelling dot. */
const Connector: React.FC<{x1: number; y1: number; x2: number; y2: number; delay: number; color?: string}> = ({
	x1,
	y1,
	x2,
	y2,
	delay,
	color = COLORS.brand,
}) => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [delay, delay + 15], [0, 1], clamp);
	const len = Math.hypot(x2 - x1, y2 - y1);
	const t = ((frame - delay) % 30) / 30;
	return (
		<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke={color}
				strokeWidth={6}
				strokeLinecap="round"
				strokeDasharray={`${len * draw} ${len}`}
				opacity={0.55}
			/>
			{draw >= 1 ? <circle cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={9} fill={color} stroke="#fff" strokeWidth={3} /> : null}
		</svg>
	);
};

// 1 ─ "X, LinkedIn, Instagram… itna sab manually kaise?"
const Chaos: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const tiles: {k: SocialKind; x: number; y: number}[] = [
		{k: 'x', x: 210, y: 160},
		{k: 'linkedin', x: 460, y: 110},
		{k: 'instagram', x: 710, y: 170},
		{k: 'facebook', x: 300, y: 400},
		{k: 'threads', x: 620, y: 420},
	];
	const notes = ['Post #1', 'Reel caption', 'Thread 1/5', 'Hashtags?', 'Reply!', 'Story'];
	return (
		<>
			{notes.map((n, i) => {
				const a = frame / 22 + (i * Math.PI * 2) / notes.length;
				return (
					<Pop key={n} delay={18 + i * 5} x={460 + Math.cos(a) * 360} y={290 + Math.sin(a) * 210} rotate={(random(n) - 0.5) * 30} seed={n}>
						<PaperCard color={i % 2 ? COLORS.pink : COLORS.mustard} padding="10px 18px" seed={`note-${n}`} radius={6}>
							<Label size={26} hand>
								{n}
							</Label>
						</PaperCard>
					</Pop>
				);
			})}
			{tiles.map((t, i) => (
				<Pop key={t.k} delay={8 + i * 6} x={t.x} y={t.y} rotate={Math.sin(frame / 8 + i) * 8} seed={t.k} float={10}>
					<SocialTile kind={t.k} size={120} />
				</Pop>
			))}
			<Stamp text="Manually?!" delay={Math.round(duration * 0.62)} x={460} y={290} rotate={-8} />
		</>
	);
};

// 2 ─ "Ye dekho — PostMCP AI."
const Laptop: React.FC<{children: React.ReactNode; width?: number}> = ({children, width = 640}) => (
	<div style={{filter: PAPER_SHADOW, width}}>
		<div
			style={{
				background: '#3d3a46',
				borderRadius: '22px 22px 6px 6px',
				padding: 18,
				border: `5px solid ${COLORS.white}`,
				borderBottom: 'none',
			}}
		>
			<div
				style={{
					background: COLORS.white,
					borderRadius: 10,
					height: width * 0.52,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{children}
			</div>
		</div>
		<div style={{height: 30, background: '#bdb6c7', borderRadius: '0 0 30px 30px', margin: '0 -50px', border: `5px solid ${COLORS.white}`}} />
	</div>
);

const Reveal: React.FC<SceneProps> = ({duration}) => {
	const logoAt = Math.round(duration * 0.45);
	return (
		<>
			<Pop delay={4} x={460} y={300} float={2}>
				<Laptop>
					<Pop delay={logoAt} x={300} y={166} float={0}>
						<PostMCPLogo size={88} />
					</Pop>
				</Laptop>
			</Pop>
			{[
				{x: 90, y: 90},
				{x: 840, y: 120},
				{x: 120, y: 470},
				{x: 820, y: 480},
			].map((p, i) => (
				<Pop key={i} delay={logoAt + 4 + i * 3} x={p.x} y={p.y} rotate={i * 20}>
					<Star size={54} color={i % 2 ? COLORS.mustard : COLORS.coral} />
				</Pop>
			))}
		</>
	);
};

// 3 ─ "PostMCP? Ye kya karta hai?"
const Question: React.FC<SceneProps> = () => (
	<>
		<Pop delay={2} x={460} y={300}>
			<PaperCard padding="34px 44px" seed="q-card" rotate={-2}>
				<PostMCPLogo size={96} />
			</PaperCard>
		</Pop>
		<Pop delay={10} x={110} y={150} rotate={-14}>
			<QuestionMark size={150} color={COLORS.coral} />
		</Pop>
		<Pop delay={16} x={810} y={130} rotate={12}>
			<QuestionMark size={120} color={COLORS.teal} />
		</Pop>
		<Pop delay={22} x={780} y={480} rotate={-6}>
			<QuestionMark size={100} color={COLORS.mustard} />
		</Pop>
	</>
);

// 4 ─ one idea becomes platform-specific posts
const PostCard: React.FC<{kind: SocialKind; children: React.ReactNode; color?: string}> = ({kind, children, color = COLORS.white}) => (
	<PaperCard color={color} width={270} padding="18px 20px" seed={`post-${kind}`}>
		<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
			<SocialTile kind={kind} size={52} />
			<div>
				<div style={{width: 110, height: 10, borderRadius: 5, background: '#d8cfc0', marginBottom: 6}} />
				<div style={{width: 70, height: 8, borderRadius: 4, background: '#e6dfd2'}} />
			</div>
		</div>
		{children}
	</PaperCard>
);

const Idea: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const splitAt = Math.round(duration * 0.45);
	const ideaY = interpolate(frame, [splitAt - 10, splitAt + 10], [260, 70], clamp);
	const ideaScale = interpolate(frame, [splitAt - 10, splitAt + 10], [1.15, 0.85], clamp);
	const cards: {k: SocialKind; x: number; body: React.ReactNode}[] = [
		{
			k: 'x',
			x: 150,
			body: (
				<Label size={24} hand>
					🚀 Friday ko launch! Ready? #NewProduct
				</Label>
			),
		},
		{
			k: 'linkedin',
			x: 460,
			body: (
				<Label size={22} hand>
					Excited to announce our new product, launching this Friday…
				</Label>
			),
		},
		{
			k: 'instagram',
			x: 770,
			body: (
				<div>
					<div
						style={{
							height: 90,
							borderRadius: 8,
							background: `linear-gradient(135deg, ${COLORS.mustard}, ${COLORS.coral})`,
							marginBottom: 8,
						}}
					/>
					<Label size={22} hand>
						Friday drop ✨ Stay tuned!
					</Label>
				</div>
			),
		},
	];
	return (
		<>
			{cards.map((c, i) => (
				<React.Fragment key={c.k}>
					{frame > splitAt ? <Connector x1={460} y1={120} x2={c.x} y2={300} delay={splitAt + i * 4} color={COLORS.inkSoft} /> : null}
					<Pop delay={splitAt + 8 + i * 8} x={c.x} y={400} rotate={(i - 1) * 4} seed={`pc-${c.k}`}>
						<PostCard kind={c.k}>{c.body}</PostCard>
					</Pop>
				</React.Fragment>
			))}
			<div
				style={{
					position: 'absolute',
					left: 460,
					top: ideaY,
					transform: `translate(-50%, -50%) scale(${ideaScale})`,
				}}
			>
				<Pop delay={2} x={0} y={0} float={2}>
					<PaperCard color={COLORS.mustard} padding="22px 30px" seed="idea" rotate={-2} width={560}>
						<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
							<div style={{fontSize: 64}}>💡</div>
							<Label size={34} hand>
								“Humara new product Friday ko launch ho raha hai.”
							</Label>
						</div>
					</PaperCard>
				</Pop>
			</div>
			<Pop delay={splitAt + 40} x={860} y={560} rotate={6}>
				<PaperCard color={COLORS.sky} padding="6px 16px" seed="more" radius={20}>
					<div style={{whiteSpace: 'nowrap'}}>
						<Label size={24}>+ more platforms</Label>
					</div>
				</PaperCard>
			</Pop>
		</>
	);
};

// 5 ─ "Phir har jagah separately post karna padta hai?"
const Separate: React.FC<SceneProps> = ({duration}) => {
	const frame = useCurrentFrame();
	const kinds: SocialKind[] = ['x', 'linkedin', 'instagram'];
	return (
		<>
			{kinds.map((k, i) => {
				const clickAt = 20 + i * 14;
				const pressed = frame > clickAt && frame < clickAt + 6;
				return (
					<Pop key={k} delay={4 + i * 6} x={170 + i * 290} y={280} seed={`sep-${k}`} rotate={(i - 1) * 3}>
						<PaperCard width={240} padding={22} seed={`sepc-${k}`}>
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
								<SocialTile kind={k} size={90} />
								<div style={{width: '90%', height: 12, borderRadius: 6, background: '#e2d9ca'}} />
								<div style={{width: '70%', height: 12, borderRadius: 6, background: '#e2d9ca'}} />
								<div
									style={{
										background: COLORS.navy,
										color: '#fff',
										fontFamily: FONTS.display,
										fontWeight: 700,
										fontSize: 26,
										padding: '6px 26px',
										borderRadius: 12,
										transform: `scale(${pressed ? 0.88 : 1})`,
									}}
								>
									Post
								</div>
							</div>
						</PaperCard>
					</Pop>
				);
			})}
			<Stamp text="x3 ?" delay={Math.round(duration * 0.55)} x={460} y={520} rotate={-6} color={COLORS.coral} size={58} />
		</>
	);
};

// 6 ─ "Accounts connect karo, posts review karo, time select karo… aur schedule. Bas."
const Steps: React.FC<SceneProps> = ({duration}) => {
	const steps = [
		{icon: '🔗', title: 'Connect', sub: 'accounts', color: COLORS.sky},
		{icon: '👀', title: 'Review', sub: 'posts', color: COLORS.pink},
		{icon: '⏰', title: 'Select', sub: 'time', color: COLORS.mustard},
		{icon: '📅', title: 'Schedule', sub: 'done!', color: COLORS.mint},
	];
	const at = [0.08, 0.26, 0.44, 0.6].map((f) => Math.round(duration * f));
	return (
		<>
			{steps.map((s, i) => (
				<Pop key={s.title} delay={at[i]} x={120 + i * 227} y={270} rotate={i % 2 ? 3 : -3} seed={`step-${i}`}>
					<PaperCard color={s.color} width={200} padding="20px 12px" seed={`stepc-${i}`}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
							<div
								style={{
									fontFamily: FONTS.display,
									fontWeight: 700,
									fontSize: 26,
									background: COLORS.ink,
									color: '#fff',
									width: 44,
									height: 44,
									borderRadius: 22,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{i + 1}
							</div>
							<div style={{fontSize: 64}}>{s.icon}</div>
							<Label size={34}>{s.title}</Label>
							<Label size={26} hand color={COLORS.inkSoft}>
								{s.sub}
							</Label>
						</div>
					</PaperCard>
					{i === 3 ? (
						<div style={{position: 'absolute', right: -14, top: -14}}>
							<Pop delay={at[3] + 12} x={0} y={0} float={0}>
								<Check size={60} />
							</Pop>
						</div>
					) : null}
				</Pop>
			))}
			<Stamp text="Bas. ✓" delay={Math.round(duration * 0.74)} x={460} y={520} rotate={-5} color={COLORS.teal} />
		</>
	);
};

// 7 ─ "Wait… aur ye AI ke saath bhi work karta hai?"
const AIQuestion: React.FC<SceneProps> = () => (
	<>
		<Pop delay={2} x={300} y={300}>
			<PaperCard padding="26px 30px" seed="aiq">
				<PostMCPLogo size={70} />
			</PaperCard>
		</Pop>
		<Pop delay={8} x={570} y={300} float={0}>
			<Label size={90} color={COLORS.inkSoft}>
				+
			</Label>
		</Pop>
		<Pop delay={12} x={740} y={300} rotate={6}>
			<PaperCard color={COLORS.brand} padding="22px 34px" seed="ai-word" radius={40}>
				<Label size={80} color={COLORS.white}>
					AI ✨
				</Label>
			</PaperCard>
		</Pop>
		<Pop delay={20} x={820} y={120} rotate={14}>
			<QuestionMark size={120} color={COLORS.coral} />
		</Pop>
	</>
);

// 8 ─ ChatGPT / Claude / Cursor ↔ PostMCP ↔ social accounts
const AIConnect: React.FC<SceneProps> = ({duration}) => {
	const ais = ['chatgpt', 'claude', 'cursor'] as const;
	const socials: SocialKind[] = ['x', 'linkedin', 'instagram'];
	const promptAt = Math.round(duration * 0.32);
	const toastAt = Math.round(duration * 0.6);
	return (
		<>
			{ais.map((a, i) => (
				<Connector key={a} x1={150} y1={70 + i * 120} x2={460} y2={190} delay={20 + i * 6} />
			))}
			{socials.map((s, i) => (
				<Connector key={s} x1={460} y1={190} x2={830} y2={70 + i * 120} delay={toastAt} color={COLORS.teal} />
			))}
			{ais.map((a, i) => (
				<Pop key={a} delay={4 + i * 6} x={140} y={70 + i * 120} seed={`ai-${a}`} rotate={(i - 1) * 3}>
					<AIChip kind={a} />
				</Pop>
			))}
			<Pop delay={14} x={460} y={190} float={2}>
				<PaperCard padding={20} seed="hub" radius={30}>
					<PlaneMark size={120} />
				</PaperCard>
			</Pop>
			{socials.map((s, i) => (
				<Pop key={s} delay={toastAt + 6 + i * 5} x={840} y={70 + i * 120} seed={`soc-${s}`}>
					<SocialTile kind={s} size={96} />
				</Pop>
			))}
			<Pop delay={promptAt} x={400} y={470} rotate={-1.5}>
				<PaperCard color={COLORS.white} padding="16px 26px" seed="prompt" radius={24} width={640}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<div style={{fontSize: 40}}>💬</div>
						<Label size={30} hand>
							“Mera launch post kal 9 baje schedule kar do.”
						</Label>
					</div>
				</PaperCard>
			</Pop>
			<Pop delay={toastAt + 20} x={790} y={560} rotate={3}>
				<PaperCard color={COLORS.mint} padding="10px 20px" seed="toast" radius={18}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Check size={40} />
						<Label size={26}>Scheduled · Kal 9:00 AM</Label>
					</div>
				</PaperCard>
			</Pop>
		</>
	);
};

// 9 ─ "ek idea, aur baaki ka kaam PostMCP?"
const Summary: React.FC<SceneProps> = () => (
	<>
		<Pop delay={2} x={130} y={280} rotate={-4}>
			<PaperCard color={COLORS.mustard} padding="18px 26px" seed="sum-idea">
				<div style={{textAlign: 'center'}}>
					<div style={{fontSize: 70}}>💡</div>
					<Label size={34}>1 Idea</Label>
				</div>
			</PaperCard>
		</Pop>
		<Pop delay={10} x={280} y={280} float={0}>
			<Label size={80} color={COLORS.inkSoft}>
				+
			</Label>
		</Pop>
		<Pop delay={16} x={450} y={280}>
			<PaperCard padding={20} seed="sum-hub" radius={28}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
					<PlaneMark size={100} />
					<Label size={30}>PostMCP</Label>
				</div>
			</PaperCard>
		</Pop>
		<Pop delay={24} x={620} y={280} float={0}>
			<Label size={80} color={COLORS.inkSoft}>
				=
			</Label>
		</Pop>
		<Pop delay={32} x={790} y={280} rotate={4}>
			<PaperCard color={COLORS.mint} padding="18px 20px" seed="sum-out">
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
					<div style={{display: 'flex', gap: 8}}>
						<SocialTile kind="x" size={52} />
						<SocialTile kind="linkedin" size={52} />
						<SocialTile kind="instagram" size={52} />
					</div>
					<Label size={28}>All posted ✓</Label>
				</div>
			</PaperCard>
		</Pop>
	</>
);

// 10 ─ tagline
const Tagline: React.FC<SceneProps> = ({duration}) => {
	const crossAt = Math.round(duration * 0.5);
	const frame = useCurrentFrame();
	const strike = interpolate(frame, [crossAt, crossAt + 10], [0, 1], clamp);
	return (
		<>
			<Pop delay={4} x={230} y={240} rotate={-4}>
				<PaperCard color={COLORS.mint} padding="24px 30px" seed="tag-a" width={380}>
					<div style={{textAlign: 'center'}}>
						<div style={{fontSize: 70}}>😌📱</div>
						<Label size={36}>Manage karo</Label>
					</div>
				</PaperCard>
				<div style={{position: 'absolute', right: -16, top: -16}}>
					<Check size={64} />
				</div>
			</Pop>
			<Pop delay={Math.round(duration * 0.3)} x={690} y={240} rotate={4}>
				<PaperCard color={COLORS.pink} padding="24px 30px" seed="tag-b" width={380}>
					<div style={{textAlign: 'center', position: 'relative'}}>
						<div style={{fontSize: 70}}>🏃💨</div>
						<Label size={36}>Peeche bhaagna</Label>
						<svg width={340} height={160} style={{position: 'absolute', left: -10, top: 0}}>
							<line x1={10} y1={10} x2={10 + 320 * strike} y2={10 + 140 * strike} stroke={COLORS.coral} strokeWidth={14} strokeLinecap="round" />
							<line x1={330} y1={10} x2={330 - 320 * strike} y2={10 + 140 * strike} stroke={COLORS.coral} strokeWidth={14} strokeLinecap="round" />
						</svg>
					</div>
				</PaperCard>
			</Pop>
			<Stamp text="Nahi!" delay={crossAt + 8} x={760} y={420} rotate={8} color={COLORS.coral} size={56} />
		</>
	);
};

// 11 ─ "ab mujhe bhi PostMCP chahiye!"
const WantIt: React.FC<SceneProps> = () => {
	const frame = useCurrentFrame();
	return (
		<>
			{Array.from({length: 10}).map((_, i) => {
				const a = (i / 10) * Math.PI * 2 + frame / 40;
				const r = 250 + Math.sin(frame / 10 + i) * 20;
				return (
					<Pop key={i} delay={6 + i * 2} x={460 + Math.cos(a) * r * 1.4} y={290 + Math.sin(a) * r * 0.8} rotate={i * 17} float={6}>
						{i % 2 ? <Heart size={56} color={i % 4 === 1 ? COLORS.coral : COLORS.pink} /> : <Star size={50} />}
					</Pop>
				);
			})}
			<Pop delay={2} x={460} y={270}>
				<PaperCard padding="30px 40px" seed="want" radius={30}>
					<PostMCPLogo size={90} />
				</PaperCard>
			</Pop>
			<Stamp text="Chahiye!" delay={20} x={660} y={420} rotate={-8} color={COLORS.brand} size={58} />
		</>
	);
};

// 12 ─ outro / call to action
const Outro: React.FC<SceneProps> = () => {
	const frame = useCurrentFrame();
	return (
		<>
			<Pop delay={4} x={460} y={190} float={3}>
				<PaperCard padding="40px 56px" seed="outro" radius={36}>
					<PostMCPLogo size={110} />
				</PaperCard>
			</Pop>
			<Pop delay={18} x={460} y={370} rotate={-2}>
				<PaperCard color={COLORS.ink} padding="14px 36px" seed="url" radius={40}>
					<Label size={46} color={COLORS.white}>
						postmcpai.com
					</Label>
				</PaperCard>
			</Pop>
			<Pop delay={30} x={460} y={500} rotate={2}>
				<div style={{transform: `scale(${1 + Math.sin(frame / 6) * 0.04})`}}>
					<PaperCard color={COLORS.mustard} padding="12px 34px" seed="cta" radius={20}>
						<Label size={38}>Get started →</Label>
					</PaperCard>
				</div>
			</Pop>
			{[
				{x: 80, y: 80},
				{x: 860, y: 70},
				{x: 60, y: 420},
				{x: 870, y: 430},
			].map((p, i) => (
				<Pop key={i} delay={36 + i * 4} x={p.x} y={p.y} rotate={i * 25}>
					<Star size={56} color={[COLORS.coral, COLORS.mustard, COLORS.teal, COLORS.brandLight][i]} />
				</Pop>
			))}
		</>
	);
};

export const SCENES: Record<SceneKey, React.FC<SceneProps>> = {
	chaos: Chaos,
	reveal: Reveal,
	question: Question,
	idea: Idea,
	separate: Separate,
	steps: Steps,
	aiQuestion: AIQuestion,
	aiConnect: AIConnect,
	summary: Summary,
	tagline: Tagline,
	wantIt: WantIt,
	outro: Outro,
};
