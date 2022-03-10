###
# @Author: Arvin
# @GitHub: https://github.com/973749104
# @Blog: https://liuhgxu.com
# @Description: 说明
 # @FilePath: /unite-vshop/run.sh
# @Date: 2020-06-10 10:15:51
 # @LastEditors: Arvin
 # @LastEditTime: 2021-02-03 18:28:44
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
    company_id=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^company_id/{print $3}')
    platform=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^platform/{print $3}')
    custom_server=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^custom_server/{print $3}')
    home_page=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^home_page/{print $3}')
    map_key=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^map_key/{print $3}')
    map_name=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^map_name/{print $3}')
    image_cdn=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^image_cdn/{print $3}')
    ali_isvid=$(sed -n '/\['$var'\]/,/^$/p' $conf|grep -Ev '\[|\]|^$'|awk  '/^ali_isvid/{print $3}')
    break
  done
    else
      appid=${1}
      baseUrl=${2}
      appName=${3}
      websocket=${4}
      company_id=${5}
      platform=${6}
      custom_server=${7}
      home_page=${8}
      map_key=${9}
      map_name=${10}
      image_cdn=${11}
      ali_isvid=${12}
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
    "company_id": "'${company_id}'",
    "appid": "'${appid}'",
    "wxa_name": "'${appName}'",
    "ali_isvid":"'${ali_isvid}'"
  },
  "window": {
      "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#fff",
      "navigationBarTitleText": "微商城",
      "navigationBarTextStyle": "black"
  }
}' > ./src/ext.json

echo 'APP_BASE_URL='${baseUrl}'
APP_WEBSOCKET='${websocket}'
APP_COMPANY_ID='${company_id}'
APP_PLATFORM='${platform}'
APP_CUSTOM_SERVER='${custom_server}'
APP_HOME_PAGE='${home_page}'
APP_TRACK=youshu
APP_YOUSHU_TOKEN=bi281e87ab2424481a
APP_ID='${appid}'
APP_MAP_KEY='${map_key}'
APP_MAP_NAME='${map_name}'
APP_IMAGE_CDN='${image_cdn}'
' > ./.env

echo "请选择编译方式"

buildType='weapp h5 alipay'

select type in $buildType
do
  if [ "$type" == 'weapp' ]
    then
    echo "npm run build:weapp"
    npm run build:weapp
  elif [ "$type" == 'alipay' ]
    then
    echo "npm run build:alipay"
    npm run build:h5
  else 
    echo "npm run build:h5"
    npm run build:alipay
  fi
  break
done