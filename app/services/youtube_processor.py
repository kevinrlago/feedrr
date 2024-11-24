# app/services/youtube_processor.py
from pytube import YouTube
from langdetect import detect
from typing import Dict, Any
from datetime import datetime

class YouTubeProcessor:
    def process_video(self, url: str) -> Dict[Any, Any]:
        """Extract information from YouTube video."""
        try:
            yt = YouTube(url)
            
            # Extract and detect language from description
            description_language = detect(yt.description) if yt.description else 'unknown'
            
            # Get video default language if available
            video_language = (
                yt.player_config_args.get('player_response', {})
                .get('videoDetails', {})
                .get('defaultLanguage', description_language)
            )
            
            # Get captions/subtitles info
            available_captions = [
                lang for lang in yt.captions.keys()
            ]
            
            processed_video = {
                'title': yt.title,
                'link': url,
                'guid': url,
                'published': datetime.fromtimestamp(yt.publish_date.timestamp()),
                'author': yt.author,
                'description': yt.description,
                'language': video_language,
                'description_language': description_language,
                'available_captions': available_captions,
                'duration': yt.length,
                'views': yt.views,
                'thumbnail_url': yt.thumbnail_url,
                'metadata': {
                    'channel_id': yt.channel_id,
                    'rating': yt.rating,
                    'keywords': yt.keywords,
                }
            }
            
            return processed_video
            
        except Exception as e:
            print(f"Error processing YouTube video {url}: {e}")
            return None