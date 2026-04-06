try:
    from backend.main import app
except ModuleNotFoundError:
    import sys
    from pathlib import Path

    sys.path.append(str(Path(__file__).resolve().parents[1]))
    from backend.main import app

handler = app

__all__ = ["app", "handler"]