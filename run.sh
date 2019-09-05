#/usr/bash

version=$(git describe --tags `git rev-list --tags --max-count=1`)
appid="wx4721629519a8f25b"
baseUrl="preissue-b.yuanyuanke.cn"
desc="新版微商城"

# 需要被替换的小程序appid，在./src/ext.json和 ./project.config.json
oldAppid="wx912913df9fef6ddd"
#需要被替换的 config/host.js 中prod环境域名
oladBaseUrl="ecshopx.shopex123.com/index.php"

git pull > /dev/null
echo "【SUCCESS】更新代码成功"

if  grep -q ${oldAppid} ./src/ext.json
then
  sed -i "" "s#${oldAppid}#${appid}#g" ./src/ext.json
  echo "【SUCCESS】替换ext.json成功"
else
  echo "【ERROR】待替换的小程序APPID ${oldAppid} 在./src/ext.json 中不存在"
  git checkout .
  exit
fi

# 替换请求的URL地址
sed -i "" "s#${oladBaseUrl}#${baseUrl}#g" ./config/host.js

if  grep -q ${oldAppid} ./project.config.json
then
  sed -i "" "s#${oldAppid}#${appid}#g" ./project.config.json
  echo "【SUCCESS】替换project.config.json成功"
else
  echo "【ERROR】待替换的小程序APPID ${oldAppid} 在./project.config.json 中不存在"
  git checkout .
  exit
fi

echo "【SUCCESS】编译开始......"

npm run build:weapp

echo "【SUCCESS】编译完成"

echo "【SUCCESS】准备上传小程序"
echo "/Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc '${desc}'"
/Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc "${desc}"

git checkout .

