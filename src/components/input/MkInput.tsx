import React, { type InputHTMLAttributes, type ReactElement, type FocusEvent, type KeyboardEvent, type ChangeEvent, useRef, useMemo, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from '@emotion/styled';
import { cn } from '@/utils';
import {SvgIcoClose, SvgIcoSearch} from '@/assets/svgs'

/** input 태그가 갖는 value 값에 대한 타입 */
type InputValue = InputHTMLAttributes<HTMLInputElement>['value'];
interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	/** input 태그가 갖는 value 값에 대한 타입 */
	value?: InputValue;
	/** 입력 필드에 오류가 있을 때 표시할 메시지 */
	error?: string;
	/** 
	 * 검색 아이콘으로 사용될 ReactElement (default: `<SvgIcoSearch />`)
	 * 
	 * `ex) searchIcon={<SvgIcoSearch2 />}`
	 */
	searchIcon?: ReactElement;
	/** 
	 * 리셋 아이콘으로 사용될 ReactElement  (default: `<SvgIcoClose />`)
	 * 
	 * `ex) resetIcon={<SvgIcoClose2 />}`
	 */
	resetIcon?: ReactElement;
	/** 입력 값 검증을 위한 정규 표현식 또는 함수 */
	validate?: RegExp | (<T extends InputValue>(value: T) => InputValue);
	/** 값이 변경될 때 호출될 함수 */
	handleChange?: <T extends InputValue>(value: T, name?: string) => void;
	/** 엔터 키가 눌렸을 때 호출될 함수 */
  handleEnter?: <T extends InputValue>(value: T, name?: string) => void;
	/** 리셋 버튼이 클릭됐을 때 호출될 함수 */
  handleReset?: <T extends InputValue>(value: T, name?: string) => void;
};

/**
 * MkInputComp는 사용자 입력을 받는 컴포넌트입니다.
 * 검색 또는 리셋 아이콘을 표시할 수 있으며, 입력 값의 유효성을 검사할 수 있습니다.
 *
 * @param {PropsType} props - MkInput 컴포넌트에 전달된 모든 속성과 이벤트 핸들러를 포함
 * @param {HTMLInputElement} ref - input 태그를 참조하는 참조 객체
 * @returns {ReactElement}
 */
