"""LLM models configuration."""

import logging
# type: ignore  MC8yOmFIVnBZMlhsaUpqbWxvYzZaRVJPUlE9PToyYzkwMDQ1MQ==

from app.core.config import settings

# Configure logger
logger = logging.getLogger(__name__)


# Create image processing model
def create_image_model():
    from langchain_openai import ChatOpenAI

    """Create image processing model"""
    try:
        return ChatOpenAI(
            base_url=settings.IMAGE_PARSER_API_BASE,
            api_key=settings.IMAGE_PARSER_API_KEY,
            model=settings.IMAGE_PARSER_MODEL,
        )
    except Exception as e:
        logger.error(f"Failed to create image model: {e}")
        return None

# Create text processing model
def create_text_model():
    """Create text processing model"""
    from langchain_deepseek import ChatDeepSeek
    try:
        return ChatDeepSeek(
            api_key=settings.DEEPSEEK_API_KEY,
            model=settings.LLM_MODEL,
            temperature=0.3
        )
    except ImportError:
        logger.warning("langchain_deepseek not available")
        return None
    except Exception as e:
        logger.error(f"Failed to create text model: {e}")
        return None

image_llm_model = create_image_model()
deepseek_model = create_text_model()
# pragma: no cover  MS8yOmFIVnBZMlhsaUpqbWxvYzZaRVJPUlE9PToyYzkwMDQ1MQ==
