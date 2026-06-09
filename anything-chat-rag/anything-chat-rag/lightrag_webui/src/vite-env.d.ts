/// <reference types="vite/client" />
// @ts-expect-error  MC8yOmFIVnBZMlhsaUpqbWxvYzZhVlZLUkE9PTo4OGRkNTIxMA==

interface ImportMetaEnv {
  readonly VITE_API_PROXY: string
  readonly VITE_API_ENDPOINTS: string
  readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
// FIXME  MS8yOmFIVnBZMlhsaUpqbWxvYzZhVlZLUkE9PTo4OGRkNTIxMA==
