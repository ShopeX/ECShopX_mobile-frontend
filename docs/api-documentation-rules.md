# API文档生成规则

## 概述
本文档定义了项目中API接口文档的生成规则和标准，确保所有接口文档的一致性和完整性。

## 1. 文档生成流程

### 第一步：代码分析
1. **定位接口文件**
   - 在 `src/api/` 目录下找到对应的接口定义文件
   - 在 `src/subpages/` 或 `src/pages/` 目录下找到使用该接口的页面文件

2. **分析接口调用**
   - 查看接口的请求参数和响应数据结构
   - 分析页面中实际使用的字段
   - 识别必填字段和可选字段

3. **字段使用分析**
   - 追踪字段在页面渲染中的使用情况
   - 分析字段在业务逻辑中的作用
   - 识别条件性必填字段

### 第二步：字段分类
1. **必填字段 (Required)**
   - 页面渲染必需的字段
   - 业务逻辑必需的字段
   - 用户体验必需的字段

2. **条件必填字段 (Conditionally Required)**
   - 基于特定条件必须的字段
   - 例如：自提订单的 `ziti_info` 字段

3. **可选字段 (Optional)**
   - 增强功能的字段
   - 统计或展示用的字段

### 第三步：文档生成
1. **创建OpenAPI 3.0.1规范文档**
2. **定义接口路径和参数**
3. **设置响应数据结构**
4. **标记必填字段**
5. **添加字段描述和示例**

## 2. 文档结构标准

### 2.1 基本信息
```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "接口名称",
    "description": "基于项目代码分析的实际字段使用情况",
    "version": "1.0.0"
  }
}
```

### 2.2 接口定义
```json
{
  "paths": {
    "/api/path": {
      "method": {
        "summary": "接口摘要",
        "description": "详细描述",
        "operationId": "操作ID",
        "tags": ["标签"],
        "parameters": [],
        "responses": {},
        "security": []
      }
    }
  }
}
```

### 2.3 参数定义
```json
{
  "parameters": [
    {
      "name": "参数名",
      "in": "参数位置",
      "required": true/false,
      "description": "参数描述",
      "schema": {
        "type": "数据类型"
      },
      "example": "示例值"
    }
  ]
}
```

### 2.4 响应定义
```json
{
  "responses": {
    "200": {
      "description": "成功响应描述",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {}
          }
        }
      }
    }
  }
}
```

## 3. 字段定义规则

### 3.1 数据类型规范
- `string`: 字符串类型
- `integer`: 整数类型（金额以分为单位）
- `number`: 浮点数类型
- `boolean`: 布尔类型
- `array`: 数组类型
- `object`: 对象类型

### 3.2 枚举值定义
```json
{
  "enum": ["值1", "值2", "值3"],
  "example": "值1"
}
```

### 3.3 必填字段标记
```json
{
  "type": "object",
  "required": ["字段1", "字段2"],
  "properties": {}
}
```

### 3.4 字段描述规范
- 使用中文描述
- 说明字段的用途和含义
- 对于金额字段，说明单位（分）
- 对于状态字段，说明可能的值

## 4. 特殊字段处理

### 4.1 条件必填字段
```json
{
  "description": "字段描述（当条件满足时必填）",
  "example": "示例值"
}
```

### 4.2 嵌套对象字段
```json
{
  "type": "object",
  "properties": {
    "nested_field": {
      "type": "string",
      "description": "嵌套字段描述"
    }
  }
}
```

### 4.3 数组字段
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "required": ["必填字段"],
    "properties": {}
  }
}
```

## 5. 文档命名规范

### 5.1 文件名格式
- 主文档：`完整接口文档-Apifox.json`
- 单个接口：`{接口名称}接口文档-Apifox.json`
- 规则文档：`api-documentation-rules.md`

### 5.2 接口命名规范
- 使用接口的主要功能命名
- 例如：`订单详情接口文档-Apifox.json`

## 6. 质量检查清单

### 6.1 完整性检查
- [ ] 所有必填字段已标记
- [ ] 字段描述完整准确
- [ ] 示例值合理有效
- [ ] 数据类型正确

### 6.2 一致性检查
- [ ] 字段命名与代码一致
- [ ] 数据类型与代码一致
- [ ] 枚举值与代码一致

### 6.3 可用性检查
- [ ] 可以直接导入Apifox
- [ ] 字段映射关系清晰
- [ ] 错误响应定义完整

## 7. 常见问题解决

### 7.1 字段缺失
- 检查代码中是否遗漏了某些字段
- 确认字段是否真的不需要

### 7.2 数据类型错误
- 查看代码中的实际数据类型
- 确认API响应的真实格式

### 7.3 必填字段判断
- 分析字段在页面中的使用情况
- 确认字段缺失是否会导致错误

## 8. 工具和资源

### 8.1 代码分析工具
- 使用 `grep_search` 搜索字段使用
- 使用 `read_file` 查看具体实现
- 使用 `codebase_search` 进行语义搜索

### 8.2 文档生成工具
- 使用 `edit_file` 创建新文档
- 使用 `search_replace` 更新现有文档
- 使用 `delete_file` 删除过时文档

### 8.3 测试验证工具
- 创建HTML测试页面验证接口
- 使用JavaScript测试脚本验证响应
- 对比实际API响应与文档定义

## 9. 维护和更新

### 9.1 定期检查
- 每月检查一次文档的准确性
- 代码更新后及时更新文档
- 新增接口后立即生成文档

### 9.2 版本管理
- 使用语义化版本号
- 记录文档的更新历史
- 保持向后兼容性

### 9.3 团队协作
- 建立代码审查流程
- 确保文档更新与代码同步
- 培训团队成员使用规则

## 10. 示例模板

### 10.1 完整接口文档模板
```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "接口名称",
    "description": "基于项目代码分析的实际字段使用情况",
    "version": "1.0.0"
  },
  "paths": {
    "/api/path": {
      "get": {
        "summary": "接口摘要",
        "description": "详细描述",
        "operationId": "操作ID",
        "tags": ["标签"],
        "parameters": [],
        "responses": {
          "200": {
            "description": "成功响应",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {}
                }
              }
            }
          }
        },
        "security": [
          {
            "BearerAuth": []
          }
        ]
      }
    }
  },
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}
```

### 10.2 字段定义模板
```json
{
  "type": "object",
  "required": ["必填字段1", "必填字段2"],
  "properties": {
    "字段名": {
      "type": "数据类型",
      "description": "字段描述",
      "example": "示例值"
    }
  }
}
```

## 11. 总结

遵循这些规则可以确保：
1. **一致性**：所有接口文档格式统一
2. **准确性**：字段定义与代码实现一致
3. **完整性**：必填字段和可选字段明确标识
4. **可用性**：文档可以直接导入Apifox使用
5. **可维护性**：文档结构清晰，易于更新

通过严格执行这些规则，可以生成高质量的API接口文档，提高开发效率和接口使用的准确性。 