const MkInputComp = forwardRef<HTMLInputElement, PropsType>((props, ref) => {
	const { 
		className = '', 
		error, 
		searchIcon = <SvgIcoSearch />, 
		resetIcon = <SvgIcoClose />, 
		handleChange, 
		handleReset, 
		handleEnter, 
		validate, 
		...inputProps 
	} = props;

	const inpRef = useRef<HTMLInputElement>(null);

	// input 태그 focus 여부
	const [focus, setFocus] = useState(false);
	// 해당 컴포넌트가 갖고 있는 내부 input value state값
	const [text, setText] = useState<InputValue>('');

	/** reset, search 아이콘 노출 여부에 대한 정보를 담은 객체 */
	const iconStatus = useMemo(() => {
		const { type, readOnly } = inputProps;

		return {
			reset: type === 'search' && focus && !!text && !readOnly,
			search: type === 'search'
		}
	}, [inputProps, text, focus, inpRef])

	/** 
	 * 값의 유효성 검사를 담당하는 함수
	 * @param value input 태그가 갖는 value값
	 * @returns 유효성 겁사 후 검증된 값을 반환
	 */
	const checkValidate = useCallback((value: InputValue) => {
		if(!value || !validate) return value;

		// validate가 함수일때
		if(typeof validate === 'function'){
			return validate(value);
		}else if(typeof value === 'string'){
			// validate가 정규식일때
			return validate.test(value) ? value : text;
		}

		// value 타입이 number거나 string[] 이며 vlidate가 정규식일때는 검증 X
		return value;
	}, [validate])

	const onReset = useCallback(() => {
			const name = inputProps.name;

			setText('');

			handleChange && handleChange('', name);
			handleReset && handleReset('', name);
	}, [inputProps.name, handleChange, handleReset]);

	/** 
	 * input 태그의 onChange에 적용될 함수
	 * @param e `ChangeEvent<HTMLInputElement>`
	 */
	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// 기존 값과 동일하면 그대로 종료
		if (value === text) return;

		// 유효성 검증 진행
		const putVal = checkValidate(value);

		// 상위 컴포넌트로 변경될 값 전달
		handleChange && handleChange(putVal, name);
		inputProps.onChange && inputProps.onChange(e);

		// 해당 컴포넌트가 갖는 state mutate
		setText(putVal);

		// 변경될 값이 빈문자라면 handleReset 함수 호출
		if (putVal === '') handleReset && handleReset('', name);
	}, [text, checkValidate, handleChange, handleReset, inputProps.onChange])

	/**
	 * input 태그의 onFocus와 onBlur에 적용될 함수
	 * @param e `FocusEvent<HTMLInputElement>`
	 * @param {boolean} status status가 `true`면 onFocus를 `false`면 onBlur를 호출
	 */
	const onFocus = useCallback(
		(e: FocusEvent<HTMLInputElement>, status: boolean) => {
			// focus 상태 업데이트
			setFocus(status);

			if (status) inputProps.onFocus && inputProps.onFocus(e);
			else inputProps.onBlur && inputProps.onBlur(e);
		},
		[inputProps.onBlur, inputProps.onFocus]
	);

	/**
	 * input 태그에서 enter를 했을때 트리거되는 함수
	 */
	const onEnter = useCallback((_e: KeyboardEvent<HTMLInputElement>) => {
		const { value = '', name } = inputProps;

		// props로 전달된 handleEnter에 input 태그의 value 값과 name값 담아 호출
		handleEnter && handleEnter(value, name);
		// input 태그 blur 처리 진행
		inpRef.current?.blur();
	}, [inputProps, handleEnter]);

	/**
	 * input 태그의 onKeyDown에 적용될 함수 (현재는 `Enter` 이벤트 로직만 작성)
	 * @param e `KeyboardEvent<HTMLInputElement>`
	 */
	const onKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			// 이벤트가 `Enter`
			// 한글의 경우 enter를 눌렀을때 자음/모음/받침으로 인해 2번 호출이 되기 때문에 compose가 되었는지 확인하는 조건 추가 확인
			if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
				onEnter(e);
			}

			// props로 전달된 onKeyDown 함수 호출
			inputProps.onKeyDown && inputProps.onKeyDown(e)
		},
		[onEnter, inputProps.onKeyDown]
	);

	// props로 전달된 value 값이 존재하고 변경되었을때 text값도 동기화
	useEffect(() => {
		if (typeof inputProps.value !== 'undefined') {
			setText(inputProps.value);
		}
	}, [inputProps.value]);

	// iconStatus.reset 값이 변경되면 input의 가장 오른쪽 끝으로 포커스를 이동
	useEffect(() => {
		if(inpRef.current){
			inpRef.current.scrollTo(window.innerWidth, 0)
		}
	}, [iconStatus.reset])

	// 해당 컴포넌트에 ref값이 전달된 경우 ref값에 inpRef.current (HTMLInputElement)가 세팅 될 수 있도록 설정
	useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inpRef.current);

	return (
		<div className={cn(className, inputProps.type, {
			focus,
			filled: !!text,
			readonly: inputProps.readOnly,
			disabled: inputProps.disabled,
			required: inputProps.required,
			error
		})}>
			<div className={cn('input-area')}>
				{iconStatus.search && (
					<span className={cn('ico-search')}>
						{searchIcon}
					</span>
				)}
				{iconStatus.reset && (
					<button className={cn('ico-reset')} onMouseDown={onReset} onTouchStart={onReset}>
						{resetIcon}
					</button>
				)}
				<input 
					ref={inpRef} 
					value={text} 
					{...inputProps}
					onChange={onChange}
          onFocus={(e) => onFocus(e, true)}
          onBlur={(e) => onFocus(e, false)} 
					onKeyDown={onKeyDown} 
				/>
			</div>
		</div>
	);
});

const MkInput = styled(MkInputComp)`
    display: inline-block;
		vertical-align: middle;
		width: 180px;
		height: 40px;
		padding: 10px 8px;
		border: 1px solid #ddd;
		box-sizing: border-box;
		line-height: 1;

		div, span, button {
			box-sizing: border-box;
		}

		/* IE의 경우 */
		input::-ms-clear,
		input::-ms-reveal {
			display: none;
		}

		/* 크롬의 경우 */
		input::-webkit-search-decoration,
		input::-webkit-search-cancel-button,
		input::-webkit-search-results-button,
		input::-webkit-search-results-decoration {
			display: none;
		}

		&.focus {
			
		}

		&.filled {

    }

		&.readonly {
			opacity: 0.5;
		}

		&.disabled { 
			opacity: 0.5;

			input{
				cursor: not-allowed;
			}
		}

		&.error {
			border-color: red;
		}

		.input-area {
			position: relative;
			width: 100%;
			height: 100%;
			color: inherit;
			font-size: inherit;
			font-style: inherit;
			font-weight: inherit;
			line-height: inherit;
			text-align: inherit;
		}

		.ico-search {
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 0;
			height: 100%;
			transform: translateY(-50%);

			> svg {
				display: inline-block;
				width: auto;
				height: 100%;
				vertical-align: middle;
			}

			~ input {
				padding-left: 25px;
			}
		}

		.ico-reset {
			position: absolute;
			z-index: 2;
			top: 50%;
			right: 0;
			height: 100%;
			padding: 0;
			transform: translateY(-50%);
			background-color: transparent;
			border: none;
			cursor: pointer;

			>svg {
				display: inline-block;
				width: auto;
				height: 100%;
				vertical-align: middle;
			}

			~input {
				padding-right: 24px;
			}
		}

		input {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			border: none;
			appearance: none;
			color: inherit;
			font-size: inherit;
			font-style: inherit;
			font-weight: inherit;
			line-height: inherit;
			text-align: inherit;
			outline: none;

			&::placeholder {
				
			}
		}
`;

export default MkInput;
