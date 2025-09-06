#!/usr/bin/env node

/**
 * BOB Usage Tracking Script
 *
 * Tracks agent usage patterns and learning data:
 * - Injection point usage frequency
 * - Token consumption patterns
 * - Session continuity metrics
 * - Efficiency improvements over time
 *
 * Usage: node scripts/usage-tracker.js [command] [options]
 *
 * Commands:
 * - track <injection-point> - Record usage of an injection point
 * - token <amount> - Record token usage for current session
 * - session <start|end> - Mark session boundaries
 * - analyze - Show usage analytics
 * - optimize - Generate optimization recommendations
 */

const fs = require('fs');
const path = require('path');

const SESSION_FILE = '.bob/session.json';
const CONFIG_FILE = 'bob-config.json';

function loadSessionData() {
  if (fs.existsSync(SESSION_FILE)) {
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  }
  return {
    lastSession: null,
    ongoingTasks: [],
    learnedPatterns: {
      preferredInjectionPoints: [],
      commonWorkflows: [],
      tokenEfficiencyTips: []
    },
    usageStats: {
      sessions: 0,
      totalTokens: 0,
      avgTokensPerSession: 0,
      mostUsedInjectionPoints: {},
      peakEfficiency: 0
    }
  };
}

function saveSessionData(data) {
  const dir = path.dirname(SESSION_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
}

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return null;
}

function trackInjectionPoint(injectionPoint) {
  const sessionData = loadSessionData();
  const config = loadConfig();

  // Track in session data
  if (!sessionData.usageStats.mostUsedInjectionPoints[injectionPoint]) {
    sessionData.usageStats.mostUsedInjectionPoints[injectionPoint] = 0;
  }
  sessionData.usageStats.mostUsedInjectionPoints[injectionPoint]++;

  // Update learned patterns
  if (!sessionData.learnedPatterns.preferredInjectionPoints.includes(injectionPoint)) {
    sessionData.learnedPatterns.preferredInjectionPoints.push(injectionPoint);
  }

  // Update config if available
  if (config) {
    if (!config.injectionPoints.learnedFavorites.includes(injectionPoint)) {
      config.injectionPoints.learnedFavorites.push(injectionPoint);
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    }
  }

  saveSessionData(sessionData);
  console.log(`✅ Tracked usage of injection point: ${injectionPoint}`);
}

function recordTokenUsage(amount) {
  const sessionData = loadSessionData();

  sessionData.usageStats.totalTokens += parseInt(amount);
  sessionData.usageStats.avgTokensPerSession =
    sessionData.usageStats.totalTokens / Math.max(sessionData.usageStats.sessions, 1);

  // Check for alerts
  const config = loadConfig();
  if (config && sessionData.usageStats.totalTokens >= config.bob.limits.alertThreshold) {
    console.log(`🚨 TOKEN ALERT: Session has used ${sessionData.usageStats.totalTokens} tokens`);
    console.log(`💡 Tip: Consider using BOB's injection points for efficiency`);
  }

  saveSessionData(sessionData);
  console.log(`📊 Recorded ${amount} tokens used (Total: ${sessionData.usageStats.totalTokens})`);
}

function startSession() {
  const sessionData = loadSessionData();

  sessionData.usageStats.sessions++;
  sessionData.lastSession = {
    timestamp: new Date().toISOString(),
    project: process.cwd().split('/').pop(),
    agent: 'BOB-Tracked',
    tokensUsed: 0,
    contextSummary: 'Session started'
  };

  saveSessionData(sessionData);
  console.log('🚀 BOB session started - tracking enabled');
}

function endSession() {
  const sessionData = loadSessionData();

  if (sessionData.lastSession) {
    sessionData.lastSession.contextSummary = 'Session completed';
    console.log('✅ BOB session ended - data saved');
  }

  saveSessionData(sessionData);
}

function showAnalytics() {
  const sessionData = loadSessionData();

  console.log('\n📈 BOB Usage Analytics\n');

  console.log('Sessions:', sessionData.usageStats.sessions);
  console.log('Total Tokens:', sessionData.usageStats.totalTokens);
  console.log('Avg Tokens/Session:', Math.round(sessionData.usageStats.avgTokensPerSession));

  console.log('\n🎯 Most Used Injection Points:');
  const sorted = Object.entries(sessionData.usageStats.mostUsedInjectionPoints)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  sorted.forEach(([point, count]) => {
    console.log(`  ${point}: ${count} times`);
  });

  console.log('\n🧠 Learned Patterns:');
  console.log('Preferred Injection Points:', sessionData.learnedPatterns.preferredInjectionPoints.length);
  console.log('Common Workflows:', sessionData.learnedPatterns.commonWorkflows.length);
}

function generateOptimization() {
  const sessionData = loadSessionData();
  const config = loadConfig();

  console.log('\n🎯 BOB Optimization Recommendations\n');

  // Analyze injection point usage
  const totalUsage = Object.values(sessionData.usageStats.mostUsedInjectionPoints).reduce((a, b) => a + b, 0);
  const topPoints = Object.entries(sessionData.usageStats.mostUsedInjectionPoints)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  if (topPoints.length > 0) {
    console.log('📌 Top Injection Points - Consider promoting to quick access:');
    topPoints.forEach(([point, count]) => {
      const percentage = Math.round((count / totalUsage) * 100);
      console.log(`  ${point}: ${percentage}% of usage`);
    });
  }

  // Token efficiency analysis
  const avgTokens = sessionData.usageStats.avgTokensPerSession;
  if (avgTokens > 10000) {
    console.log('\n💰 High Token Usage Detected');
    console.log('  Consider using injection points more frequently');
    console.log('  Break complex tasks into smaller sessions');
  }

  // Learning recommendations
  if (sessionData.learnedPatterns.preferredInjectionPoints.length < 3) {
    console.log('\n🧠 Learning Recommendations');
    console.log('  Continue using different injection points to improve learning');
    console.log('  BOB will optimize recommendations based on your patterns');
  }
}

// Main command handler
const [,, command, ...args] = process.argv;

try {
  switch (command) {
    case 'track':
      if (!args[0]) {
        console.log('Usage: node scripts/usage-tracker.js track <injection-point>');
        process.exit(1);
      }
      trackInjectionPoint(args[0]);
      break;

    case 'token':
      if (!args[0] || isNaN(args[0])) {
        console.log('Usage: node scripts/usage-tracker.js token <amount>');
        process.exit(1);
      }
      recordTokenUsage(args[0]);
      break;

    case 'session':
      if (args[0] === 'start') startSession();
      else if (args[0] === 'end') endSession();
      else console.log('Usage: node scripts/usage-tracker.js session <start|end>');
      break;

    case 'analyze':
      showAnalytics();
      break;

    case 'optimize':
      generateOptimization();
      break;

    default:
      console.log('BOB Usage Tracker');
      console.log('Usage: node scripts/usage-tracker.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  track <injection-point>  - Track usage of injection point');
      console.log('  token <amount>          - Record token usage');
      console.log('  session <start|end>     - Mark session boundaries');
      console.log('  analyze                 - Show usage analytics');
      console.log('  optimize                - Generate optimization recommendations');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
