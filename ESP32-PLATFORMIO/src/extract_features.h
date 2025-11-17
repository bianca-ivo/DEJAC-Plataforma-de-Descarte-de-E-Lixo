#pragma once
#include <vector>
#include "esp_camera.h"

std::vector<float> extract_features_from_frame(camera_fb_t *fb);
