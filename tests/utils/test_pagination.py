# tests/utils/test_pagination.py
from app.utils.pagination import paginate

def test_pagination():
    items = list(range(100))
    page = paginate(items, page=2, size=20)
    assert len(page.items) == 20
    assert page.total == 100
    assert page.page == 2