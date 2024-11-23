import feedparser

class RSSParser:
    @staticmethod
    async def parse_feed(url: str):
        parsed_feed = feedparser.parse(url)
        entries = []
        for entry in parsed_feed.entries:
            entries.append({
                'title': entry.title,
                'link': entry.link,
                'published': entry.published
            })
        return entries