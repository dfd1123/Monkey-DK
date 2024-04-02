import React, { type ReactNode } from 'react';
type PropsType = {
	children: ReactNode;
};

const PlayGround = ({ children }: PropsType) =>
// Logic

	<div>{children}</div>;
export default PlayGround;
