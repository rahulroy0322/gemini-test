#!/bin/bash

# Clean up temporary files created during the workflow

echo "🧹 Cleaning up temporary files..."

# Remove temporary files
rm -f pr_diff.txt
rm -f changed_files.txt
rm -f review_output.md
rm -rf node_modules
rm -f dist
rm -f package.lock

echo "✓ Cleanup complete!"
