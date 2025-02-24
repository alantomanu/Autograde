declare module 'pdf-poppler' {
    interface PdfPopplerOptions {
        format: 'png' | 'jpg' | 'tiff';
        out_dir: string;
        out_prefix: string;
        page?: number | null;
        density?: number;
    }

    function convert(filePath: string, options: PdfPopplerOptions): Promise<void>;

    export = { convert };
}
