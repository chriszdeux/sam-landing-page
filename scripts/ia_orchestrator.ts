import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const IA_DIR = path.join(process.cwd(), '.ia');
const CHANNEL_PATH = path.join(IA_DIR, 'channel.md');
const ERRORS_PATH = path.join(IA_DIR, 'errors.md');
const COMMANDS_PATH = path.join(IA_DIR, 'commands.md');

const SIGNATURE = 'ATTE: FRONT'; // This should be dynamic based on module

function logCommand(command: string, description: string) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] - ${command} - ${description}\n`;
    fs.appendFileSync(COMMANDS_PATH, entry);
}

function rotateChannel() {
    if (!fs.existsSync(CHANNEL_PATH)) return;
    const content = fs.readFileSync(CHANNEL_PATH, 'utf-8');
    const lines = content.split('\n');
    if (lines.length > 500) {
        const keptLines = lines.slice(0, 300);
        fs.writeFileSync(CHANNEL_PATH, keptLines.join('\n'));
    }
}

function insertToChannel(message: string) {
    const separator = '\n---\n';
    const signedMessage = `${message}${separator}${SIGNATURE}\n\n`;
    
    let currentContent = '';
    if (fs.existsSync(CHANNEL_PATH)) {
        currentContent = fs.readFileSync(CHANNEL_PATH, 'utf-8');
    }
    
    const newContent = signedMessage + currentContent;
    fs.writeFileSync(CHANNEL_PATH, newContent);
    rotateChannel();
}

function getSiblingsChannels() {
    const rootDir = path.join(process.cwd(), '..');
    const modules = ['sam-backend', 'sam-crm', 'sam-landing-page'];
    const currentModule = path.basename(process.cwd());
    
    const results: string[] = [];
    
    for (const mod of modules) {
        if (mod === currentModule) continue;
        const siblingChannel = path.join(rootDir, mod, '.ia', 'channel.md');
        if (fs.existsSync(siblingChannel)) {
            const content = fs.readFileSync(siblingChannel, 'utf-8');
            const header = content.split('\n')[0]; // Read header/first message
            results.push(`[${mod}] ${header}`);
        }
    }
    return results;
}

export function inbox() {
    console.log('--- LOCAL INBOX ---');
    if (fs.existsSync(CHANNEL_PATH)) {
        const content = fs.readFileSync(CHANNEL_PATH, 'utf-8');
        console.log(content.split('\n').slice(0, 10).join('\n'));
    }
    
    console.log('\n--- SIBLINGS INBOX ---');
    const siblings = getSiblingsChannels();
    siblings.forEach(s => console.log(s));
    
    logCommand('/inbox', 'Read local and sibling channels');
}

export function review() {
    console.log('--- ERRORS REVIEW ---');
    if (fs.existsSync(ERRORS_PATH)) {
        console.log(fs.readFileSync(ERRORS_PATH, 'utf-8'));
    }
    logCommand('/review', 'Read errors.md');
}

export function newTask() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        const fileName = branch.replace(/\//g, '-') + '-task.md';
        const filePath = path.join(IA_DIR, fileName);
        
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, `# Task: ${branch}\n\n- [ ] Initial setup`);
            console.log(`Created task file: ${fileName}`);
        } else {
            console.log(`Task file already exists: ${fileName}`);
        }
        logCommand('/new-task', `Created task file for branch ${branch}`);
    } catch (error) {
        console.error('Error getting git branch:', error);
    }
}

export function commit(message: string) {
    // Validation: English, max 15 words
    const words = message.trim().split(/\s+/);
    if (words.length > 15) {
        console.error('Error: Commit message exceeds 15 words.');
        process.exit(1);
    }
    
    // English validation: Check for non-ASCII or common Spanish words
    const spanishWords = ['el', 'la', 'de', 'que', 'en', 'y', 'los', 'un', 'con', 'por', 'para', 'como'];
    const hasSpanish = words.some(w => spanishWords.includes(w.toLowerCase()));
    const isNonAscii = /[^\x00-\x7F]/.test(message);
    
    if (hasSpanish || isNonAscii) {
        console.error('Error: Commit message must be strictly in English.');
        process.exit(1);
    }
    
    try {
        execSync('git add .');
        execSync(`git commit -m "${message}"`);
        console.log('Commit successful.');
        logCommand('/commit', `Executed git commit: ${message}`);
    } catch (error) {
        console.error('Commit failed:', error);
        process.exit(1);
    }
}

// CLI Entry point
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '/inbox':
        inbox();
        break;
    case '/review':
        review();
        break;
    case '/new-task':
        newTask();
        break;
    case '/commit':
        commit(args.slice(1).join(' '));
        break;
    case 'insert':
        insertToChannel(args.slice(1).join(' '));
        break;
    default:
        console.log('Unknown command. Available: /inbox, /review, /new-task, /commit, insert');
}
