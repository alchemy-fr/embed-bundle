<?php

namespace Alchemy\Embed\Embed;

class Embed
{
    protected $embedConfiguration;

    public function __construct(array $embedConfiguration)
    {

        // default configuration:
        $config = [
          'video' => [
            'autoplay' => false,
            'options' => [],
            'available_speeds' => [],
            'player' => 'videojs',

          ],
          'audio' => [
            'player' => 'videojs',
            'options' => [],
            'available_speeds' => [],
          ],
          'document' => [
            'enable_pdfjs' => true,
            'player' => 'flexpaper',
          ]
        ];

        if (isset($embedConfiguration)) {
            $userConfig = $this->normalizeConfig($embedConfiguration);

            // override default options with users defined:
            $config = array_replace_recursive($config, $userConfig);

        }
        $this->embedConfiguration = $config;
    }

    /**
     * load user configuration for embed bundle
     * @return array configuration
     */
    public function getConfiguration()
    {
        return $this->embedConfiguration;
    }

    /**
     * apply deprecated configuration keys
     * @param array $embedConfig
     * @return array
     */
    private function normalizeConfig(array $embedConfig)
    {

        $config = $embedConfig;

        // apply deprecated configuration keys if exists:
        if (array_key_exists('video_player', $embedConfig)) {
            $config['video']['player'] = $embedConfig['video_player'];
        }
        if (array_key_exists('video_autoplay', $embedConfig)) {
            $config['video']['autoplay'] = $embedConfig['video_autoplay'];
        }
        if (array_key_exists('video_available_speeds', $embedConfig)) {
            $config['video']['available_speeds'] = $embedConfig['video_available_speeds'];
        }
        if (array_key_exists('audio_player', $embedConfig)) {
            $config['audio']['player'] = $embedConfig['audio_player'];
        }
        if (array_key_exists('audio_autoplay', $embedConfig)) {
            $config['audio']['autoplay'] = $embedConfig['audio_autoplay'];
        }
        if (array_key_exists('audio_available_speeds', $embedConfig)) {
            $config['audio']['available_speeds'] = $embedConfig['audio_available_speeds'];
        }
        if (array_key_exists('enable_pdfjs', $embedConfig['document'])) {
            $config['document']['enable_pdfjs'] = $embedConfig['document']['enable_pdfjs'];
        }

        return $config;
    }
}
