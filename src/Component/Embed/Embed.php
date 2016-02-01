<?php

namespace Alchemy\Embed\Embed;

use Alchemy\Phrasea\Application;

class Embed
{
    /** @var Application */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * load user configuration for embed bundle
     * @return array configuration
     */
    public function getConfiguration()
    {
        // default configuration:
        $config = [
          'video' => [
            'autoplay' => false,
            'options' => [],
            'available-speeds' => [],
            'player' => 'videojs',

          ],
          'audio' => [
            'player' => 'videojs',
            'options' => [],
            'available-speeds' => [],
          ],
          'document' => [
            'enable-pdfjs' => true,
            'player' => 'flexpaper',
          ]
        ];

        if (isset($this->app['phraseanet.configuration']['embed_bundle'])) {
            $userConfig = $this->app['phraseanet.configuration']['embed_bundle'];

            // override default options with users defined:
            $config = array_replace_recursive($config, $userConfig);

            // apply deprecated configuration keys if exists:
            if (array_key_exists('video_player', $userConfig)) {
                $config['video']['player'] = $userConfig['video_player'];
            }
            if (array_key_exists('video_autoplay', $userConfig)) {
                $config['video']['autoplay'] = $userConfig['video_autoplay'];
            }
            if (array_key_exists('video_available_speeds', $userConfig)) {
                $config['video']['available-speeds'] = $userConfig['video_available_speeds'];
            }
            if (array_key_exists('audio_player', $userConfig)) {
                $config['audio']['player'] = $userConfig['audio_player'];
            }
            if (array_key_exists('audio_autoplay', $userConfig)) {
                $config['audio']['autoplay'] = $userConfig['audio_autoplay'];
            }
            if (array_key_exists('audio_available_speeds', $userConfig)) {
                $config['audio']['available-speeds'] = $userConfig['audio_available_speeds'];
            }
            if (array_key_exists('enable_pdfjs', $userConfig['document'])) {
                $config['document']['enable-pdfjs'] = $userConfig['document']['enable_pdfjs'];
            }
        }

        return $config;
    }
}