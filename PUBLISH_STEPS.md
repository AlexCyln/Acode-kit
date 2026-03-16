# Publish Steps

这份文档按“成熟 skill 插件发布”的标准来写，不只覆盖 GitHub 上传，还覆盖多 Agent 分发、无 Agent 用户、手动安装、验证和常见问题。

## 1. 发布前的目标确认

当前仓库目标：

- GitHub 仓库：`AlexCyln/Acode-kit`
- GitHub HTTPS：`https://github.com/AlexCyln/Acode-kit.git`
- 当前支持：`Codex`、`Claude Code`、`local portable install`

发布前先确认一件事：

- 你是只想发布 GitHub 版本，还是还要继续发布 npm 版本。

如果目前只需要 GitHub，npm 可以先不做。

## 2. 作为成熟插件要覆盖的安装场景

发布前要保证下面三类用户都能用：

1. 已安装 Codex 的用户
2. 已安装 Claude Code 的用户
3. 还没安装任何 Agent，但想先把插件下载到本地项目目录的用户

本仓库现在已经分别支持：

- Codex 安装
- Claude 安装
- 本地目录便携安装
- 后续手动接入 Agent

## 3. 本地验证

### 3.1 验证便携安装

```bash
cd /Users/alex/Documents/AlexFiles/Acode-kit_skill
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir /tmp/agent-skills-test
```

预期结果：

```text
/tmp/agent-skills-test/Acode-kit
/tmp/agent-skills-test/claude/acode-kit.md
```

### 3.2 验证 Codex 安装

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent codex --dest-dir /tmp/codex-skills
```

预期结果：

```text
/tmp/codex-skills/Acode-kit
```

### 3.3 验证 Claude 安装

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent claude --dest-dir /tmp/claude-home
```

预期结果：

```text
/tmp/claude-home/Acode-kit
/tmp/claude-home/agents/acode-kit.md
```

## 4. 初始化 Git 并提交

如果本地还没建仓库：

```bash
cd /Users/alex/Documents/AlexFiles/Acode-kit_skill
git init
```

加入文件并提交：

```bash
git add .
git commit -m "feat: publish Acode-kit skill package"
```

## 5. 连接 GitHub 仓库

使用你现在的 HTTPS 远程地址：

```bash
git remote add origin https://github.com/AlexCyln/Acode-kit.git
```

如果远程已存在但地址不对：

```bash
git remote set-url origin https://github.com/AlexCyln/Acode-kit.git
```

检查：

```bash
git remote -v
```

## 6. 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

如果提示登录：

- 直接按浏览器登录流程完成
- 如果终端要求密码，通常需要 GitHub Personal Access Token，而不是普通密码

## 7. 在 GitHub 网页检查内容

推送完成后，打开：

- `https://github.com/AlexCyln/Acode-kit`

确认你能看到：

- `Acode-kit/`
- `scripts/`
- `README.md`
- `PUBLISH_STEPS.md`
- `package.json`

再点开 `README.md`，检查以下几点：

- 中英文都正常显示
- 安装方式包含 Codex / Claude / local
- 示例命令中的仓库地址都已正确

## 8. 验证 GitHub 分发链路

### 8.1 验证 Codex 官方 skill-installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 8.2 验证 bash 自动安装

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 8.3 验证安装到 Claude

```bash
AGENT=claude SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 8.4 验证本地便携安装

```bash
AGENT=local DEST_ROOT="$(pwd)/agent-skills" curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

## 9. 给用户的安装说明

### 9.1 用户装了 Codex

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 9.2 用户装了 Claude Code

```bash
AGENT=claude SCOPE=user curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### 9.3 用户暂时没装任何 Agent

```bash
AGENT=local DEST_ROOT="$(pwd)/agent-skills" curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

后续手动安装：

- Codex：复制 `agent-skills/Acode-kit` 到 `~/.codex/skills/Acode-kit`
- Claude：
  - 复制 `agent-skills/Acode-kit` 到 `~/.claude/Acode-kit`
  - 复制 `agent-skills/claude/acode-kit.md` 到 `~/.claude/agents/acode-kit.md`

## 10. 可选：发布 npm 版本

如果后续你想支持：

```bash
npx @your-npm-scope/structcode-skill-installer
```

那还需要：

1. 去 `npmjs.com` 注册账号
2. 把 `package.json` 的 `name` 改成你自己的有效包名
3. 执行：

```bash
npm login
npm publish --access public
```

## 11. 常见问题

### 1. 用户目录没有权限怎么办

让用户使用 `--dest-dir` 或 `DEST_ROOT` 指定到可写目录。

### 2. 用户没有装 Codex 或 Claude 怎么办

直接走 `AGENT=local`，先安装到当前项目目录。

### 3. 已有旧版本怎么办

当前安装器会覆盖同名目标目录，因此发布新版本前要确认目录名稳定且一致。

### 4. 安装后为什么看不到

多数 Agent 需要重启或重新加载，安装器也会提示这一点。

### 5. 网络拉取失败怎么办

改用本地源码安装：

```bash
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --agent local --dest-dir "$(pwd)/agent-skills"
```
