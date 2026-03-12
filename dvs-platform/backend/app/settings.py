from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    env: str = "dev"
    allowed_origins: str = "http://localhost:5173"
    upload_dir: str = "./storage/uploads"

    model_config = SettingsConfigDict(
        env_file=("env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def upload_path(self) -> Path:
        return Path(self.upload_dir).resolve()

    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()


