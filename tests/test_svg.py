import pytest

from generative_art import generate_svg


def test_seeded_generation_is_reproducible():
    assert generate_svg(42) == generate_svg(42)
    assert generate_svg(42) != generate_svg(43)


def test_svg_has_expected_accessibility_and_shape_count():
    svg = generate_svg(7, width=100, height=100, shapes=3)
    assert 'role="img"' in svg
    assert svg.count("<circle ") == 3


def test_invalid_dimensions_are_rejected():
    with pytest.raises(ValueError):
        generate_svg(1, width=0)
