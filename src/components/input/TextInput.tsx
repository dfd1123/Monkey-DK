import React from 'react';
import styled from '@emotion/styled';
import {test111} from '../../modules';

export type PropsType = {
	className?: string;
};

const TextInputComp = ({className}: PropsType) => {
	test111();

	return (
		<div className={className}>TextInput</div>
	);
};

const TextInput = styled(TextInputComp)`
    color: red;
`;

export default TextInput;
