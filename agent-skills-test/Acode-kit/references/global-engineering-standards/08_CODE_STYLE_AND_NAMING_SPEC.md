# 文件名
`08_CODE_STYLE_AND_NAMING_SPEC.md`

# 文件定位
跨语言代码风格、命名与基础实现约束。

# 适用范围
适用于 Vue、TypeScript、Java、Python、SQL、配置文件的命名与编码风格。

# 与其他文件的关系
本文件服务于 `03_FRONTEND_ARCHITECTURE_SPEC.md`、`04_BACKEND_ARCHITECTURE_SPEC.md`、`10_CODE_REVIEW_SPEC.md`，是所有代码审查的基础依据。

# 编写目的
统一多语言代码风格、命名与注释规则，降低不同项目、不同成员、不同 AI 输出之间的风格漂移。

## 1. 通用原则
1. 代码应优先表达意图，而非炫技。
2. 命名必须体现业务语义，避免缩写堆叠。
3. 一个函数只做一件主要事情。
4. 禁止无来源的魔法值。
5. 注释用于解释“为什么”，不是翻译代码。

## 2. Vue / TypeScript 风格
1. 组件名使用 PascalCase。
2. 文件名与主导出保持一致，如 `UserTable.vue`、`useUserForm.ts`。
3. 组合式函数使用 `use` 前缀，如 `useOrderDetailPage`。
4. 类型名使用 PascalCase，如 `UserListQuery`、`OrderStatus`。
5. 常量使用 `UPPER_SNAKE_CASE`。
6. 不使用 `any` 规避类型问题，必要时使用 `unknown` 后再收窄。

## 3. Java 风格
1. 包名全小写。
2. 类名使用 PascalCase。
3. 方法名、变量名使用 lowerCamelCase。
4. 常量使用 `UPPER_SNAKE_CASE`。
5. 枚举类使用 `XxxEnum`，枚举值使用 `UPPER_SNAKE_CASE`。

## 4. Python 风格
1. 模块、函数、变量使用 `snake_case`。
2. 类使用 PascalCase。
3. 常量使用 `UPPER_SNAKE_CASE`。
4. 脚本入口统一使用 `if __name__ == "__main__":`。

## 5. DTO / VO / Entity / BO 命名规范
1. 入参对象使用 `XxxCreateDTO`、`XxxUpdateDTO`、`XxxQueryDTO`。
2. 出参对象使用 `XxxVO`、`XxxDetailVO`、`XxxPageVO`。
3. 数据库实体使用 `XxxEntity`。
4. 业务编排对象可使用 `XxxBO`，但应谨慎，不得泛滥。

## 6. 前端组件命名规范
1. 页面容器组件使用业务名称，如 `UserListPage.vue`。
2. 纯通用组件使用中性命名，如 `BaseTable.vue`。
3. 业务组件用业务语义命名，如 `OrderStatusTag.vue`、`AuditTimeline.vue`。
4. 禁止出现 `index.vue` 满项目泛滥且无业务语义，除目录入口页外不推荐。

## 7. hooks / composables 命名规范
1. 使用 `use` 前缀。
2. 名称体现场景，如 `useLoginForm`、`useOrderTableColumns`。
3. 不同页面不可复制粘贴同名不同义的 hook。

## 8. store 命名规范
1. 文件名建议 `useXxxStore.ts`。
2. store ID 使用稳定字符串，如 `user`, `permission`, `dict`。
3. store 只承载共享状态，不承载页面模板逻辑。

## 9. 注释规范
1. 类、接口、公共方法应写业务语义注释。
2. 复杂算法、边界逻辑、兼容性处理需要简短注释。
3. TODO 必须包含责任人或任务编号，不得永久悬挂。
4. 禁止注释与代码实际行为不一致。

## 10. 函数长度与类职责
1. 单个函数超过 80 行需评估拆分。
2. 单个类超过 500 行需评估职责是否过重。
3. Controller 不得出现超长业务流程。
4. Vue 单文件组件超过 400 行需评估拆分。

## 11. 魔法值禁止规范
1. 状态码、按钮权限、路由名、缓存前缀不得散落硬编码。
2. 金额单位、超时时间、分页默认值需定义常量或配置。
3. 临时调试值不得进入主分支。

## 12. Mapper XML / 注解使用规范
1. 简单 CRUD 优先 MyBatis-Plus。
2. 复杂 SQL 可使用 Mapper XML。
3. 复杂查询若使用注解 SQL 可读性差，则必须转 XML。
4. SQL 与业务方法命名需语义一致。

## 13. 命名反例
1. `data1`, `temp`, `obj`, `handler2`。
2. `UserManageManageService` 这类重复语义。
3. `getInfo`, `process`, `doTask` 这类缺少上下文的方法名。

## 14. 推荐示例
```ts
const DEFAULT_PAGE_SIZE = 20

interface UserPageQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: string
}
```

```java
public class OrderApproveDTO {
    @NotNull
    private Long orderId;

    @NotBlank
    private String auditRemark;
}
```

## 15. 自检清单
1. 命名是否表达业务意图。
2. 是否存在魔法值。
3. 注释是否解释了关键原因。
4. 类型、DTO、VO、Entity 是否混用。
5. 文件长度与职责是否可控。

## 本文件使用建议
在项目初始化时即接入格式化、Lint、静态检查工具，并将本文件作为人工 Review 的命名与风格依据。

## AI 调用建议
AI 在生成任何代码文件时都应先遵守本文件的命名与分层命名规则，避免不同语言风格互相污染。

## 后续可扩展点
可补充 ESLint、Prettier、Checkstyle、Spotless、Ruff、Black 的具体配置模板。
