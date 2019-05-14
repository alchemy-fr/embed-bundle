Alchemy Embed Bundle [![Bower version](https://badge.fury.io/bo/alchemy-embed-medias.svg)](https://badge.fury.io/bo/alchemy-embed-medias)
=============


Installation
------------
Add embed bundle to Phraseanet:

`composer require alchemy/embed-bundle:^2.0.0`


Deploy embed players in Phraseanet assets path:

`gulp build-alchemy-embed`


Configuration
-----------------

configuration options for phraseanet in `config/configuration.yml`


| property | type | description
-----------|------|-------
video.player | string | active player, embed bundle ship with `videojs` and `flowplayer`
video.autoplay | boolean | autoplay as default behavior
video.message_start | string | StartOfMessage as default behavior , where 'StartOfMessage' is a field created from Phraseanet admin   
video. coverSubdef | string | define a subdefinition for video cover, default is ```thumbnail```
video.available_speeds | number[] | playback available speeds
audio.player | string | active video player, embed bundle ship with `videojs`
audio.autoplay | boolean | autoplay as default behavior
document.enable_pdfjs | boolean | use pdfjs instead of flexbox for pdf only
document.player | string | active document player, embed bundle ship with `flexbox`

yaml example:

```
embed_bundle:
    video:
        player: videojs
        autoplay: false
        message_start: StartOfMessage
        coverSubdef: previewx4
        available_speeds:
          - 1
          - '1.5'
          - 3
    audio:
        player: videojs
        autoplay: false
    document:
        player: flexpaper
        enable-pdfjs: true
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
