module.exports = function addDirective(options = {}) {
    return {
        name: 'add-directive', // 롤업 플러그인 이름
        renderChunk(code) {
        const directive = options.directive || '';
        return `${directive}\n${code}`;
        }
    };
}