
declare global {
   export interface window {
        services: {
            saveFile(b64: string, name: string): void;
            readFile(filePath: string): File;
            writeImgFile(b64: string, name: string): string;
        };
    }
}
