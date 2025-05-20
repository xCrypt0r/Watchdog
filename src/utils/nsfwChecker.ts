import * as tf from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';

import { NSFW_CLASSES, NSFW_MODEL_PATH, NSFW_THRESHOLD } from '@constants';
import type { NsfwCheckResult } from '@types';

let nsfwModelPromise: Promise<nsfw.NSFWJS> | null = null;

async function loadModel(): Promise<nsfw.NSFWJS> {
    if (!nsfwModelPromise) {
        nsfwModelPromise = nsfw.load(NSFW_MODEL_PATH, { size: 299 });
    }

    return nsfwModelPromise;
}

export async function checkNsfw(imageBuffer: Buffer): Promise<NsfwCheckResult> {
    let image: tf.Tensor3D | tf.Tensor4D | undefined;
    let batched: tf.Tensor<tf.Rank> | undefined;

    try {
        let model = await loadModel();

        image = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);

        if (image.rank === 4) {
            image = image.gather(0);
        }

        batched = image.expandDims(0);

        let predictions = await model.classify(batched as tf.Tensor3D);
        let topPrediction = predictions.reduce((prev, curr) => (curr.probability > prev.probability ? curr : prev));
        let isNsfw = predictions.some(
            (prediction) => NSFW_CLASSES.includes(prediction.className) && prediction.probability > NSFW_THRESHOLD
        );

        return {
            isNsfw,
            type: topPrediction.className
        };
    } catch (err: any) {
        console.error('Error in NSFW checker: ', err);

        return {
            isNsfw: false,
            type: 'Neutral'
        };
    } finally {
        image?.dispose();
        batched?.dispose();
    }
}
