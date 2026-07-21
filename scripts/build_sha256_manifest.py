#!/usr/bin/env python3
"""Write a deterministic SHA-256 manifest for one artifact directory."""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    files = sorted(
        path
        for path in args.directory.iterdir()
        if path.is_file() and path.resolve() != args.output.resolve()
    )
    lines = [f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}" for path in files]
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
