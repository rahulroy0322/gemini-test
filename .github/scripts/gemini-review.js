const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const reviewCode = async () => {
  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Read PR data from files
    const diff = fs.readFileSync("pr_diff.txt", "utf8");
    const changedFiles = fs.readFileSync("changed_files.txt", "utf8");

    // Get PR metadata from environment variables
    const prTitle = process.env.PR_TITLE || "No title provided";
    const prBody = process.env.PR_BODY || "No description provided";

    console.log("🤖 Starting Gemini AI code review...");
    console.log(`📋 PR Title: ${prTitle}`);
    console.log(`📁 Files changed: ${changedFiles.split("\n").length}`);

    // Truncate diff if too large (Gemini has token limits)
    const maxDiffLength = 30000;
    const truncatedDiff =
      diff.length > maxDiffLength
        ? diff.substring(0, maxDiffLength) +
          "\n\n... (diff truncated due to size)"
        : diff;

    // Create comprehensive review prompt
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

    // Generate review using Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const review = response.text();

    // Save review to file for the next step
    fs.writeFileSync("review_output.md", review);

    console.log("✅ Review generated successfully!");
    console.log(
      `📄 Review saved to review_output.md (${review.length} characters)`
    );
  } catch (error) {
    console.error("❌ Error generating review:", error.message);

    // Create error message for PR comment
    const errorMessage = `## ⚠️ Review Generation Failed

An error occurred while generating the AI review:

\`\`\`
${error.message}
\`\`\`

Please check the workflow logs for more details.`;

    fs.writeFileSync("review_output.md", errorMessage);
    process.exit(1);
  }
};

// Run the review
reviewCode();
