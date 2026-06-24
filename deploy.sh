#!/usr/bin/env bash
# 一键部署脚本：把本静态站点部署到 nginx（Ubuntu/Debian）
# 用法：在服务器上 clone 仓库后，进入仓库根目录执行  bash deploy.sh
set -euo pipefail

# 站点根目录（默认 nginx 的 web 根）
WEB_ROOT="${WEB_ROOT:-/var/www/html}"

# 定位脚本所在目录（即仓库根目录），保证从任意位置执行都正确
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> 拉取最新代码"
if git rev-parse --git-dir >/dev/null 2>&1; then
  git pull --ff-only || echo "（跳过 git pull：可能无上游或本地有改动）"
fi

echo "==> 安装 nginx（如未安装）"
if ! command -v nginx >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y nginx
fi

echo "==> 部署站点文件到 ${WEB_ROOT}"
sudo mkdir -p "$WEB_ROOT"
sudo rm -rf "${WEB_ROOT:?}"/*
sudo cp index.html "$WEB_ROOT"/
sudo cp -r assets "$WEB_ROOT"/

echo "==> 启动并重载 nginx"
sudo systemctl enable nginx >/dev/null 2>&1 || true
sudo systemctl restart nginx

# 探测公网 IP（失败不影响部署）
PUBLIC_IP="$(curl -fsS --max-time 5 http://checkip.amazonaws.com 2>/dev/null || echo '<服务器IP>')"
echo ""
echo "✅ 部署完成！打开： http://${PUBLIC_IP}"
