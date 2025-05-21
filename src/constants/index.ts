import path from 'path';

import type { NsfwType, NsfwjsSupportedImageFormat } from '@types';

export const SLAVE_PATH = path.resolve(__dirname, '../../dist/slave');
export const LOCAL_ARCHIVE_DIR = process.env.LOCAL_ARCHIVE_DIR;
export const DCINSIDE_BASE_LIST_URL = 'https://gall.dcinside.com/board/lists';
export const DCINSIDE_BASE_POST_URL = 'https://gall.dcinside.com/board/view';
export const SWEEP_INTERVAL = 5_000;
export const AXIOS_TIMEOUT = 10_000;
export const IMAGE_DOWNLOAD_DELAY = 400;
export const NSFW_MODEL_PATH = 'file://./models/';
export const NSFW_CLASSES: Partial<NsfwType>[] = ['Porn', 'Hentai', 'Sexy'];
export const NSFW_THRESHOLD = 0.7;
export const NSFWJS_SUPPORTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'] as const;
export const NSFWJS_IMAGE_SIZE_MAX = 10 * 1024 * 1024;
export const NSFWJS_IMAGE_SIZE_MIN = 10 * 1024;
export const NSFWJS_TYPE_ON_ERROR = 'Neutral';
export const VALID_MIME_TYPES: Record<NsfwjsSupportedImageFormat, string> = {
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
};
