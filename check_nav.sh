echo "=== Searching for dash-bottom-nav rules across all CSS/TSX files ==="
grep -rn "dash-bottom-nav\|dash-nav-group\|dash-nav-fab" /data/data/org.smartide.code/files/home/projects/Taskora_Site/src --include="*.css" --include="*.tsx" --include="*.ts"
echo ""
echo "=== Checking how styles.css is imported ==="
grep -rn "styles.css\|import.*css" /data/data/org.smartide.code/files/home/projects/Taskora_Site/src/main.tsx /data/data/org.smartide.code/files/home/projects/Taskora_Site/src/App.tsx 2>/dev/null
