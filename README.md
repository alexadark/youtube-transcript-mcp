# YouTube Transcript MCP

Get YouTube video transcripts directly in Claude. Just share a YouTube link - no technical syntax needed.

## What It Does

Share any YouTube URL with Claude, and this MCP lets Claude fetch the transcript for you. Claude will naturally ask how you'd like to view it:

- **Readable text** - Clean paragraphs, perfect for reading and analysis
- **With timestamps** - Each line shows when it was said (great for referencing specific moments)
- **Structured data** - JSON format with full metadata (for developers)

Works with any YouTube video that has captions, in any language.

## Installation

**One command:**

```bash
npm install -g youtube-transcript-mcp
```

## Setup

### For Claude Code

```bash
claude mcp add youtube-transcript
```

Restart Claude Code and you're done!

### For Claude Desktop

1. Open `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add this:

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "npx",
      "args": ["-y", "youtube-transcript-mcp"]
    }
  }
}
```

3. Restart Claude Desktop

## How to Use

Just chat naturally with Claude:

> "Can you get the transcript from https://youtu.be/dQw4w9WgXcQ?"

> "Summarize this video: https://youtu.be/eT_6uaHNlk8"

> "Get me the transcript with timestamps from this tutorial..."

Claude will handle everything - fetching the transcript, asking about your format preference, and displaying it clearly.

### Multiple Languages

Works with any language that has captions:

> "Get the Spanish transcript from this video"

> "Show me this video's transcript in French"

Common language codes: `en`, `es`, `fr`, `de`, `ja`, `ko`, `zh`, `pt`, `ru`, `ar`, `hi`

## License

MIT
