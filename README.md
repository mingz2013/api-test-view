# api-test-view



通用GM工具前端工程。可用于测试服，通过接口配置，生成可用的GM工具，避免了每个新功能都需要开发前端页面。

## 部署

本工具是纯前端页面，只需要部署静态web服务器即可使用。

## 配置说明

> 配置文件在 `api/models.json`，可由后端接口提供。

```javascript
modules = {
    "artifact": { // 模块名称
        "desc": "神器", // 模块描述
        "uri_list": { // 本模块下的uri

            "./api/artifact_list.json": { ///uri
                "desc": "获取神器列表", // 接口描述
                "params": [ // 接口参数描述，用于自动生成前端参数输入表单
                    {
                        "key": "user_id", // 用于传递给后端的key
                        "view_type": "text", // 输入展示类型，目前支持 text 文本，textarea 多行文本，select 选择框，datetime-local 时间选择
                        "value_type": "int", // 传递给后端的参数值类型
                        "check": "1000 < user_id < 1000000",
                        "desc": "userId", // 描述
                        "default": 10001 // 默认值
                    },

                    {
                        "key": "text",
                        "view_type": "textarea",
                        "value_type": "text",
                        "check": "1000 < textarea < 1000000",
                        "desc": "text",
                        "default": ""
                    },
                    {
                        "key": "num",
                        "view_type": "select", // 选择框类型
                        "value_type": "int",
                        "check": "1000 < num < 1000000",
                        "desc": "num",
                        "default": 10001,
                        "select_options": [ // 下拉菜单可选内容
                            {
                                "desc": 1,
                                "value": 1
                            },
                            {
                                "desc": 2,
                                "value": 2
                            }
                        ],
                        "select_options_query": "./api/num_select_options.json" // 下拉菜单可选内容可通过另外一个接口请求。需返回固定格式。
                    },
                    {
                        "key": "date_time",
                        "view_type": "datetime-local", // 时间类型
                        "value_type": "datetime",
                        "check": "1000 < date_time < 1000000",
                        "desc": "date time",
                        "default": 0
                    }
                ]
            },
            "./api/equipment_list.json": {
                "desc": "获取装备列表",
                "params": [
                    {
                        "key": "user_id",
                        "view_type": "text",
                        "value_type": "int",
                        "check": "1000 < user_id < 1000000",
                        "desc": "userId",
                        "default": 10001
                    }
                ]
            }
        }
    }
}
```


