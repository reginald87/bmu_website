with open('bmu-frontend/src/services/api.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

insert_idx = -1
for i, l in enumerate(lines):
    if l.strip().startswith('export interface') or l.strip().startswith('export type') or l.strip().startswith('export const'):
        insert_idx = i
        break

if insert_idx > 0:
    lines.insert(insert_idx, "export const ALLOW_API_MOCKS = import.meta.env.VITE_ALLOW_API_MOCKS === 'true';\n\n")
    with open('bmu-frontend/src/services/api.ts', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f'Inserted at line {insert_idx}')
else:
    print('Could not find insert point')