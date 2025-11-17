#include <vector>
#include "esp_camera.h"

std::vector<float> extract_features_from_frame(camera_fb_t *fb) {
    std::vector<float> feat(3);
    feat[0] = fb->buf[0] / 255.0f;
    feat[1] = fb->buf[1] / 255.0f;
    feat[2] = fb->buf[2] / 255.0f;
    return feat;
}
