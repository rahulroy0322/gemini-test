#!/bin/bash

# Get the PR diff and save to file
echo "Fetching PR diff..."

# Fetch the base branch
git fetch origin $BASE_REF

# Get the diff between base and current branch
DIFF=$(git diff origin/$BASE_REF...HEAD)

# Save diff to file
echo "$DIFF" > pr_diff.txt
echo "✓ Diff saved to pr_diff.txt"

# Get list of changed files
CHANGED_FILES=$(git diff --name-only origin/$BASE_REF...HEAD)

# Save changed files to file
echo "$CHANGED_FILES" > changed_files.txt
echo "✓ Changed files saved to changed_files.txt"

# Display summary
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)
echo "Total files changed: $FILE_COUNT"