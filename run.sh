#/usr/bash

#!/bin/bash
cat <<MENU
客户列表：
  [ 1 ] => 测试环境
  [ 2 ] => 预发布
  [ 3 ] => 正式环境
  [ 4 ] => 华信（小康龙江）
  [ 5 ] => 云尚（医贵欣网上商城）
  [ 6 ] => 锦联华
  [ 7 ] => 屈臣氏
  [ 8 ] => 国药测试
  [ 9 ] => 善元荣锦
  [ 10 ] => 大润发飞牛
MENU
echo "请选择主机组:"
read number
case "$number" in
  1)
    appid="wx912913df9fef6ddd"
    baseUrl="ecshopx.shopex123.com/index.php"
    ;;
  2)
    appid="wx4721629519a8f25b"
    baseUrl="preissue-b.yuanyuanke.cn"
    ;;
  3)
    appid="wx5e27f0cc25fa9898"
    baseUrl="b.yuanyuanke.cn"
    ;;
  4)
    appid="wx22de6bb6f56392c1"
    baseUrl="b.xiaokanglongjiang.com"
    ;;
  5)
    appid="wxca119bea37be983c"
    baseUrl="b.eguixin.com"
    ;;
  6)
    appid="wx744bbfebf3e71459"
    baseUrl="b.jlhshop.com"
    ;;
  7)
    appid="wxd5b9d92177f661af"
    baseUrl="mrn.watsonsvip.com.cn"
    ;;
  8)
    appid="wx65360bb6a2712c5d"
    baseUrl="guoyao.shopex123.com"
    ;;
  9)
    appid="wxf745fb6c158b302a"
    baseUrl="b.shanyuan-rj.com"
    ;;
  10)
    appid="wxf713653c6a98eff8"
    baseUrl="scpt.feiniugo.com"
    ;;
  *)
    echo "选择的序号不存在"
    exit
    ;;
esac

version=$(git describe --tags `git rev-list --tags --max-count=1`)
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

# echo "【SUCCESS】准备上传小程序"
# echo "/Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc '${desc}'"
# /Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@`pwd`/dist --upload-desc "${desc}"

git checkout .
