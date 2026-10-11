with open('bmu-frontend/src/services/api.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the import section and add axios import
import_idx = -1
for i, l in enumerate(lines):
    if 'import axiosInstance' in l:
        import_idx = i
        break

if import_idx >= 0:
    lines.insert(import_idx + 1, "import axios from 'axios';\n")
    with open('bmu-frontend/src/services/api.ts', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Added axios import')
else:
    print('Could not find import section')