Alchemy Embed Bundle [![Bower version](https://badge.fury.io/bo/alchemy-embed-medias.svg)](https://badge.fury.io/bo/alchemy-embed-medias)
=============


Installation
------------
Add embed bundle to Phraseanet:

`composer require alchemy/embed-bundle:~0.3.0`

Add embed players to Phraseanet:

`bower install alchemy-embed-medias#~0.3.0`

Deploy embed players in Phraseanet assets path:

`gulp build-alchemy-embed`


Configuration
-----------------

configuration options for phraseanet in `config/configuration.yml`


| property | type | description
-----------|------|-------
video_player | string | active player, embed bundle ship with `videojs` and `flowplayer`
video_autoplay | boolean | autoplay as default behavior
video_available_speeds | number[] | playback available speeds
audio_player | string | active video player, embed bundle ship with `videojs`
audio_autoplay | boolean | autoplay as default behavior
document | object | define options for document player
document.enable_pdfjs | boolean | use pdfjs instead of flexbox

yaml example:

```
embed_bundle:
    video_player: 'videojs'
    video_autoplay: false
    video_available_speeds:
        - 0.5
        - 1
        - 1.5
        - 2
    audio_player: 'videojs'
    audio_autoplay: false
    document:
        enable_pdfjs: true
```

Field mapping
-----------------

Video captions (subtitles and chapters) can be added via Phraseanet Fields setup:
field name matching table:

| field name | vtt kind | description
-------------|----------|-------
VideoTextTrack | subtitle | will add a subtitle track with a label named `default`
VideoTextTrackFR | subtitle | will add a subtitle track with a label named `fr`
VideoTextTrack*| subtitle | will add a subtitle track with a label named with field name placeholder
VideoTextTrackChapters | chapters | will add a chapter track - require JSON content


### VTT file formats
#### Subtitles valid field content
```
WEBVTT

1
00:00:00.000 --> 00:00:04.000
This is a sample subtitle track <b>with</b> formating

Chapter 2
00:00:04.000 --> 00:00:08.000
As you can see, that's <c.highlight>easy</c>

```

#### Chapters valid field content

```
WEBVTT

Chapter 1
00:00:00.000 --> 00:00:04.000
{
    "title":"Chapter 1",
    "image":"asset/img/chapter_1.png"
}

Chapter 2
00:00:04.000 --> 00:00:08.000
{
    "title":"Chapter 2",
    "image":"asset/img/chapter_2.png"
}

```
