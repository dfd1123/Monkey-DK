// import '../../src/styles/reset.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'white',
      values: [
        {
          name: 'white',
          value: '#ffffff',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
  },
  decorators: [
    (Story) => {
      return (
          <Story />
      )
    }
  ]
};

// export const parameters = {
//   nextjs: {
//     appDirectory: true,
//     navigation: {
//       pathname: '/some-default-path',
//       push() {
//         // The default implementation that logs the action into the Actions panel is lost
//       },
//       replace() {
//         // The default implementation that logs the action into the Actions panel is lost
//       },
//     },
//   },
// };

export default preview;
