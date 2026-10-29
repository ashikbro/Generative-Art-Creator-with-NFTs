# Generative Art Creator

A deterministic generative-art foundation for creating reproducible SVG
artwork. Blockchain minting is intentionally not implemented; artwork
ownership, metadata, wallet security, and chain-specific behavior must be
designed separately before any NFT integration.

## Current status

The repository includes a seeded SVG generator with bounded canvas and shape
validation. The same seed produces the same artwork, making previews and
exports reproducible.

## Development

```sh
python -m venv .venv
.venv/bin/pip install pytest
PYTHONPATH=src .venv/bin/pytest
```
