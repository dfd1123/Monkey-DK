/* eslint-disable */ 
import React from "react";

const SvgIcoClose = (props: React.SVGAttributes<SVGSVGElement> & { title?: string; description?: string; } = {}) => { return (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" {...props}><path fill="#000" fillRule="evenodd" d="M5.529 5.529c.26-.26.682-.26.942 0L16 15.057l9.529-9.528a.667.667 0 1 1 .942.942L16.943 16l9.528 9.529a.667.667 0 1 1-.943.942L16 16.943 6.47 26.47a.667.667 0 0 1-.942-.942L15.057 16 5.53 6.471a.667.667 0 0 1 0-.942" clipRule="evenodd"/></svg>); };
const SvgIcoSearch = (props: React.SVGAttributes<SVGSVGElement> & { title?: string; description?: string; } = {}) => { return (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" {...props}><path fill="#000" d="m18.776 17.89 7.494 7.495a.667.667 0 1 1-.943.943l-7.494-7.495z"/><path fill="#000" fillRule="evenodd" d="M13.333 20a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333m0 1.333a8 8 0 1 0 0-16 8 8 0 0 0 0 16" clipRule="evenodd"/></svg>); };

export {  SvgIcoClose,  SvgIcoSearch };