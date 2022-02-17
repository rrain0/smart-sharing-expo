module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ['module-resolver', {
                /*
                    Если указать в импорте папку, то он будет искать index.js/ts в ней
                    Если указать файл, то будет его сразу смотреть
                 */
                alias: {
                    "~": './src',
                    "@assets": './assets',
                    "@t": './src/themes',
                    "@n": './src/navigations',
                    "@sc": './src/screens',
                    "@c":  './src/components',
                    "@h": './src/hooks',
                    "@u": './src/utils',
                    "@u2": './src/utils2',
                    "@r": './src/repositories',
                    "@se": './src/services',

                    "@test/2": './src/test',
                }
            }],
            ['module:react-native-dotenv', {
                moduleName: "@env", // default
                allowUndefined: true,
            }]
        ]
    };
};
