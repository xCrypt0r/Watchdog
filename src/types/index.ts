import * as nsfw from 'nsfwjs';

import { NSFWJS_SUPPORTED_IMAGE_FORMATS } from '@constants';

export type GalleryId = string;
export type GalleryName = string;
export type GalleryType = 'main' | 'minor' | 'mini';
export type NsfwjsSupportedImageFormat = (typeof NSFWJS_SUPPORTED_IMAGE_FORMATS)[number];
export type NsfwType = nsfw.PredictionType['className'];
export type NsfwCheckResult = {
    isNsfw: boolean;
    type: NsfwType;
};
export type TargetGalleries = Record<GalleryId, { name: GalleryName; type: GalleryType }>;
export type SlaveInfo = {
    id: GalleryId;
    name: GalleryName;
    type: GalleryType;
};
