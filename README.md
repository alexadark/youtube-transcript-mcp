# YouTube Transcript MCP

A Model Context Protocol (MCP) server that fetches YouTube video transcripts with proper text formatting. Returns clean, readable text instead of `[object Object]`.

## Features

- ✅ **Three output formats**: plain text, timestamped, or JSON
- ✅ **Multi-language support**: Fetch transcripts in any available language
- ✅ **Proper text formatting**: Returns actual transcript text, not object references
- ✅ **Flexible input**: Accepts YouTube URLs or video IDs
- ✅ **Error handling**: Clear error messages for common issues

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Quick Install

```bash
# Clone the repository
git clone https://github.com/alexadark/youtube-transcript-mcp.git
cd youtube-transcript-mcp

# Install dependencies and build
npm install
npm run build
```

## Configuration

### Claude Code

Add to your Claude Code configuration:

```bash
claude mcp add --transport stdio youtube-transcript \
  -- node /path/to/youtube-transcript-mcp/build/index.js
```

**Example**:
```bash
claude mcp add --transport stdio youtube-transcript \
  -- node ~/DEV/mcp/youtube-transcript-mcp/build/index.js
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/DEV/mcp/youtube-transcript-mcp/build/index.js"
      ]
    }
  }
}
```

**Important**: Replace `YOUR_USERNAME` and the path with your actual values.

## Usage

### Get Transcript (Plain Text)

The default format returns clean, readable text:

```typescript
get_transcript({
  url: "https://youtu.be/eT_6uaHNlk8",
  lang: "en"
})
```

### Get Transcript (Timestamped)

Get each line prefixed with its timestamp:

```typescript
get_transcript({
  url: "https://youtu.be/eT_6uaHNlk8",
  lang: "en",
  format: "timestamped"
})
```

### Get Transcript (JSON)

Get structured data for processing:

```typescript
get_transcript({
  url: "https://youtu.be/eT_6uaHNlk8",
  lang: "en",
  format: "json"
})
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | ✅ Yes | - | YouTube video URL or video ID |
| `lang` | string | No | `"en"` | Language code (e.g., 'en', 'es', 'fr') |
| `format` | string | No | `"plain"` | Output format: 'plain', 'timestamped', or 'json' |

## License

MIT
