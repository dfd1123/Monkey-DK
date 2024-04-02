import React, { type InputHTMLAttributes, type ReactElement, useRef } from 'react';
import styled from '@emotion/styled';
import { cn } from '../../utils';

type PropsType = {
	className?: string;
	matchRegex?: RegExp;
	error?: string;
	resetIcon?: ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;

const MkInputComp = ({ className }: PropsType) => {
	const inpRef = useRef<HTMLInputElement>();

	return (
		<div className={cn(className)}>
			<div className=''></div>
		</div>
	);
};

const MkInput = styled(MkInputComp)`
    color: red;
`;

export default MkInput;
