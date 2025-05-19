import * as nsfw from 'nsfwjs';

export type GalleryId = string;
export type GalleryName = string;
export type GalleryType = 'main' | 'minor' | 'mini';
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
