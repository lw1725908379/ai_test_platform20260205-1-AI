from enum import Enum

# pragma: no cover  MC8yOmFIVnBZMlhsaUpqbWxvYzZlRlJHUlE9PTo1ZmNmZjA4Ng==

class DocStatus(str, Enum):
    """Document processing status"""
# fmt: off  MS8yOmFIVnBZMlhsaUpqbWxvYzZlRlJHUlE9PTo1ZmNmZjA4Ng==

    READY = "ready"
    HANDLING = "handling"
    PENDING = "pending"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
