const fs = require('fs');
const path = require('path');
const allDataMap = {}

function buildMenuConfig(...args) {
  const currentDirPath = path.resolve(...args);
  const isDir = fs.lstatSync(currentDirPath).isDirectory()
  if (isDir) {
    const pathList = fs.readdirSync(currentDirPath);
    pathList.forEach(item => {
      buildMenuConfig(currentDirPath, item)
    })
  } else {
    const fileExtname = path.extname(currentDirPath)
    if (['.ts', '.tsx'].includes(fileExtname)) {
      console.log(currentDirPath, 'currentDirPath');
      const data = fs.readFileSync(currentDirPath);
      const apiObj = {};
      const dataResult = data.toString()
        .replace(/\n/g, ' ')
        .replace(/import /g, '\nimport ')
        .replace(/const /g, '\nconst ')
      const childrenPath = []
      dataResult.replace(/import.*from ['"](\W.*)?['"]/g, function (match, p1) {
        childrenPath.push(getValidPath(args[0], p1))
      })
      const apiList = dataResult.match(/.*@\/api.*/g)
      apiObj[currentDirPath] = {
        authApiList: [],
        childrenPath: childrenPath.filter(_ => _),
      }

      if (apiList) {
        apiList.forEach(item => {
          const apiNames = item.match(/\{(.*)?\}/)[0].match(/\w+/g)
          const apiPathPart = item.match(/@\/(.*)?'/)[1]
          const apiPath = path.resolve('src', apiPathPart) + '.ts'
          const apiFileContent = fs.readFileSync(apiPath).toString()
            .replace(/\n/g, ' ')
            .replace(/export const /g, '\nexport const ')
            .replace(/ajax /g, '\najax ')
          const apiNameList = apiFileContent.match(/(?<=export const )(\w+)/g)
          const apiAuthPath = apiFileContent.match(/(?<=ajax\.).*?[\w})]['`]/g)
          const apiVarList = apiFileContent.replace(/const /g, '\nconst ').match(/(?<=const)(.*) = .*?\w['`]/g)
          const varMap = new Map()
          apiVarList.forEach(code => {
            try {
              eval(code)
              const [key, value] = code.replace(/\s/g, '').split('=')
              let text = value.replace(/\${.*?}/g, function (match) {
                return varMap.has(match) ? varMap.get(match) : match
              }).replace(/['"`]/g, '')
              varMap.set(`\${${key}}`, text)
            } catch (e) {}
          });
          apiAuthPath.forEach((apiPath, index) => {
            if (apiNames.includes(apiNameList[index])) {
              let originApiName = (apiPath.match(/\'(.*)?'/) || apiPath.match(/\`(.*)?`/))[1].replace(/\${.*?}/g, function (match, p1) {
                return varMap.has(match) ? varMap.get(match) : match
              })
              apiObj[currentDirPath].authApiList.push({
                method: apiPath.match(/\w+/)[0].toLocaleUpperCase(),
                api: originApiName.split('?')[0],
                apiName: apiNameList[index],
              })
            }
          })
        })
      }
      if (Object.keys(apiObj).length) {
        Object.assign(allDataMap, apiObj)
        fs.writeFileSync('src/back.json', JSON.stringify(allDataMap, null, 2));
      }
    }
  }
}

const getValidPath = (currentPath, parsePath) => {
  const defaultPathList = [
    '/index.tsx',
    '.tsx',
    '/index.ts',
    '.ts',
  ]

  const currentPathList = parsePath.includes('@') ? [
    currentPath.split('src')[0],
    parsePath.replace(/@/, 'src')
  ] : [currentPath, parsePath]
  const filePath = path.resolve(...currentPathList)
  const validPostfix = defaultPathList.find(x => {
    return fs.existsSync(filePath + x)
  })
  return validPostfix ? filePath + validPostfix : false
}

const deepChildren = (allData, childrenList, allChildrenList = []) => {
  childrenList?.forEach(path => {
    if (allData[path]) {
      console.log(allData[path], 'allData[path]');
      // 解决循子父循环依赖的问题
      if (!allChildrenList.includes(path)) {
        allChildrenList.push(path)
        deepChildren(
          allData,
          allData[path].childrenPath,
          allChildrenList
        )
      }
    } else {
      console.log('未匹配', path);
    }
  })
  return allChildrenList
}

const authAPiDeep = (dataObj) => {
  Object.keys(dataObj).forEach(key => {
    const allPathList = deepChildren(dataObj, dataObj[key].childrenPath)
    const allChildrenApiList = allPathList.reduce((acc, path) => {
      return acc.concat(dataObj[path]?.authApiList || [])
    }, []);
    const filterRepeat = [...allChildrenApiList, ...dataObj[key].authApiList].reduce((acc, authItem) => {
      const isExist = acc.some(_ => _.method === authItem.method && _.api === authItem.api)
      return acc.concat(isExist ? [] : authItem)
    }, [])
    dataObj[key].authApiList = filterRepeat
  })
  Object.keys(dataObj).forEach(key => {
    if (!dataObj[key].authApiList.length) {
      Reflect.deleteProperty(dataObj, key)
    } else {
      Reflect.deleteProperty(dataObj[key], 'childrenPath')
    }
  })
  fs.writeFileSync('src/menu-config.json', JSON.stringify(dataObj, null, 2));
}

const scanDir = ['src/store/', 'src/views/']
scanDir.forEach(dirPath => {
  buildMenuConfig(dirPath)
});
// buildMenuConfig('src/views/ApprovalCenter/')
// buildMenuConfig('src/views/PointSystem/Point/')
// buildMenuConfig('src/views/')
// const aaa = fs.readFileSync('src/back.json').toString();
// authAPiDeep(JSON.parse(aaa))

authAPiDeep(allDataMap)
