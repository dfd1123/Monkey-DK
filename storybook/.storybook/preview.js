// import '@styles/global.scss';
import {ToastProvider} from "~providers/toast";
import LocaleProvider from '~providers/locale/provider/LocaleProvider';
import ToastTemplate from '@components/atom/toast/ToastTemplate';

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
        <LocaleProvider>
        <ToastProvider toastComponent={ToastTemplate}>
          <Story />
        </ToastProvider>
        </LocaleProvider>
        
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
