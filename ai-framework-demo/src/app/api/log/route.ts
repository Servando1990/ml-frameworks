import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Define the log file path
const LOG_FILE = path.join(process.cwd(), 'logs', 'use-cases.log');

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

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Create a log entry with timestamp
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      useCase: data,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Ensure log directory exists
    await ensureLogDirectory();
    
    // Append to log file
    const logString = JSON.stringify(logEntry) + '\n';
    await fsPromises.appendFile(LOG_FILE, logString, 'utf8');
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Log entry created' });
  } catch (error) {
    console.error('Error logging use case:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log use case' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to retrieve logs (password protected)
export async function GET(request: Request) {
  // For security, you might want to add authentication here
  // This is a simple example with a query parameter password
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');
  
  // Very simple password protection (you should use a more secure method in production)
  if (password !== process.env.LOG_ACCESS_PASSWORD) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
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