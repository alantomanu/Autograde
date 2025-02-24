import axios from 'axios';
import sharp from 'sharp';
import pdf from 'pdf-poppler';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface PdfToImageOptions {
    format: 'png' | 'jpg';
    density?: number;
    quality?: number;
}

async function convertPdfToSingleImage(
    pdfUrl: string,
    outputPath: string,
    options: PdfToImageOptions = {
        format: 'png',
        density: 300,
        quality: 100
    }
): Promise<void> {
    try {
        const tempDir = `temp-${uuidv4()}`;
        await fs.mkdir(tempDir, { recursive: true });

        // Download the PDF
        const pdfPath = path.join(tempDir, 'input.pdf');
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        await fs.writeFile(pdfPath, response.data);

        // Convert PDF pages to images
        const pdfOptions = {
            format: options.format,
            out_dir: tempDir,
            out_prefix: 'page',
            page: null,
            density: options.density
        };
        await pdf.convert(pdfPath, pdfOptions);

        // Get all generated images
        const files = await fs.readdir(tempDir);
        const imageFiles = files
            .filter(file => file.startsWith('page'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                return numA - numB;
            })
            .map(file => path.join(tempDir, file));

        // Get dimensions of all images
        const dimensions = await Promise.all(imageFiles.map(file => sharp(file).metadata()));

        // Find the maximum width among all images
        const maxWidth = Math.max(...dimensions.map(d => d.width || 0));
        
        // Calculate total height
        const totalHeight = dimensions.reduce((sum, dim) => sum + (dim.height || 0), 0);

        // Resize and normalize all images to the same width
        const resizedImages = await Promise.all(
            imageFiles.map(async (file, index) => {
                const buffer = await sharp(file)
                    .resize({ width: maxWidth, fit: 'contain' })
                    .toBuffer();
                return { buffer, height: dimensions[index].height };
            })
        );

        // Create a new blank image with calculated dimensions
        const composite = sharp({
            create: {
                width: maxWidth,
                height: totalHeight,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        });

        // Calculate vertical positions for each image
        let currentY = 0;
        const overlayImages = resizedImages.map(({ buffer, height }) => {
            const overlay = { input: buffer, top: currentY, left: 0 };
            currentY += height || 0;
            return overlay;
        });

        // Composite all images
        await composite
            .composite(overlayImages)
            .toFormat(options.format, { quality: options.quality })
            .toFile(outputPath);

        // Clean up temporary files
        await fs.rm(tempDir, { recursive: true, force: true });

        console.log('PDF successfully converted to single image:', outputPath);
    } catch (error) {
        console.error('Error converting PDF to image:', error);
        throw error;
    }
}

// Example usage
const pdfUrl = 'https://res.cloudinary.com/dfivs4n49/raw/upload/v1740331402/answer_sheets/answerpaper2.pdf';
const outputImagePath = 'output.png';

convertPdfToSingleImage(pdfUrl, outputImagePath).catch(console.error);
