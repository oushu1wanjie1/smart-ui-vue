message=$(git show -s --format='\n>更新者: %an\n>msg: %s')

echo "$message"

curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e9947802-6ecc-4c40-a979-85b0ae2d3a35' \
   -H 'Content-Type: application/json' \
   --data '{ "msgtype": "markdown","markdown": {"content": "**smartUI有更新, 请知悉**'"$message"'","mentioned_list":["@all"]} }'
