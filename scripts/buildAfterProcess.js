const fs = require('fs').promises;
const path = require('path');
const { remove, pathExists } = require('fs-extra');

async function getSrcSubDirectorys() {
	const srcDir = path.join(process.cwd(), 'src');
	const srcSubDirectorys = []

  try {
    // `src` 디렉토리 읽기
    const files = await fs.readdir(srcDir);

    for (const file of files) {
      let filePath = path.join(srcDir, file);
      // 파일 상태 확인
      const stats = await fs.stat(filePath);

      // 파일인 경우 출력
      if (stats.isDirectory()) {
				srcSubDirectorys.push(file);
      }
    }

		return srcSubDirectorys;
  } catch (err) {
    console.error('오류 발생:', err);
  }
}
/**
 * 빌드 후 필요 없는 디렉토리 삭제 및 정리
 */
async function cleanSubDirectory() {
  const srcSubDirectorys = await getSrcSubDirectorys();

  for(let i = 0; i < srcSubDirectorys.length; i++){
    for(let j = 0; j < srcSubDirectorys.length; j++){
      const dirToRemove = `build/${srcSubDirectorys[i]}/${srcSubDirectorys[j]}`;
    
      const exist = await pathExists(dirToRemove)
    
      if(exist){
        await remove(dirToRemove)
        .then(() => {
          console.log(`${dirToRemove} 디렉토리가 삭제되었습니다.`);
        })
        .catch(err => {
          console.error(`디렉토리 삭제 중 오류 발생:`, err);
        });
      }
    }
  }
}

cleanSubDirectory();

