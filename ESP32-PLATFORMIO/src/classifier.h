#pragma once
#include <Arduino.h>
#include <vector>
#include <math.h>
#include "model_data.h"

String classify(const std::vector<float>& feat) {

    float bestDist = 9999999;
    int bestIndex = -1;

    for (int c = 0; c < NUM_CLASSES; c++) {
        
        float dist = 0;
        for (int i = 0; i < FEATURE_SIZE; i++) {
            float d = feat[i] - EMBEDDINGS[c][i];
            dist += d * d;
        }

        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = c;
        }
    }

    return LABELS[bestIndex];
}
