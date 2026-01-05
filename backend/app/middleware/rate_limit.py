"""
Rate Limiting Middleware
Protects against brute force attacks and DDoS
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/minute"],  # Default: 200 requests per minute
    storage_uri="memory://"  # Use memory storage (upgrade to Redis in production)
)

async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded
    """
    raise HTTPException(
        status_code=HTTP_429_TOO_MANY_REQUESTS,
        detail={
            "error": "Trop de requêtes",
            "message": "Vous avez dépassé la limite de requêtes autorisées. Veuillez réessayer dans quelques instants.",
            "retry_after": exc.detail
        }
    )
