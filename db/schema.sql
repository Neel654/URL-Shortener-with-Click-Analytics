CREATE TABLE urls (
    id            BIGSERIAL PRIMARY KEY,
    short_code    VARCHAR(10)  NOT NULL,
    long_url      TEXT         NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_short_code UNIQUE (short_code)
);

CREATE TABLE clicks (
    id            BIGSERIAL PRIMARY KEY,
    url_id        BIGINT       NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    clicked_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    referrer      TEXT         NULL,
    user_agent    TEXT         NULL
);

CREATE INDEX idx_clicks_url_id_clicked_at ON clicks (url_id, clicked_at);
