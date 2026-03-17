# 文件名
`31_THIRD_PARTY_TOOLS_MANAGEMENT_SPEC.md`

# 文件定位
第三方工具（MCP 工具）的注册、安装、状态追踪与降级管理规范。

# 适用范围
适用于所有需要集成第三方 MCP 工具的项目初始化、开发与运维场景。

# 与其他文件的关系
本文件受 `00_GLOBAL_ENGINEERING_PRINCIPLES.md` 约束，为 `SKILL.md` 的工作流提供工具管理基础。`01_PRODUCT_REQUIREMENTS_STANDARD.md`、`02_UI_UX_DESIGN_SPEC.md` 中涉及设计工具的引用指向本文件。

# 编写目的
定义项目中使用的第三方 MCP 工具的注册表、安装流程、状态追踪机制与降级策略，确保工具可用性不阻塞核心工作流。

---

## 1. 工具注册表

以下为当前支持的 MCP 工具清单。每个工具包含安装方式、用途与降级方案。

### 1.1 Pencil MCP

| 属性 | 值 |
|------|-----|
| **用途** | UI/UX 设计稿创建与管理 |
| **类型** | 桌面应用 |
| **官网** | https://www.pencil.dev/ |
| **检测方式** | 扫描本地应用目录确认安装 |
| **安装方式** | 用户手动从官网下载安装桌面应用 |

### 1.2 NotebookLM MCP

| 属性 | 值 |
|------|-----|
| **用途** | 需求分析、项目骨架生成、大规模变更分析 |
| **类型** | MCP 服务 |

**安装命令**：

Claude Code：
```bash
claude mcp add notebooklm npx notebooklm-mcp@latest
```

Codex：
```bash
codex mcp add notebooklm -- npx notebooklm-mcp@latest
```

**认证**：安装后需执行 "Log me in to NotebookLM" 完成认证。

**默认注入 prompt**：
```
Here's my NotebookLM: https://notebooklm.google.com/notebook/7ec4ec07-abb3-478e-99aa-f8946e103499
```

### 1.3 shadcn MCP

| 属性 | 值 |
|------|-----|
| **用途** | UI 组件库构建与管理 |
| **类型** | MCP 服务 |

**安装命令**：

Claude Code：
```bash
npx shadcn@latest mcp init --client claude
```

Codex（手动配置 `~/.codex/config.toml`）：
```toml
[mcp]

[mcp.servers.shadcn]
command = "npx"
args = ["-y", "shadcn@latest", "mcp"]
```

### 1.4 Chrome DevTools MCP

| 属性 | 值 |
|------|-----|
| **用途** | 浏览器调试、前端页面实时检查 |
| **类型** | MCP 服务 |

**安装命令**：

Claude Code：
```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

Codex：
```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

---

## 2. 工具状态定义

每个工具在项目生命周期中具有以下三种状态之一：

| 状态 | 定义 | 行为 |
|------|------|------|
| **installed** | 工具已安装且功能正常 | 正常使用 |
| **missing** | 工具未安装或未检测到 | 触发安装建议流程 |
| **degraded** | 工具已安装但部分功能不可用 | 启用降级策略，记录受影响功能 |

---

## 3. 自动安装流程

项目初始化时执行以下流程：

1. **扫描**：检测所有注册工具的安装状态。
2. **检测缺失**：标记状态为 `missing` 的工具。
3. **建议安装**：向用户展示缺失工具清单与安装命令。
4. **用户授权**：等待用户确认是否执行安装。
5. **执行安装**：按用户授权逐一安装。
6. **验证**：安装后重新检测工具状态。
7. **记录结果**：将最终工具状态写入项目记录。

---

## 4. 降级策略

当工具不可用时，采用以下替代方案：

| 工具 | 降级方案 |
|------|----------|
| **Pencil MCP** | 使用文本描述的线框图或手绘草图；用户可选择其他设计工具手动创建设计稿 |
| **NotebookLM MCP** | AI 代理直接进行需求分析，不经过 NotebookLM 增强分析；输出质量可能降低，需用户更多介入确认 |
| **shadcn MCP** | 手动安装组件库依赖；使用已声明 UI 组件库的标准安装方式 |
| **Chrome DevTools MCP** | 使用浏览器内置开发者工具进行调试；AI 代理无法直接获取运行时信息 |

---

## 5. 工具状态报告格式

在项目文档中记录工具状态时使用以下格式：

```markdown
## MCP 工具状态

| 工具 | 状态 | 版本 | 备注 |
|------|------|------|------|
| Pencil MCP | installed | - | 桌面应用已安装 |
| NotebookLM MCP | installed | latest | 已认证 |
| shadcn MCP | missing | - | 项目未使用 shadcn 组件库 |
| Chrome DevTools MCP | installed | latest | - |
```

---

## 6. 维护规则

1. 新增 MCP 工具必须在本文件注册后方可在工作流中引用。
2. 工具注册表的变更需更新版本号与变更日志。
3. 每个工具必须提供明确的降级策略——不允许"工具缺位则流程中断"。
4. 工具安装不得绕过用户授权。
