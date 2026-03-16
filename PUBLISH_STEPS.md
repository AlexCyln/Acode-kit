# Publish Steps

这份文档按“第一次发 GitHub”的视角来写，尽量把网页上要点哪里、终端里要执行什么、发布后怎么验证都写清楚。

## 1. 发布前先完成本地检查

在仓库根目录执行：

```bash
cd /Users/alex/Documents/AlexFiles/structcode_skill
node ./scripts/install.mjs --source-dir "$(pwd)/Acode-kit" --dest-dir /tmp/structcode-skills-test
```

预期结果：

```text
/tmp/structcode-skills-test/Acode-kit
```

如果这个目录出现了，说明本地安装入口是通的。

## 2. 发布前需要替换的占位符

这次已经确定好的 GitHub 仓库信息是：

- GitHub 仓库：`AlexCyln/Acode-kit`
- HTTPS 地址：`https://github.com/AlexCyln/Acode-kit.git`

如果后面你不再改仓库名，那么下面这些位置已经按当前信息更新好了：

- `README.md`
- `scripts/install.sh`
- `scripts/install.mjs`

`package.json` 里的 npm 包名仍然保留为示例形式，因为你目前没有提供 npm scope。以后如果你要发 npm，再把它改成你自己的包名。

## 3. 如果你还没有 GitHub 账号

1. 打开 `https://github.com`
2. 点击右上角 `Sign up`
3. 按页面要求填写邮箱、密码、用户名
4. 完成邮箱验证
5. 登录 GitHub

建议提前确认两件事：

- 你的 GitHub 用户名是什么，后面会用到
- 你的邮箱已经验证成功，否则某些 Git 操作会不顺

## 4. 在 GitHub 网页上新建仓库

登录后按下面操作：

1. 点击右上角头像左边的 `+`
2. 选择 `New repository`
3. `Repository name` 填你想要的仓库名，例如 `acode-kit`
4. `Description` 可填：`Codex skill package for Acode-kit`
5. 选择 `Public`
6. 不要勾选 `Add a README file`
7. 不要勾选 `.gitignore`
8. 不要勾选 `Choose a license`
9. 点击 `Create repository`

为什么不要勾选这些初始化选项：

- 因为你本地已经有 `README.md` 和 `LICENSE`
- GitHub 如果先生成一套初始文件，第一次 push 容易多一次冲突处理

创建成功后，GitHub 会展示一个空仓库页面，并给你两种推送方式：

- HTTPS
- SSH

如果你从没配过 SSH，先用 HTTPS，最省事。

## 5. 配置本地 Git 基本信息

第一次用 Git 提交前，先执行一次：

```bash
git config --global user.name "你的 GitHub 用户名"
git config --global user.email "你的 GitHub 注册邮箱"
```

检查是否生效：

```bash
git config --global --get user.name
git config --global --get user.email
```

## 6. 在本地初始化仓库并提交

在项目目录执行：

```bash
cd /Users/alex/Documents/AlexFiles/structcode_skill
git init
git add .
git commit -m "feat: rename skill to Acode-kit and prepare release docs"
```

如果提交时报错：

- 提示没有 `user.name` 或 `user.email`：回到上一步设置
- 提示有换行或权限警告：通常不影响，先看是否真的阻止提交

## 7. 把本地仓库连接到 GitHub

本项目当前使用的 GitHub 地址就是 `https://github.com/AlexCyln/Acode-kit.git`。

### 方式 A：HTTPS，推荐给第一次发布的人

```bash
git remote add origin https://github.com/AlexCyln/Acode-kit.git
git branch -M main
git push -u origin main
```

如果 GitHub 要你登录：

- 浏览器弹窗登录就按提示走
- 或者终端要求输入账号密码时，GitHub 现在通常不再接受普通密码，需要 Personal Access Token

### 方式 B：SSH，适合后续长期使用

如果你已经配置过 SSH key，可以用：

```bash
git remote add origin git@github.com:AlexCyln/Acode-kit.git
git branch -M main
git push -u origin main
```

如果你没配过 SSH，就不要先折腾这个，直接走 HTTPS。

## 8. push 成功后到 GitHub 网页检查

推送完成后：

1. 刷新你的 GitHub 仓库页面
2. 确认这些文件都能看到：
   - `Acode-kit/`
   - `README.md`
   - `PUBLISH_STEPS.md`
   - `scripts/`
   - `package.json`
3. 点开 `README.md`，确认中英文内容显示正常

如果 GitHub 页面没有更新，先确认你 push 的是不是 `main` 分支。

## 9. 把 README 里的占位符改成真实仓库地址

发布前或发布后，你应该把 README 里的：

```text
AlexCyln/Acode-kit
```

替换完成后再提交一次：

```bash
git add README.md
git commit -m "docs: replace repository placeholders"
git push
```

这一步本仓库已经完成。

## 10. 验证 GitHub 安装方式

### 方式 1：Codex 的 skill-installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### 方式 2：bash 一键安装

```bash
REPO=AlexCyln/Acode-kit REF=main SKILL_PATH=Acode-kit \
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

安装后检查：

```bash
ls ~/.codex/skills/Acode-kit
```

如果能看到 `SKILL.md`、`assets/`、`references/`，说明安装成功。

最后重启 Codex，让它重新加载 skill。

## 11. 可选：发布到 npm，支持 `npx`

如果你只想放到 GitHub，这一步可以先不做。

如果你想让别人可以直接：

```bash
npx @your-npm-scope/structcode-skill-installer
```

那就继续下面的步骤。

### 11.1 准备 npm 账号

1. 打开 `https://www.npmjs.com/`
2. 注册账号
3. 验证邮箱
4. 记住你的 npm 用户名

### 11.2 修改 `package.json`

你至少要确认：

- `name` 是 npm 上没人占用的包名
- 如果是 scoped 包名，例如 `@AlexCyln/acode-kit-installer`，这个 scope 必须属于你

### 11.3 登录并发布

```bash
npm login
npm publish --access public
```

如果是 scoped 包，公开发布通常要加 `--access public`。

## 12. 验证 `npx` 方式

```bash
npx @your-npm-scope/structcode-skill-installer \
  --repo AlexCyln/Acode-kit \
  --ref main \
  --skill-path Acode-kit
```

## 13. 最终给用户的安装说明

你可以把下面三种方式给用户：

### GitHub skill-installer

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo AlexCyln/Acode-kit \
  --path Acode-kit
```

### bash 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/AlexCyln/Acode-kit/main/scripts/install.sh | bash
```

### npm / npx

```bash
npx @your-npm-scope/structcode-skill-installer
```

## 14. 常见问题

### 1. GitHub push 时要求登录怎么办

优先用 HTTPS，并按浏览器弹窗登录。如果终端要求密码但失败，说明需要 GitHub token，不是普通密码。

### 2. GitHub 上仓库是空的怎么办

通常是没有成功 `git push`，或者 push 到了别的分支。执行：

```bash
git branch
git remote -v
git status
```

确认当前分支是 `main`，远程地址正确，然后重新 push。

### 3. 安装后 Codex 里没出现 skill

先检查：

```bash
ls ~/.codex/skills/Acode-kit
```

然后重启 Codex。

### 4. 什么时候适合再做一次提交

每做完一类动作就提交一次最稳妥，例如：

- 改完命名和 README 提交一次
- 换掉仓库占位符再提交一次
- npm 发布前再提交一次
