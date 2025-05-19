import * as sharp from 'sharp';

export async function convertWebP2Png(webpBuffer: Buffer): Promise<Buffer> {
    let pngBuffer = await sharp.default(webpBuffer).png().toBuffer();

    return pngBuffer;
}
