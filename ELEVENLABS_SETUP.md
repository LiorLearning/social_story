# ElevenLabs Voice Integration Setup

This application supports high-quality AI voice narration using ElevenLabs API.

## Setup Instructions

1. **Get ElevenLabs API Key**
   - Sign up at [ElevenLabs](https://elevenlabs.io)
   - Go to Settings > API Keys
   - Create a new API key

2. **Configure Environment Variable**
   - Create a `.env.local` file in the project root
   - Add your API key:
   ```
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   ```

3. **Usage**
   - Once configured, you'll see an "ElevenLabs AI Voice" toggle in the Listen menu
   - Toggle it on to use high-quality AI voices instead of browser speech synthesis
   - Select from child-friendly voices optimized for storytelling

## Features

- **High-Quality Voices**: Professional AI voices optimized for children's content
- **Child-Friendly Selection**: Automatically filters voices suitable for storytelling
- **Seamless Integration**: Works alongside existing browser speech synthesis
- **Speed Control**: Adjust playback speed (though ElevenLabs has some limitations)
- **Word Highlighting**: Synchronized word highlighting during playback

## Recommended Voices

The system automatically selects child-friendly voices including:
- Rachel (warm, clear female voice)
- Josh (friendly male voice)  
- Bella (young, energetic female voice)
- Antoni (calm, storytelling voice)

## Cost Considerations

ElevenLabs is a paid service. Each story page generates a new audio file, so costs will depend on usage. The free tier includes some monthly credits to get started.

## Fallback

If ElevenLabs is not configured or fails, the app automatically falls back to browser speech synthesis, ensuring the read-aloud feature always works.
