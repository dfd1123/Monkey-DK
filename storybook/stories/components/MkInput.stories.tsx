import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { MkInput } from '@/components';

type StoryComponent = StoryObj<typeof MkInput>;
type StoryTemplate = StoryFn<typeof MkInput>;

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	component: MkInput,
	tags: ['autodocs'],
} as Meta<typeof MkInput>;

const Template: StoryTemplate = args => (
	<MkInput {...args} type="search" />
);

export const Default: StoryComponent = {
	parameters: {
		docs: {
			description: {
				story: '',
			},
		},
	},
	args: { },
	render: Template,
};
