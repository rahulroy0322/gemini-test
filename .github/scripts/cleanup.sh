#!/bin/bash

# Clean up temporary files created during the workflow

echo "🧹 Cleaning up temporary files..."

# Remove temporary files
rm -f pr_diff.txt
rm -f changed_files.txt
rm -f review_output.md

echo "✓ Cleanup complete!"
