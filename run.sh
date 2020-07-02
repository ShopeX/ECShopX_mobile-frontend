###
# @Author: Arvin
# @GitHub: https://github.com/973749104
# @Blog: https://liuhgxu.com
# @Description: 说明
 # @FilePath: /unite-vshop/run.sh
# @Date: 2020-06-10 10:15:51
 # @LastEditors: Arvin
 # @LastEditTime: 2020-06-11 09:56:44
### 
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
    appName=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^app_name/{print $3}')
    websocket=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^websocket/{print $3}')
    comppany_id=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^comppany_id/{print $3}')
    platform=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^platform/{print $3}')
    custom_server=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^custom_server/{print $3}')
    home_page=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^home_page/{print $3}')
    break
  done
    else
      appid=${1}
      baseUrl=${2}
      appName=${3}
      websocket=${4}
      comppany_id=${5}
      platform=${6}
      custom_server=${7}
      home_page=${8}
    fi

# version=$(git describe --tags `git rev-list --tags --max-count=1`)
# desc="微商城小程序"

# 需要被替换的小程序appid，在./src/ext.json和 ./project.config.json
# oldAppid="wx912913df9fef6ddd"
# oldAppName="通用小程序"

# if  grep -q ${oldAppid} ./src/ext.json
# then
#   sed -i "" "s#${oldAppid}#${appid}#g" ./src/ext.json
#   sed -i "" "s#${oldAppName}#${appName}#g" ./src/ext.json
#   sed -i "" "s#${oldAppid}#${appid}#g" ./project.config.json
#   echo "【SUCCESS】替换appid成功"
# else
#   echo "【ERROR】待替换的小程序APPID ${oldAppid} 在./src/ext.json 中不存在"
#   exit
# fi

echo '{
  "extEnable": true,
  "extAppid": "'${appid}'",
  "ext": {
    "company_id": "1",
    "appid": "'${appid}'",
    "wxa_name": "'${appName}'"
  },
  "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "微商城",
      "navigationBarTextStyle": "black"
  }
}' > ./src/ext.json

echo "npm run build:weapp"

npm run build:weapp
