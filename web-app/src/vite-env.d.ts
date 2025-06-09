/// <reference types="vite/client" />

type RendererLayout = {
    id: string;
    type: string;
    description?: string;
    children?: RendererLayout[];
}
