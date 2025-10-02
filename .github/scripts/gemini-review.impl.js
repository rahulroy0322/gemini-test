"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewCode = void 0;
require("dotenv/config");
const promises_1 = require("node:fs/promises");
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const reviewCode = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diff = yield (0, promises_1.readFile)("pr_diff.txt", "utf8");
        const changedFiles = yield (0, promises_1.readFile)("changed_files.txt", "utf8");
        const prTitle = process.env.PR_TITLE || "No title provided";
        const prBody = process.env.PR_BODY || "No description provided";
        console.log("🤖 Starting Gemini AI code review...");
        console.log(`📋 PR Title: ${prTitle}`);
        console.log(`📁 Files changed: ${changedFiles.split("\n").length}`);
        const maxDiffLength = 30000;
        const truncatedDiff = diff.length > maxDiffLength
            ? diff.substring(0, maxDiffLength) +
                "\n\n... (diff truncated due to size)"
            : diff;
        const prompt = `You are an expert code reviewer with deep knowledge of software engineering best practices, security, and performance optimization.

Please review this Pull Request thoroughly and provide actionable feedback.

**PR Title:** ${prTitle}

**PR Description:**
${prBody}

**Changed Files:**
${changedFiles}

**Code Diff:**
\`\`\`diff
${truncatedDiff}
\`\`\`

Please provide a comprehensive code review covering these areas:

## 1. 📝 Code Quality & Best Practices
- Review code readability, maintainability, and adherence to coding standards
- Check naming conventions, code organization, and documentation
- Identify any code smells or anti-patterns

## 2. ⚠️ Potential Errors & Edge Cases
- Identify potential runtime errors, null pointer exceptions, or type issues
- Check for unhandled edge cases or boundary conditions
- Look for race conditions, deadlocks, or concurrency issues

## 3. 🐛 Bug Detection
- Find logical errors or incorrect implementations
- Identify bugs that could cause unexpected behavior
- Check for off-by-one errors, incorrect comparisons, or faulty logic

## 4. 💡 Suggestions for Improvement
- Recommend performance optimizations
- Suggest better algorithms or data structures
- Propose code refactoring opportunities
- Recommend additional test cases

## 5. 🔒 Security Concerns
- Flag potential security vulnerabilities (SQL injection, XSS, etc.)
- Check for exposed secrets, API keys, or sensitive data
- Identify authentication/authorization issues
- Look for unsafe input handling

## 6. ✅ Positive Feedback
- Highlight what was done well
- Acknowledge good practices and clever solutions

**Important:**
- Be specific and reference file names and line numbers where possible
- Prioritize critical issues over minor style preferences
- Provide code examples for your suggestions when helpful
- Use a constructive and helpful tone

Format your response in clear markdown with sections and bullet points.`;
        const result = yield ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const response = result.text;
        yield (0, promises_1.writeFile)("review_output.md", JSON.stringify(response));
        console.log("✅ Review generated successfully!");
        console.log(`📄 Review saved to review_output.md (${response.length} characters)`);
    }
    catch (_e) {
        const e = _e;
        console.error("❌ Error generating review:", e.message);
        const errorMessage = `## ⚠️ Review Generation Failed

An error occurred while generating the AI review:

\`\`\`
${e.message}
\`\`\`

// Please check the workflow logs for more details.`;
        yield (0, promises_1.writeFile)("review_output.md", errorMessage);
        process.exit(1);
    }
});
exports.reviewCode = reviewCode;
//# sourceMappingURL=gemini-review.impl.js.map