import tseslint from "typescript-eslint";
export default tseslint.config({ ignores: [".astro/**", ".next/**", "dist/**", "node_modules/**", "out/**", "src/generated/**", "public/**", ".hermes/**", "docs/**"] }, ...tseslint.configs.recommended);
