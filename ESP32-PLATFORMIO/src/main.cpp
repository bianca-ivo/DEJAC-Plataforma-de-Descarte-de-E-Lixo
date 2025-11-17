#include <WiFi.h>
#include "esp_camera.h"
#include "esp_http_server.h"
#include <ArduinoJson.h>
#include <vector>
#include "extract_features.h" // Seu arquivo extract_features.cpp

// ===== WIFI =====
const char* ssid = "dlink-71CF";
const char* password = "mvrqh89498";

// ===== CLASSIFY ENDPOINT =====
static esp_err_t classify_handler(httpd_req_t *req) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
        httpd_resp_send_500(req);
        return ESP_FAIL;
    }

    std::vector<float> features = extract_features_from_frame(fb);
    esp_camera_fb_return(fb);

    StaticJsonDocument<256> doc;
    JsonArray arr = doc["features"].to<JsonArray>();
    for (float v : features) arr.add(v);

    String json;
    serializeJson(doc, json);

    httpd_resp_set_type(req, "application/json");
    httpd_resp_send(req, json.c_str(), json.length());

    return ESP_OK;
}

// ===== STREAM ENDPOINT =====
static esp_err_t stream_handler(httpd_req_t *req) {
    camera_fb_t *fb = NULL;
    esp_err_t res = ESP_OK;
    char part_buf[64];

    res = httpd_resp_set_type(req, "multipart/x-mixed-replace; boundary=frame");
    if (res != ESP_OK) return res;

    while (true) {
        fb = esp_camera_fb_get();
        if (!fb) {
            Serial.println("Erro ao capturar frame");
            continue;
        }

        size_t hlen = snprintf(part_buf, 64,
            "--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n",
            (unsigned int)fb->len);
        res = httpd_resp_send_chunk(req, part_buf, hlen);
        if (res != ESP_OK) {
            esp_camera_fb_return(fb);
            break;
        }

        res = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
        esp_camera_fb_return(fb);
        if (res != ESP_OK) break;
    }

    return res;
}

// ===== START SERVER =====
void startServer() {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.server_port = 80;

    httpd_handle_t server = NULL;
    httpd_start(&server, &config);

    httpd_uri_t classify_uri = {
        .uri = "/classify",
        .method = HTTP_GET,
        .handler = classify_handler
    };
    httpd_register_uri_handler(server, &classify_uri);

    httpd_uri_t stream_uri = {
        .uri = "/stream",
        .method = HTTP_GET,
        .handler = stream_handler
    };
    httpd_register_uri_handler(server, &stream_uri);
}

// ===== CAMERA INIT =====
void setup() {
    Serial.begin(115200);

    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;

    config.pin_d0 = 5;
    config.pin_d1 = 18;
    config.pin_d2 = 19;
    config.pin_d3 = 21;
    config.pin_d4 = 36;
    config.pin_d5 = 39;
    config.pin_d6 = 34;
    config.pin_d7 = 35;

    config.pin_xclk = 0;
    config.pin_pclk = 22;
    config.pin_vsync = 25;
    config.pin_href = 23;
    config.pin_sccb_sda = 26;
    config.pin_sccb_scl = 27;
    config.pin_pwdn = 32;
    config.pin_reset = -1;

    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;

    config.frame_size = FRAMESIZE_QQVGA;
    config.jpeg_quality = 20;
    config.fb_count = 2;

    if (esp_camera_init(&config) != ESP_OK) {
        Serial.println("Erro ao inicializar a câmera!");
        return;
    }

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(300);
        Serial.print(".");
    }

    Serial.println("\nWiFi conectado!");
    Serial.println("IP do ESP32: " + WiFi.localIP().toString());

    startServer();
}

void loop() {
    // Nada aqui, tudo é feito via endpoints
}
