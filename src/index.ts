#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fetchTranscript } from "youtube-transcript-plus";

interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

type TranscriptFormat = "plain" | "timestamped" | "json";

/**
 * Formats seconds into HH:MM:SS or MM:SS format
 */
function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Extracts video ID from YouTube URL or returns the input if it's already an ID
 */
function extractVideoId(urlOrId: string): string {
  // If it's already just an ID (no URL patterns), return it
  if (!/[/:.]/.test(urlOrId)) {
    return urlOrId;
  }

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/shorts\/([^&\?\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matched, assume it's an ID
  return urlOrId;
}

/**
 * Formats transcript segments into plain text paragraphs
 */
function formatPlainText(segments: TranscriptSegment[]): string {
  return segments.map((segment) => segment.text.trim()).join(" ");
}

/**
 * Formats transcript segments with timestamps
 */
function formatTimestamped(segments: TranscriptSegment[]): string {
  return segments
    .map((segment) => {
      const timestamp = formatTimestamp(segment.offset);
      return `[${timestamp}] ${segment.text.trim()}`;
    })
    .join("\n");
}

/**
 * Formats transcript segments as JSON
 */
function formatJson(segments: TranscriptSegment[]): string {
  const formatted = segments.map((segment) => ({
    timestamp: formatTimestamp(segment.offset),
    offset: segment.offset,
    duration: segment.duration,
    text: segment.text.trim(),
  }));
  return JSON.stringify(formatted, null, 2);
}

const server = new Server(
  {
    name: "youtube-transcript-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_transcript",
        description:
          "Fetch and format YouTube video transcript. Supports multiple output formats: plain text (readable paragraphs), timestamped text (each line with timestamp), or structured JSON.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "YouTube video URL or video ID",
            },
            lang: {
              type: "string",
              description:
                "Language code for transcript (e.g., 'en', 'es', 'fr'). Defaults to 'en'.",
              default: "en",
            },
            format: {
              type: "string",
              enum: ["plain", "timestamped", "json"],
              description:
                "Output format: 'plain' for readable text (default), 'timestamped' for text with timestamps, 'json' for structured data",
              default: "plain",
            },
          },
          required: ["url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "get_transcript") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const url = String(request.params.arguments?.url || "");
  const lang = String(request.params.arguments?.lang || "en");
  const format = (request.params.arguments?.format || "plain") as TranscriptFormat;

  if (!url) {
    throw new Error("URL parameter is required");
  }

  try {
    const videoId = extractVideoId(url);
    const transcript = await fetchTranscript(videoId, { lang });

    let formattedText: string;
    switch (format) {
      case "timestamped":
        formattedText = formatTimestamped(transcript);
        break;
      case "json":
        formattedText = formatJson(transcript);
        break;
      case "plain":
      default:
        formattedText = formatPlainText(transcript);
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: formattedText,
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      content: [
        {
          type: "text",
          text: `Error fetching transcript: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("YouTube Transcript MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
