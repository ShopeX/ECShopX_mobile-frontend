#/usr/bash

cd $(dirname "$0")

conf="companys.conf"
if [ ! -n "$1" ]
then
  if [ ! -f ${conf} ]
  then
      echo  "not find companys.conf"
      exit
  else
      sections=`sed -n '/\[*\]/p' ${conf}  |grep -v '^#'|tr -d []`
  fi

  COLUMNS=1
  echo "选择需要发布的客户"
  select var in ${sections};
  do
    if [ ! -n "$var" ]
    then
      echo  "请选择正确的数字"
      exit
    fi
    appid=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^appid/{print $3}')
    baseUrl=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^base_url/{print $3}')
    break
  done
else
  appid=${1}
  baseUrl=${2}
fi

version=$(git describe --tags `git rev-list --tags --max-count=1`)
desc="微商城小程序"

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

# echo "【SUCCESS】准备上传小程序"
# echo "/Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc '${desc}'"
# /Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc "${desc}"

git checkout .
