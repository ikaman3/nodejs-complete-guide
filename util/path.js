const path = require('path');

module.exports = path.dirname(require.main.filename);
// dirname() : 경로의 디렉터리 이름을 리턴한다.
// 즉 이 구문은 이 프로그램이 실행된 파일의 경로를 알려준다.