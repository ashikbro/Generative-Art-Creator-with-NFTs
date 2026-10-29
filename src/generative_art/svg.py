"""Seeded SVG generation with no network or wallet dependencies."""

from random import Random


def generate_svg(seed: int, width: int = 800, height: int = 800, shapes: int = 24) -> str:
    """Generate a deterministic abstract SVG for a positive bounded canvas."""
    if width <= 0 or height <= 0:
        raise ValueError("canvas dimensions must be positive")
    if not 1 <= shapes <= 500:
        raise ValueError("shapes must be between 1 and 500")
    rng = Random(seed)
    colors = ("#8ef0c8", "#8ba7ff", "#ffb86b", "#f78fb3", "#d9a7ff")
    elements = []
    for _ in range(shapes):
        cx = rng.randrange(width)
        cy = rng.randrange(height)
        radius = rng.randrange(max(1, min(width, height) // 20), max(2, min(width, height) // 5))
        color = colors[rng.randrange(len(colors))]
        opacity = round(rng.uniform(0.35, 0.9), 2)
        elements.append(
            f'<circle cx="{cx}" cy="{cy}" r="{radius}" fill="{color}" opacity="{opacity}"/>'
        )
    body = "\n  ".join(elements)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" role="img" aria-label="Seeded generative artwork">\n'
        f'  <rect width="100%" height="100%" fill="#0b1020"/>\n  {body}\n</svg>\n'
    )
