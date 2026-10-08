import React from 'react';
import {Composition} from 'remotion';
import {PostMCPExplainer} from './Video';
import {FPS, HEIGHT, WIDTH} from './theme';
import {TOTAL_FRAMES} from './script';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="PostMCPExplainer"
		component={PostMCPExplainer}
		durationInFrames={TOTAL_FRAMES}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
	/>
);
