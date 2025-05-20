import axios, { type AxiosRequestConfig, type AxiosResponse, type RawAxiosRequestHeaders } from 'axios';
import * as cheerio from 'cheerio';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import 'module-alias/register';
import path from 'path';
import { workerData } from 'worker_threads';

import {
    AXIOS_TIMEOUT,
    DCINSIDE_BASE_LIST_URL,
    DCINSIDE_BASE_POST_URL,
    IMAGE_DOWNLOAD_DELAY,
    LOCAL_ARCHIVE_DIR,
    NSFWJS_IMAGE_SIZE_LIMIT,
    NSFWJS_SUPPORTED_IMAGE_FORMATS,
    SWEEP_INTERVAL,
    VALID_MIME_TYPES
} from '@constants';
import type { GalleryId, GalleryName, GalleryType, NsfwjsSupportedImageFormat } from '@types';
import { checkNsfw, convertWebP2Png } from '@utils';

const {
    GALLERY_ID,
    GALLERY_NAME,
    GALLERY_TYPE
}: {
    GALLERY_ID: GalleryId;
    GALLERY_NAME: GalleryName;
    GALLERY_TYPE: GalleryType;
} = workerData;

let handledPosts: string[] = [];
let { listURL, postURL } = getGalleryURL();

sweep();
setInterval(sweep, SWEEP_INTERVAL);

async function sweep() {
    let response = await fetchBuffer({
        url: listURL,
        params: { id: GALLERY_ID }
    });

    if (!response) {
        return;
    }

    let $ = cheerio.load(response.data);
    let $targets = $('tr[data-type="icon_pic"]').slice(0, 2);
    let targetPosts = $targets.map((_, el) => $(el).attr('data-no')).get();

    targetPosts = targetPosts.filter((targetPost) => !handledPosts.includes(targetPost));

    handledPosts.push(...targetPosts);

    handledPosts = handledPosts.slice(-10);

    downloadImages(targetPosts);
}

async function downloadImages(targetPosts: string[]) {
    for (let i = 0, iLast = targetPosts.length; i < iLast; i++) {
        let targetPost = targetPosts[i];
        let response = await fetchBuffer({
            url: postURL,
            params: { id: GALLERY_ID, no: targetPost }
        });

        if (!response) {
            return;
        }

        let $ = cheerio.load(response.data);
        let postTitle = $('.title_subject').text();
        let postDate = $('.gall_date').attr('title');
        let $attachments = $('.appending_file a');
        let attachmentURLs = $attachments.map((_, el) => $(el).attr('href')).get();
        let attachmentNames = $attachments.map((_, el) => $(el).text()).get();

        if (!targetPost || !postDate || !postTitle) {
            return;
        }

        console.log(`[\x1b[1;32m${GALLERY_NAME}\x1b[0m] ${postTitle}`);

        for (let j = 0, jLast = attachmentURLs.length; j < jLast; j++) {
            let attachmentName = attachmentNames[j];
            let attachmentURL = attachmentURLs[j];

            if (!attachmentName || !attachmentURL) {
                continue;
            }

            downloadImageFromURL(attachmentURL, targetPost, attachmentName, j);
            await sleep(IMAGE_DOWNLOAD_DELAY);
        }
    }
}

async function downloadImageFromURL(url: string, targetPost: string, attachmentName: string, index: number) {
    let response = await fetchBuffer({
        url,
        headers: {
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;' +
                'q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Language': 'ko-KR,ko;q=0.9',
            'Cache-Control': 'max-age=0',
            Connection: 'keep-alive',
            Referer: postURL,
            'Upgrade-Insecure-Requests': '1'
        },
        responseType: 'arraybuffer'
    });

    if (!response) {
        return;
    }

    let imageBuffer = Buffer.from(response.data);
    let fileExtension = path.extname(attachmentName).toLowerCase();

    if (fileExtension === '.webp') {
        imageBuffer = await convertWebP2Png(imageBuffer);
        fileExtension = '.png';
    }

    let folderName = path.join(LOCAL_ARCHIVE_DIR!, GALLERY_ID);
    let fileName = `[${GALLERY_ID}] ${targetPost}_${index}${fileExtension}`;
    let fileType = await fileTypeFromBuffer(imageBuffer);

    if (
        isSupportedImageFormat(fileExtension) &&
        fileType &&
        fileType.mime !== VALID_MIME_TYPES[fileExtension] &&
        imageBuffer.length <= NSFWJS_IMAGE_SIZE_LIMIT
    ) {
        let { isNsfw, type } = await checkNsfw(imageBuffer);

        if (isNsfw) {
            folderName = path.join(
                LOCAL_ARCHIVE_DIR!,
                type === 'Porn' ? '!nsfw' : type === 'Hentai' ? '!nsfw_2d' : '!nsfw_low'
            );
        }
    }

    fs.mkdirSync(folderName, { recursive: true });

    let file = fs.createWriteStream(path.join(folderName, fileName));

    file.write(imageBuffer);
    file.end();
}

function getGalleryURL() {
    let listURL = DCINSIDE_BASE_LIST_URL;
    let postURL = DCINSIDE_BASE_POST_URL;

    if (GALLERY_TYPE === 'minor') {
        listURL = listURL.replace(/board/, 'mgallery/board');
        postURL = postURL.replace(/board/, 'mgallery/board');
    } else if (GALLERY_TYPE === 'mini') {
        listURL = listURL.replace(/board/, 'mini/board');
        postURL = postURL.replace(/board/, 'mini/board');
    }

    return { listURL, postURL };
}

async function fetchBuffer(config: {
    url: string;
    params?: AxiosRequestConfig['params'];
    headers?: RawAxiosRequestHeaders;
    responseType?: AxiosRequestConfig['responseType'];
}): Promise<AxiosResponse | undefined> {
    try {
        const response = await axios({
            method: 'GET',
            timeout: AXIOS_TIMEOUT,
            ...config
        });
        return response.data ? response : undefined;
    } catch {
        return undefined;
    }
}

function isSupportedImageFormat(ext: string): ext is NsfwjsSupportedImageFormat {
    return NSFWJS_SUPPORTED_IMAGE_FORMATS.includes(ext as NsfwjsSupportedImageFormat);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
