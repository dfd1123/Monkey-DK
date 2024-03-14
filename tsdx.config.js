const addDirective = require('./custom-rollup/rollup-plugin-add-directive');
const rollupCopy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    const outDirName = config.input.toString().split('/').at(-2);
    if(outDirName !== 'src'){
        config.plugins.push(rollupCopy({
            targets: [
                { dest: `build/${outDirName}`, src: 'dist/index.js' }
              ]
        }));
        
        config.output.file = config.output.file.replace('dist', `build/${outDirName}`);

        if(outDirName === 'components') {
            config.plugins.push(addDirective({ directive: '"use client";' }));
        }
    }

    
    return config;
  },
};