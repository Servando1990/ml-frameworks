import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Define the log file path
const LOG_FILE = path.join(process.cwd(), 'logs', 'use-cases.log');

// Get the secret key from environment variables
// Fallback to a default value if not set (but you should set it in .env.local)
const SECRET_KEY = process.env.LOG_ACCESS_PASSWORD || 'controlthrive-servando-2024';

// Ensure the logs directory exists
async function ensureLogDirectory() {
  const logDir = path.join(process.cwd(), 'logs');
  try {
    await fsPromises.access(logDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fsPromises.mkdir(logDir, { recursive: true });
  }
}

export async function GET(request: Request) {
  // Get the secret key from the request
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('key');
  
  // Check if the secret key is valid
  if (secretKey !== SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  try {
    await ensureLogDirectory();
    
    // Check if log file exists
    try {
      await fsPromises.access(LOG_FILE);
    } catch (error) {
      // File doesn't exist yet
      return NextResponse.json({ logs: [] });
    }
    
    // Read and parse log file
    const logContent = await fsPromises.readFile(LOG_FILE, 'utf8');
    const logs = logContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
} 